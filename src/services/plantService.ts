export interface PlantData {
    id: string;
    commonName: string;
    scientificName: string;
    family: string;
    confidence: number;
    description: string;
    care: {
        water: string;
        light: string;
        temperature: string;
        soil: string;
    };
    toxicity: string;
    image: string;
}

export const MOCK_PLANTS: PlantData[] = [
    {
        id: '1',
        commonName: 'Monstera Deliciosa',
        scientificName: 'Monstera deliciosa',
        family: 'Araceae',
        confidence: 0.98,
        description: 'Commonly known as the Swiss cheese plant, it is a species of flowering plant native to tropical forests of southern Mexico.',
        care: {
            water: 'Every 1-2 weeks',
            light: 'Bright indirect sunlight',
            temperature: '18°C - 30°C',
            soil: 'Well-draining, peat-based'
        },
        toxicity: 'Toxic to cats and dogs if ingested.',
        image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '2',
        commonName: 'Snake Plant',
        scientificName: 'Dracaena trifasciata',
        family: 'Asparagaceae',
        confidence: 0.95,
        description: 'A species of flowering plant in the family Asparagaceae, native to tropical West Africa from Nigeria east to the Congo.',
        care: {
            water: 'Every 2-8 weeks',
            light: 'Low to bright indirect',
            temperature: '15°C - 27°C',
            soil: 'Well-draining cactus mix'
        },
        toxicity: 'Mildly toxic if ingested.',
        image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1b79?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '3',
        commonName: 'Peace Lily',
        scientificName: 'Spathiphyllum',
        family: 'Araceae',
        confidence: 0.92,
        description: 'They are renowned for their ability to remove common indoor air pollutants such as benzene and formaldehyde.',
        care: {
            water: 'Weekly, keep soil moist',
            light: 'Low to partial shade',
            temperature: '18°C - 24°C',
            soil: 'Rich, moist soil'
        },
        toxicity: 'Toxic to humans and pets if ingested.',
        image: 'https://images.unsplash.com/photo-1597055181300-e3633a207519?auto=format&fit=crop&q=80&w=800'
    }
];

export const identifyPlant = async (imageData: string): Promise<PlantData> => {
    // Simulate API network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For mock purposes, return a random plant from the list
    const randomIndex = Math.floor(Math.random() * MOCK_PLANTS.length);
    return {
        ...MOCK_PLANTS[randomIndex],
        // Use the captured image if available (mocking)
        image: imageData || MOCK_PLANTS[randomIndex].image
    };
};
