import type { PlantData } from './plantService';

const HISTORY_KEY = 'plantae_history';
const GARDEN_KEY = 'plantae_garden';

export interface HistoryItem extends PlantData {
    timestamp: number;
}

/** Strip large base64 images before storing. Replace with a meaningful fallback URL. */
function sanitizeForStorage(plant: PlantData): PlantData {
    const image = plant.image;
    // If it's a data URI (base64), replace with a stable Unsplash fallback URL
    if (image && image.startsWith('data:')) {
        const query = encodeURIComponent(plant.commonName + ' plant');
        return {
            ...plant,
            image: `https://images.unsplash.com/search/photos/${query}?auto=format&fit=crop&q=80&w=400`
        };
    }
    return plant;
}

export const storageService = {
    getHistory: (): HistoryItem[] => {
        try {
            const data = localStorage.getItem(HISTORY_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Failed to parse history", e);
            return [];
        }
    },

    addToHistory: (plant: PlantData) => {
        try {
            const history = storageService.getHistory();
            const sanitized = sanitizeForStorage(plant);
            const newItem: HistoryItem = { ...sanitized, timestamp: Date.now() };
            // Avoid duplicates by id within same session
            const filtered = history.filter(h => h.id !== plant.id);
            const updatedHistory = [newItem, ...filtered].slice(0, 50); // Keep last 50
            localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
            return updatedHistory;
        } catch (e) {
            console.error("Failed to add to history", e);
            return storageService.getHistory();
        }
    },

    clearHistory: (): HistoryItem[] => {
        try {
            localStorage.removeItem(HISTORY_KEY);
            return [];
        } catch {
            return [];
        }
    },

    getGarden: (): PlantData[] => {
        try {
            const data = localStorage.getItem(GARDEN_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Failed to parse garden", e);
            return [];
        }
    },

    addToGarden: (plant: PlantData) => {
        try {
            const garden = storageService.getGarden();
            const sanitized = sanitizeForStorage(plant);
            if (!garden.find(p => p.id === sanitized.id)) {
                const updatedGarden = [sanitized, ...garden];
                localStorage.setItem(GARDEN_KEY, JSON.stringify(updatedGarden));
                return updatedGarden;
            }
            return garden;
        } catch (e) {
            console.error("Failed to add to garden", e);
            return storageService.getGarden();
        }
    },

    clearGarden: (): PlantData[] => {
        try {
            localStorage.removeItem(GARDEN_KEY);
            return [];
        } catch {
            return [];
        }
    },

    removeFromGarden: (plantId: string) => {
        try {
            const garden = storageService.getGarden();
            const updatedGarden = garden.filter(p => p.id !== plantId);
            localStorage.setItem(GARDEN_KEY, JSON.stringify(updatedGarden));
            return updatedGarden;
        } catch (e) {
            console.error("Failed to remove from garden", e);
            return storageService.getGarden();
        }
    }
};
