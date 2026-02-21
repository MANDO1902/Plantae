import type { PlantData } from './plantService';

const HISTORY_KEY = 'plantae_history';
const GARDEN_KEY = 'plantae_garden';

export interface HistoryItem extends PlantData {
    timestamp: number;
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
            const newItem: HistoryItem = { ...plant, timestamp: Date.now() };
            const updatedHistory = [newItem, ...history].slice(0, 50); // Keep last 50
            localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
            return updatedHistory;
        } catch (e) {
            console.error("Failed to add to history", e);
            return storageService.getHistory();
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
            if (!garden.find(p => p.id === plant.id)) {
                const updatedGarden = [plant, ...garden];
                localStorage.setItem(GARDEN_KEY, JSON.stringify(updatedGarden));
                return updatedGarden;
            }
            return garden;
        } catch (e) {
            console.error("Failed to add to garden", e);
            return storageService.getGarden();
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
