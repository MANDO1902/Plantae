import { GoogleGenerativeAI } from '@google/generative-ai';
import type { PlantData } from './plantService';

const API_KEY = import.meta.env.VITE_GEMINI_KEY as string;
const genAI = new GoogleGenerativeAI(API_KEY);

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function cacheGet(key: string): PlantData | null {
    try {
        const raw = localStorage.getItem(`plantae_cache_${key}`);
        if (!raw) return null;
        const { data, ts } = JSON.parse(raw);
        if (Date.now() - ts > CACHE_TTL_MS) {
            localStorage.removeItem(`plantae_cache_${key}`);
            return null;
        }
        return data as PlantData;
    } catch {
        return null;
    }
}

function cacheSet(key: string, data: PlantData) {
    try {
        localStorage.setItem(`plantae_cache_${key}`, JSON.stringify({ data, ts: Date.now() }));
    } catch { /* ignore quota errors */ }
}


const PLANT_JSON_SCHEMA = `Return ONLY a valid JSON object (no markdown, no code fences, no extra text) with this exact shape:
{
  "id": "unique-url-slug",
  "commonName": "string",
  "scientificName": "string",
  "family": "string",
  "confidence": 0.00,
  "description": "3-4 sentence rich, engaging description covering origin, notable traits, and why plant lovers adore it",
  "care": {
    "water": "short actionable phrase",
    "light": "short actionable phrase",
    "temperature": "°C range",
    "soil": "short phrase"
  },
  "toxicity": "short phrase",
  "image": "",
  "tags": ["tag1", "tag2", "tag3"]
}`;

/** Identify a plant from a base64-encoded image using Gemini Vision */
export async function identifyPlantWithGemini(base64Image: string): Promise<PlantData | { error: string }> {
    console.log('[Gemini Debug] Starting identification...');
    if (!API_KEY) {
        console.error('[Gemini Debug] API key missing.');
        return { error: 'API_KEY_MISSING' };
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        let mimeType = 'image/jpeg';
        let pureBase64 = base64Image;

        if (base64Image.startsWith('data:')) {
            const parts = base64Image.split(';base64,');
            if (parts.length === 2) {
                mimeType = parts[0].split(':')[1];
                pureBase64 = parts[1];
            }
        }

        console.log('[Gemini Debug] MimeType:', mimeType);

        const result = await model.generateContent([
            {
                inlineData: { mimeType, data: pureBase64 }
            },
            `Identify this plant. Return JSON only. schema: ${PLANT_JSON_SCHEMA}. If no plant, return "null".`
        ]);

        const text = result.response.text().trim();
        console.log('[Gemini Debug] Raw Response:', text);

        if (text === 'null' || text.toLowerCase().includes('null')) {
            return { error: 'NO_PLANT_DETECTED' };
        }

        let jsonStr = text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonStr = jsonMatch[0];
        }

        const parsed = JSON.parse(jsonStr) as PlantData;
        console.log('[Gemini Debug] Parsed Name:', parsed.commonName);
        return parsed;
    } catch (err: any) {
        console.error('[Gemini Debug] Error:', err);
        const errmsg = err.message?.toLowerCase() || '';
        if (errmsg.includes('429') || errmsg.includes('quota') || errmsg.includes('exhausted')) {
            return { error: 'QUOTA_EXCEEDED' };
        }
        return { error: 'TECHNICAL_ERROR' };
    }
}

/** Get full plant care data for a given plant name using Gemini */
export async function getPlantDetails(name: string): Promise<PlantData | { error: string }> {
    console.log('[Gemini Debug] Fetching details for:', name);
    if (!API_KEY) return { error: 'API_KEY_MISSING' };

    const cacheKey = name.toLowerCase().replace(/\s+/g, '-');
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(
            `Detailed botanical info for: "${name}". JSON only. schema: ${PLANT_JSON_SCHEMA}`
        );
        const text = result.response.text().trim();
        console.log('[Gemini Debug] Raw Response:', text);

        let jsonStr = text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonStr = jsonMatch[0];
        }

        const parsed = JSON.parse(jsonStr) as PlantData;
        cacheSet(cacheKey, parsed);
        return parsed;
    } catch (err: any) {
        console.error('[Gemini Debug] Error:', err);
        const errmsg = err.message?.toLowerCase() || '';
        if (errmsg.includes('429') || errmsg.includes('quota') || errmsg.includes('exhausted')) {
            return { error: 'QUOTA_EXCEEDED' };
        }
        return { error: 'TECHNICAL_ERROR' };
    }
}

/** Search plant names using GBIF autocomplete (no key needed) */
export async function searchGBIF(query: string): Promise<Array<{ name: string; scientific: string }>> {
    if (query.trim().length < 2) return [];
    try {
        const res = await fetch(
            `https://api.gbif.org/v1/species/suggest?q=${encodeURIComponent(query)}&limit=10`
        );
        const data = await res.json() as Array<{ canonicalName?: string; vernacularName?: string; scientificName?: string; family?: string }>;
        const results: Array<{ name: string; scientific: string }> = [];
        const seen = new Set<string>();

        for (const item of data) {
            const common = item.vernacularName || item.canonicalName || item.scientificName || '';
            const scientific = item.scientificName || item.canonicalName || '';

            if (common && !seen.has(common)) {
                seen.add(common);
                results.push({ name: common, scientific: scientific !== common ? scientific : '' });
            }
        }
        return results.slice(0, 8);
    } catch (err) {
        console.error('GBIF search error:', err);
        return [];
    }
}
