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
    tags?: string[];
}

export const MOCK_PLANTS: PlantData[] = [
    {
        id: '1',
        commonName: 'Monstera Deliciosa',
        scientificName: 'Monstera deliciosa',
        family: 'Araceae',
        confidence: 0.98,
        description: 'The Swiss Cheese Plant is native to tropical forests of southern Mexico. Famous for its large, glossy leaves with natural holes called fenestrations.',
        care: { water: 'Every 1–2 weeks', light: 'Bright indirect sunlight', temperature: '18°C – 30°C', soil: 'Well-draining, peat-based' },
        toxicity: 'Toxic to cats & dogs',
        image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=800',
        tags: ['tropical', 'indoor', 'popular']
    },
    {
        id: '2',
        commonName: 'Snake Plant',
        scientificName: 'Dracaena trifasciata',
        family: 'Asparagaceae',
        confidence: 0.95,
        description: 'One of the most tolerant houseplants, the Snake Plant thrives in neglect. Native to West Africa, it is an excellent air purifier.',
        care: { water: 'Every 2–8 weeks', light: 'Low to bright indirect', temperature: '15°C – 27°C', soil: 'Well-draining cactus mix' },
        toxicity: 'Mildly toxic if ingested',
        image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1b79?auto=format&fit=crop&q=80&w=800',
        tags: ['low-maintenance', 'air-purifier', 'indoor']
    },
    {
        id: '3',
        commonName: 'Peace Lily',
        scientificName: 'Spathiphyllum wallisii',
        family: 'Araceae',
        confidence: 0.92,
        description: 'Renowned for graceful white blooms and air-purifying ability. Peace Lilies thrive in low-light conditions, making them ideal for homes and offices.',
        care: { water: 'Weekly, keep moist', light: 'Low to partial shade', temperature: '18°C – 24°C', soil: 'Rich, moist soil' },
        toxicity: 'Toxic to humans & pets',
        image: 'https://images.unsplash.com/photo-1597055181300-e3633a207519?auto=format&fit=crop&q=80&w=800',
        tags: ['flowering', 'air-purifier', 'indoor']
    },
    {
        id: '4',
        commonName: 'Fiddle Leaf Fig',
        scientificName: 'Ficus lyrata',
        family: 'Moraceae',
        confidence: 0.94,
        description: 'A popular indoor tree with large, violin-shaped leaves. Native to western Africa, it thrives in warm, bright environments and makes a dramatic statement.',
        care: { water: 'Every 1–2 weeks', light: 'Bright indirect to direct', temperature: '15°C – 27°C', soil: 'Well-draining loamy soil' },
        toxicity: 'Mildly toxic if ingested',
        image: 'https://images.unsplash.com/photo-1597305877032-0668b3c6413a?auto=format&fit=crop&q=80&w=800',
        tags: ['tree', 'indoor', 'statement']
    },
    {
        id: '5',
        commonName: 'Pothos',
        scientificName: 'Epipremnum aureum',
        family: 'Araceae',
        confidence: 0.97,
        description: 'Often called Devil\'s Ivy, Pothos is nearly indestructible. Its trailing vines look gorgeous in hanging baskets and it tolerates low light and irregular watering effortlessly.',
        care: { water: 'Every 1–2 weeks', light: 'Low to bright indirect', temperature: '15°C – 30°C', soil: 'Any well-draining soil' },
        toxicity: 'Toxic to cats & dogs',
        image: 'https://images.unsplash.com/photo-1572688484438-313a6a50be95?auto=format&fit=crop&q=80&w=800',
        tags: ['trailing', 'beginner-friendly', 'indoor']
    },
    {
        id: '6',
        commonName: 'Aloe Vera',
        scientificName: 'Aloe barbadensis miller',
        family: 'Asphodelaceae',
        confidence: 0.99,
        description: 'A succulent plant species widely grown as a houseplant. The gel from its leaves is used in cosmetics, first aid cream, and for soothing sunburns.',
        care: { water: 'Every 3 weeks', light: 'Bright direct sunlight', temperature: '13°C – 27°C', soil: 'Sandy, well-draining cactus mix' },
        toxicity: 'Toxic to cats & dogs',
        image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8c10616?auto=format&fit=crop&q=80&w=800',
        tags: ['succulent', 'medicinal', 'outdoor']
    },
    {
        id: '7',
        commonName: 'Spider Plant',
        scientificName: 'Chlorophytum comosum',
        family: 'Asparagaceae',
        confidence: 0.93,
        description: 'One of the most adaptable houseplants, producing long arching leaves and small plantlets on trailing stems. Excellent air purifier and safe for all pets.',
        care: { water: 'Every 1–2 weeks', light: 'Indirect to moderate light', temperature: '13°C – 27°C', soil: 'Well-draining potting mix' },
        toxicity: 'Non-toxic (pet safe)',
        image: 'https://images.unsplash.com/photo-1603436326446-74b4f8bbcf74?auto=format&fit=crop&q=80&w=800',
        tags: ['pet-safe', 'air-purifier', 'hanging']
    },
    {
        id: '8',
        commonName: 'ZZ Plant',
        scientificName: 'Zamioculcas zamiifolia',
        family: 'Araceae',
        confidence: 0.91,
        description: 'The ZZ Plant is a tropical perennial with glossy, dark green leaves. It is drought-tolerant and grows slowly, making it perfect for forgetful plant parents.',
        care: { water: 'Every 2–3 weeks', light: 'Low to bright indirect', temperature: '15°C – 27°C', soil: 'Well-draining potting mix' },
        toxicity: 'Mildly toxic if ingested',
        image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&q=80&w=800',
        tags: ['drought-tolerant', 'low-light', 'indoor']
    },
    {
        id: '9',
        commonName: 'Boston Fern',
        scientificName: 'Nephrolepis exaltata',
        family: 'Lomariopsidaceae',
        confidence: 0.89,
        description: 'One of the most popular ferns for hanging baskets. Native to humid forests, it thrives with high humidity and indirect light, producing beautiful arching fronds.',
        care: { water: 'Keep consistently moist', light: 'Bright indirect light', temperature: '15°C – 24°C', soil: 'Peat-based, moisture-retaining' },
        toxicity: 'Non-toxic (pet safe)',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
        tags: ['fern', 'pet-safe', 'hanging', 'humid']
    },
    {
        id: '10',
        commonName: 'Rubber Plant',
        scientificName: 'Ficus elastica',
        family: 'Moraceae',
        confidence: 0.96,
        description: 'A stunning tree with large, glossy burgundy to dark green leaves. Native to South and Southeast Asia, it is one of the most popular ornamental houseplants worldwide.',
        care: { water: 'Every 1–2 weeks', light: 'Bright indirect light', temperature: '15°C – 30°C', soil: 'Well-draining loamy soil' },
        toxicity: 'Toxic to cats & dogs',
        image: 'https://images.unsplash.com/photo-1598880940080-ff9a29891b85?auto=format&fit=crop&q=80&w=800',
        tags: ['tree', 'statement', 'indoor']
    },
    {
        id: '11',
        commonName: 'Chinese Evergreen',
        scientificName: 'Aglaonema commutatum',
        family: 'Araceae',
        confidence: 0.90,
        description: 'Available in stunning green, silver, and red varieties. It is one of the most tolerant of all houseplants, thriving in low light and infrequent watering.',
        care: { water: 'Every 2 weeks', light: 'Low to medium indirect', temperature: '15°C – 27°C', soil: 'Well-draining potting mix' },
        toxicity: 'Toxic to cats & dogs',
        image: 'https://images.unsplash.com/photo-1611048267451-e6ed903d4a38?auto=format&fit=crop&q=80&w=800',
        tags: ['colorful', 'low-light', 'indoor']
    },
    {
        id: '12',
        commonName: 'Cactus',
        scientificName: 'Cactaceae',
        family: 'Cactaceae',
        confidence: 0.97,
        description: 'Cacti are a family of succulent plants adapted to extremely dry environments. They store water in their thick stems and are covered in spines to deter animals.',
        care: { water: 'Every 3–4 weeks', light: 'Full direct sunlight', temperature: '20°C – 35°C', soil: 'Sandy cactus mix' },
        toxicity: 'Non-toxic (spines cause injury)',
        image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
        tags: ['succulent', 'desert', 'outdoor', 'easy']
    },
];

// Simulate plant identification - returns null if no plant detected
export const identifyPlant = async (imageData: string): Promise<PlantData | null> => {
    // Simulate API network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate ~20% chance of no plant being detected (realistic behavior)
    if (Math.random() < 0.2) {
        return null;
    }

    // For mock purposes, return a random plant from the list
    const randomIndex = Math.floor(Math.random() * MOCK_PLANTS.length);
    return {
        ...MOCK_PLANTS[randomIndex],
        // Use the captured image (from camera or upload) or the default image
        image: imageData.startsWith('data:') ? imageData : MOCK_PLANTS[randomIndex].image
    };
};
