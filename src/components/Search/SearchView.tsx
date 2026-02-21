import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon, ArrowRight, Leaf } from 'lucide-react';
import { MOCK_PLANTS } from '../../services/plantService';
import type { PlantData } from '../../services/plantService';

interface SearchViewProps {
    onClose: () => void;
    onSelect: (item: PlantData) => void;
}

const POPULAR_TAGS = ['indoor', 'pet-safe', 'low-light', 'succulent', 'flowering', 'air-purifier', 'beginner-friendly'];

export const SearchView: React.FC<SearchViewProps> = ({ onClose, onSelect }) => {
    const [query, setQuery] = useState('');

    const results = query.trim().length > 0
        ? MOCK_PLANTS.filter((p) =>
            p.commonName.toLowerCase().includes(query.toLowerCase()) ||
            p.scientificName.toLowerCase().includes(query.toLowerCase()) ||
            p.family.toLowerCase().includes(query.toLowerCase()) ||
            (p.tags || []).some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
        : MOCK_PLANTS; // Show all plants when empty

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
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search plants by name or tag..."
                            style={{ background: 'none', border: 'none', outline: 'none', fontSize: '15px', color: '#1A4D2E', fontWeight: '500', width: '100%' }}
                        />
                        {query.length > 0 && (
                            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', lineHeight: 1 }}>✕</button>
                        )}
                    </div>
                    <button onClick={onClose} style={{ width: '44px', height: '44px', background: '#F0F7F0', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                        <X size={20} color="#1A4D2E" />
                    </button>
                </div>

                {/* Tag chips */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
                    {POPULAR_TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setQuery(tag)}
                            style={{
                                flexShrink: 0,
                                padding: '5px 12px',
                                borderRadius: '20px',
                                border: 'none',
                                background: query === tag ? '#1A4D2E' : '#EDF7ED',
                                color: query === tag ? 'white' : '#1A4D2E',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }} className="no-scrollbar">
                <p style={{ fontSize: '12px', color: '#999', fontWeight: '600', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {query ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"` : `All Plants (${MOCK_PLANTS.length})`}
                </p>

                <AnimatePresence>
                    {results.length > 0 ? (
                        results.map((plant, i) => (
                            <motion.button
                                key={plant.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => onSelect(plant)}
                                style={{ width: '100%', background: 'white', padding: '12px', border: '1px solid #E8F5E9', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px', cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 8px rgba(26,77,46,0.05)' }}
                            >
                                <img src={plant.image} alt={plant.commonName} style={{ width: '60px', height: '60px', borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{ fontWeight: '700', fontSize: '15px', color: '#1A4D2E', margin: '0 0 2px' }}>{plant.commonName}</h3>
                                    <p style={{ fontSize: '12px', color: '#4E342E', opacity: 0.55, fontStyle: 'italic', margin: '0 0 6px' }}>{plant.scientificName}</p>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {(plant.tags || []).slice(0, 2).map(tag => (
                                            <span key={tag} style={{ fontSize: '10px', background: '#EDF7ED', color: '#1A4D2E', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <ArrowRight size={18} color="#C8E6C9" style={{ flexShrink: 0 }} />
                            </motion.button>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: '#4E342E', opacity: 0.4 }}>
                            <Leaf size={48} style={{ marginBottom: '12px' }} />
                            <p style={{ fontWeight: '600', margin: 0 }}>No plants found for "{query}"</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
