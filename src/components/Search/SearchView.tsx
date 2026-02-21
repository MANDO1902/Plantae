import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Search as SearchIcon, ArrowRight, Leaf } from 'lucide-react';
import { MOCK_PLANTS } from '../../services/plantService';
import type { PlantData } from '../../services/plantService';

interface SearchViewProps {
    onClose: () => void;
    onSelect: (item: PlantData) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onClose, onSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<PlantData[]>([]);

    useEffect(() => {
        if (query.length > 1) {
            const filtered = MOCK_PLANTS.filter((p: PlantData) =>
                p.commonName.toLowerCase().includes(query.toLowerCase()) ||
                p.scientificName.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'white', display: 'flex', flexDirection: 'column' }}
        >
            {/* Search Bar */}
            <div style={{ padding: '52px 16px 12px', background: 'white', borderBottom: '1px solid #E0EDE0', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <div style={{ flex: 1, background: '#F0F7F0', borderRadius: '16px', display: 'flex', alignItems: 'center', padding: '10px 14px', gap: '10px' }}>
                    <SearchIcon size={18} color="#4CAF50" />
                    <input
                        autoFocus
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search botanical database..."
                        style={{ background: 'none', border: 'none', outline: 'none', fontSize: '15px', color: '#1A4D2E', fontWeight: '500', width: '100%' }}
                    />
                </div>
                <button onClick={onClose} style={{ width: '42px', height: '42px', background: '#F0F7F0', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                    <X size={20} color="#1A4D2E" />
                </button>
            </div>

            {/* Results */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }} className="no-scrollbar">
                {query.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', gap: '12px' }}>
                        <div style={{ width: '64px', height: '64px', background: '#F0F7F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Leaf size={32} color="#C8E6C9" />
                        </div>
                        <p style={{ color: '#4E342E', opacity: 0.4, fontWeight: '500', margin: 0 }}>Try "Monstera" or "Fern"</p>
                    </div>
                ) : results.length > 0 ? (
                    results.map((plant, i) => (
                        <motion.button
                            key={plant.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => onSelect(plant)}
                            style={{ width: '100%', background: 'white', padding: '12px', border: '1px solid #E0EDE0', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px', cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 8px rgba(26,77,46,0.05)' }}
                        >
                            <img src={plant.image} alt={plant.commonName} style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: '700', fontSize: '15px', color: '#1A4D2E', margin: '0 0 3px' }}>{plant.commonName}</h3>
                                <p style={{ fontSize: '12px', color: '#4E342E', opacity: 0.55, fontStyle: 'italic', margin: 0 }}>{plant.scientificName}</p>
                            </div>
                            <ArrowRight size={18} color="#C8E6C9" />
                        </motion.button>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#4E342E', opacity: 0.4, fontWeight: '500' }}>
                        No plants found.
                    </div>
                )}
            </div>
        </motion.div>
    );
};
