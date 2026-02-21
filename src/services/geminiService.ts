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

const PLANT_JSON_SCHEMA = `Return ONLY a valid JSON object (no markdown, no extra text) with this exact shape:
{
  "id": "unique-slug",
  "commonName": "string",
  "scientificName": "string",
  "family": "string",
  "confidence": 0.00,
  "description": "2-3 sentence engaging description",
  "care": {
    "water": "short phrase",
    "light": "short phrase",
    "temperature": "°C range",
    "soil": "short phrase"
  },
  "toxicity": "short phrase",
  "image": "",
  "tags": ["tag1", "tag2"]
}`;

/** Identify a plant from a base64-encoded image using Gemini Vision */
export async function identifyPlantWithGemini(base64Image: string): Promise<PlantData | null> {
    if (!API_KEY) return null;
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const mimeType = base64Image.startsWith('/9j') ? 'image/jpeg' : 'image/png';
        const pureBase64 = base64Image.startsWith('data:')
            ? base64Image.split(',')[1]
            : base64Image;

        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType,
                    data: pureBase64,
                }
            },
            `You are a world-class botanist. Identify the plant in this image.
If there is NO plant visible (e.g. just a wall, person, food, etc.) respond with exactly: null
If a plant IS present: ${PLANT_JSON_SCHEMA}
Set confidence to your certainty 0.0–1.0. Set "image" to "".`
        ]);

        const text = result.response.text().trim();
        if (text === 'null' || text.toLowerCase().includes('no plant')) return null;

        const jsonStr = text.startsWith('{') ? text : text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
        const parsed = JSON.parse(jsonStr) as PlantData;
        return parsed;
    } catch (err) {
        console.error('Gemini identify error:', err);
        return null;
    }
}

/** Get full plant care data for a given plant name using Gemini */
export async function getPlantDetails(name: string): Promise<PlantData | null> {
    if (!API_KEY) return null;
    const cacheKey = name.toLowerCase().replace(/\s+/g, '-');
    const cached = cacheGet(cacheKey);
    if (cached) return cached;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(
            `You are a world-class botanist. Give detailed information about the plant "${name}".
${PLANT_JSON_SCHEMA}
Set "id" to a URL-friendly slug of the name. Set "confidence" to 1.0. Set "image" to "".`
        );
        const text = result.response.text().trim();
        const jsonStr = text.startsWith('{') ? text : text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
        const parsed = JSON.parse(jsonStr) as PlantData;
        cacheSet(cacheKey, parsed);
        return parsed;
    } catch (err) {
        console.error('Gemini plant details error:', err);
        return null;
    }
}

/** Search plant names using GBIF autocomplete (no key needed) */
export async function searchGBIF(query: string): Promise<string[]> {
    if (query.trim().length < 2) return [];
    try {
        const res = await fetch(
            `https://api.gbif.org/v1/species/suggest?q=${encodeURIComponent(query)}&limit=10&rank=SPECIES`
        );
        const data = await res.json() as Array<{ canonicalName?: string; vernacularName?: string }>;
        const names: string[] = [];
        for (const item of data) {
            const n = item.vernacularName || item.canonicalName;
            if (n && !names.includes(n)) names.push(n);
        }
        return names.slice(0, 8);
    } catch {
        return [];
    }
}
