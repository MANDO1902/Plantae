import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon, ArrowRight, Leaf, Loader2 } from 'lucide-react';
import { searchGBIF, getPlantDetails } from '../../services/geminiService';
import { MOCK_PLANTS } from '../../services/plantService';
import type { PlantData } from '../../services/plantService';

interface SearchViewProps {
    onClose: () => void;
    onSelect: (item: PlantData) => void;
}

const POPULAR_TAGS = ['Fern', 'Rose', 'Cactus', 'Orchid', 'Monstera', 'Aloe', 'Bamboo', 'Lavender'];

const SkeletonCard = () => (
    <div style={{ background: 'white', padding: '12px', border: '1px solid #E8F5E9', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '14px', background: '#E8F5E9', flexShrink: 0, animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ flex: 1 }}>
            <div style={{ height: '14px', background: '#E8F5E9', borderRadius: '4px', marginBottom: '8px', width: '60%' }} />
            <div style={{ height: '11px', background: '#F0F7F0', borderRadius: '4px', width: '80%' }} />
        </div>
    </div>
);

export const SearchView: React.FC<SearchViewProps> = ({ onClose, onSelect }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [loadingPlant, setLoadingPlant] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleQueryChange = useCallback((value: string) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (value.trim().length < 2) {
            setSuggestions([]);
            return;
        }
        setIsLoadingSuggestions(true);
        debounceRef.current = setTimeout(async () => {
            const results = await searchGBIF(value);
            setSuggestions(results);
            setIsLoadingSuggestions(false);
        }, 350);
    }, []);

    const handleSelect = async (name: string) => {
        setLoadingPlant(name);
        setSuggestions([]);
        setQuery(name);
        const plant = await getPlantDetails(name);
        setLoadingPlant(null);
        if (plant) {
            // Use a Unsplash image based on name as fallback
            if (!plant.image) {
                plant.image = `https://source.unsplash.com/400x400/?${encodeURIComponent(name + ' plant')}`;
            }
            onSelect(plant);
        }
    };

    const mockResults = MOCK_PLANTS.filter(p =>
        query.length > 0 && (
            p.commonName.toLowerCase().includes(query.toLowerCase()) ||
            p.scientificName.toLowerCase().includes(query.toLowerCase())
        )
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'white', display: 'flex', flexDirection: 'column' }}
        >
            {/* Search Bar */}
            <div style={{ padding: '52px 16px 12px', background: 'white', borderBottom: '1px solid #E0EDE0', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1, background: '#F0F7F0', borderRadius: '16px', display: 'flex', alignItems: 'center', padding: '12px 14px', gap: '10px' }}>
                        <SearchIcon size={18} color="#4CAF50" />
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => handleQueryChange(e.target.value)}
                            placeholder="Search any plant on Earth..."
                            style={{ background: 'none', border: 'none', outline: 'none', fontSize: '15px', color: '#1A4D2E', fontWeight: '500', width: '100%' }}
                        />
                        {query.length > 0 && (
                            <button onClick={() => { setQuery(''); setSuggestions([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>✕</button>
                        )}
                    </div>
                    <button onClick={onClose} style={{ width: '44px', height: '44px', background: '#F0F7F0', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X size={20} color="#1A4D2E" />
                    </button>
                </div>

                {/* Popular tag chips */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
                    {POPULAR_TAGS.map(tag => (
                        <button key={tag} onClick={() => handleQueryChange(tag)} style={{ flexShrink: 0, padding: '5px 14px', borderRadius: '20px', border: 'none', background: query === tag ? '#1A4D2E' : '#EDF7ED', color: query === tag ? 'white' : '#1A4D2E', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }} className="no-scrollbar">

                {/* Loading plant details */}
                {loadingPlant && (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Loader2 size={32} color="#4CAF50" style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
                        <p style={{ color: '#1A4D2E', fontWeight: '600', margin: 0 }}>Gemini is fetching details for "{loadingPlant}"...</p>
                    </div>
                )}

                {/* GBIF Suggestions from live API */}
                {!loadingPlant && suggestions.length > 0 && (
                    <>
                        <p style={{ fontSize: '11px', color: '#999', fontWeight: '700', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Species Suggestions</p>
                        <AnimatePresence>
                            {suggestions.map((name, i) => (
                                <motion.button
                                    key={name}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    onClick={() => handleSelect(name)}
                                    style={{ width: '100%', background: 'white', padding: '14px 16px', border: '1px solid #E8F5E9', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px', cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 6px rgba(26,77,46,0.05)' }}
                                >
                                    <Leaf size={20} color="#4CAF50" style={{ flexShrink: 0 }} />
                                    <span style={{ flex: 1, fontWeight: '600', fontSize: '15px', color: '#1A4D2E' }}>{name}</span>
                                    <ArrowRight size={16} color="#C8E6C9" />
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </>
                )}

                {/* Loading suggestions */}
                {!loadingPlant && isLoadingSuggestions && (
                    <>{[0, 1, 2].map(i => <SkeletonCard key={i} />)}</>
                )}

                {/* Local mock plant matches */}
                {!loadingPlant && !isLoadingSuggestions && mockResults.length > 0 && (
                    <>
                        <p style={{ fontSize: '11px', color: '#999', fontWeight: '700', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Results</p>
                        {mockResults.map((plant, i) => (
                            <motion.button
                                key={plant.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                onClick={() => onSelect(plant)}
                                style={{ width: '100%', background: 'white', padding: '12px', border: '1px solid #E8F5E9', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px', cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 8px rgba(26,77,46,0.05)' }}
                            >
                                <img src={plant.image} alt={plant.commonName} style={{ width: '60px', height: '60px', borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontWeight: '700', fontSize: '15px', color: '#1A4D2E', margin: '0 0 2px' }}>{plant.commonName}</h3>
                                    <p style={{ fontSize: '12px', color: '#4E342E', opacity: 0.55, fontStyle: 'italic', margin: 0 }}>{plant.scientificName}</p>
                                </div>
                                <ArrowRight size={18} color="#C8E6C9" />
                            </motion.button>
                        ))}
                    </>
                )}

                {/* Empty state */}
                {!loadingPlant && !isLoadingSuggestions && query.length === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '60px', gap: '12px' }}>
                        <div style={{ fontSize: '48px' }}>🌿</div>
                        <p style={{ color: '#4E342E', opacity: 0.5, fontWeight: '600', margin: 0, textAlign: 'center' }}>Type any plant name{'\n'}or tap a suggestion above</p>
                        <p style={{ color: '#4CAF50', fontSize: '12px', fontWeight: '600', margin: 0 }}>Powered by GBIF · 2M+ species</p>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
            `}</style>
        </motion.div>
    );
};
