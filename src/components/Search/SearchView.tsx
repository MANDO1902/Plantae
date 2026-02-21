import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon, ArrowRight, Leaf, Loader2 } from 'lucide-react';
import { searchGBIF, getPlantDetails } from '../../services/geminiService';
import type { PlantData } from '../../services/plantService';

interface SearchViewProps {
    onClose: () => void;
    onSelect: (item: PlantData) => void;
    darkMode?: boolean;
}

const POPULAR_TAGS = ['Rose', 'Cactus', 'Orchid', 'Monstera', 'Bamboo', 'Lavender', 'Fern', 'Aloe Vera', 'Jasmine', 'Bonsai'];

const SkeletonCard = ({ darkMode }: { darkMode?: boolean }) => (
    <div style={{ background: darkMode ? '#1e2d1e' : 'white', padding: '12px', border: `1px solid ${darkMode ? '#2a3d2a' : '#E8F5E9'}`, borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '14px', background: darkMode ? '#2a3d2a' : '#E8F5E9', flexShrink: 0, animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ flex: 1 }}>
            <div style={{ height: '14px', background: darkMode ? '#2a3d2a' : '#E8F5E9', borderRadius: '4px', marginBottom: '8px', width: '60%' }} />
            <div style={{ height: '11px', background: darkMode ? '#223322' : '#F0F7F0', borderRadius: '4px', width: '80%' }} />
        </div>
    </div>
);

export const SearchView: React.FC<SearchViewProps> = ({ onClose, onSelect, darkMode }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Array<{ name: string; scientific: string }>>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [loadingPlant, setLoadingPlant] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const bg = darkMode ? '#121a12' : 'white';
    const headerBg = darkMode ? '#0e160e' : 'white';
    const inputBg = darkMode ? '#1e2d1e' : '#F0F7F0';
    const textColor = darkMode ? '#e0f0e0' : '#1A4D2E';
    const subText = darkMode ? '#7aab7a' : '#4E342E';
    const borderColor = darkMode ? '#2a3d2a' : '#E0EDE0';
    const cardBg = darkMode ? '#1a291a' : 'white';
    const cardBorder = darkMode ? '#2a3d2a' : '#E8F5E9';

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

    // When a tag or suggestion is selected → fetch from Gemini directly
    const handleSelect = async (name: string) => {
        setSuggestions([]);
        setQuery(name);
        setLoadingPlant(name);
        setIsLoadingSuggestions(false);
        setErrorMsg(null);
        const result = await getPlantDetails(name);
        setLoadingPlant(null);
        if (result && !('error' in result)) {
            // Provide a good Unsplash image if Gemini didn't return one
            if (!result.image) {
                result.image = `https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=600`;
            }
            onSelect(result);
        } else {
            const error = result && 'error' in result ? result.error : 'TECHNICAL_ERROR';
            let msg = `Could not find info for "${name}".`;
            if (error === 'QUOTA_EXCEEDED') msg = '⏳ API quota exceeded. Please try again in 1 minute.';
            if (error === 'API_KEY_MISSING') msg = '🔑 API key missing in settings.';
            setErrorMsg(msg);
            setTimeout(() => setErrorMsg(null), 4000);
        }
    };

    const handleTagClick = (tag: string) => {
        // Immediately search Gemini for this tag — no mock filter
        handleSelect(tag);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 150, background: bg, display: 'flex', flexDirection: 'column' }}
        >
            {/* Search Bar */}
            <div style={{ padding: '52px 16px 12px', background: headerBg, borderBottom: `1px solid ${borderColor}`, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1, background: inputBg, borderRadius: '16px', display: 'flex', alignItems: 'center', padding: '12px 14px', gap: '10px' }}>
                        <SearchIcon size={18} color="#4CAF50" />
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => handleQueryChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && query.trim().length >= 2 && handleSelect(query.trim())}
                            placeholder="Search any plant on Earth..."
                            style={{ background: 'none', border: 'none', outline: 'none', fontSize: '15px', color: textColor, fontWeight: '500', width: '100%' }}
                        />
                        {query.length > 0 && (
                            <button onClick={() => { setQuery(''); setSuggestions([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>✕</button>
                        )}
                    </div>
                    <button onClick={onClose} style={{ width: '44px', height: '44px', background: inputBg, border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X size={20} color={textColor} />
                    </button>
                </div>

                {/* Popular tag chips — clicking directly fetches via Gemini */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
                    {POPULAR_TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            disabled={!!loadingPlant}
                            style={{ flexShrink: 0, padding: '5px 14px', borderRadius: '20px', border: 'none', background: loadingPlant === tag ? '#1A4D2E' : (darkMode ? '#1e2d1e' : '#EDF7ED'), color: loadingPlant === tag ? 'white' : textColor, fontSize: '12px', fontWeight: '600', cursor: 'pointer', opacity: loadingPlant && loadingPlant !== tag ? 0.5 : 1 }}
                        >
                            {loadingPlant === tag ? '⏳' : ''} {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }} className="no-scrollbar">

                {/* Loading plant details */}
                {loadingPlant && (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                            style={{ display: 'inline-flex', marginBottom: '16px' }}
                        >
                            <Loader2 size={40} color="#4CAF50" />
                        </motion.div>
                        <p style={{ color: textColor, fontWeight: '700', margin: '0 0 4px', fontSize: '16px' }}>Fetching Details...</p>
                        <p style={{ color: '#4CAF50', fontWeight: '600', margin: 0, fontSize: '13px' }}>Gemini AI is looking up "{loadingPlant}"</p>
                    </div>
                )}

                {/* GBIF Suggestions from live API */}
                {!loadingPlant && suggestions.length > 0 && (
                    <>
                        <p style={{ fontSize: '11px', color: '#999', fontWeight: '700', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Species Suggestions</p>
                        <AnimatePresence>
                            {suggestions.map((item, i) => (
                                <motion.button
                                    key={item.name + i}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    onClick={() => handleSelect(item.name)}
                                    style={{ width: '100%', background: cardBg, padding: '14px 16px', border: `1px solid ${cardBorder}`, borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px', cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 6px rgba(26,77,46,0.05)' }}
                                >
                                    <Leaf size={20} color="#4CAF50" style={{ flexShrink: 0 }} />
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: '600', fontSize: '15px', color: textColor }}>{item.name}</span>
                                        {item.scientific && (
                                            <span style={{ fontSize: '11px', color: subText, fontStyle: 'italic', opacity: 0.7 }}>{item.scientific}</span>
                                        )}
                                    </div>
                                    <ArrowRight size={16} color="#C8E6C9" />
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </>
                )}

                {/* Loading suggestions skeleton */}
                {!loadingPlant && isLoadingSuggestions && (
                    <>{[0, 1, 2].map(i => <SkeletonCard key={i} darkMode={darkMode} />)}</>
                )}

                {/* Empty state */}
                {!loadingPlant && !isLoadingSuggestions && query.length === 0 && suggestions.length === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '60px', gap: '12px' }}>
                        <div style={{ fontSize: '56px' }}>🌿</div>
                        <p style={{ color: subText, opacity: 0.8, fontWeight: '700', margin: 0, textAlign: 'center', fontSize: '16px' }}>Search any plant on Earth</p>
                        <p style={{ color: subText, opacity: 0.5, fontWeight: '500', margin: 0, textAlign: 'center', fontSize: '13px' }}>Or tap a category above to explore</p>
                        <p style={{ color: '#4CAF50', fontSize: '12px', fontWeight: '600', margin: 0 }}>Powered by Gemini AI · GBIF 2M+ species</p>
                    </div>
                )}

                {/* No results found */}
                {!loadingPlant && !isLoadingSuggestions && query.length >= 2 && suggestions.length === 0 && (
                    <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
                        <p style={{ color: textColor, fontWeight: '700', margin: '0 0 8px' }}>No suggestions found</p>
                        <p style={{ color: subText, opacity: 0.5, fontSize: '13px', margin: '0 0 16px' }}>Try pressing Enter to search directly</p>
                        <button
                            onClick={() => handleSelect(query.trim())}
                            style={{ background: '#1A4D2E', color: 'white', border: 'none', borderRadius: '20px', padding: '10px 24px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
                        >
                            Search "{query}" with Gemini AI
                        </button>
                    </div>
                )}
            </div>

            {/* Error toast */}
            <AnimatePresence>
                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        style={{
                            position: 'fixed', bottom: '20px', left: '16px', right: '16px',
                            background: '#c62828', color: 'white', padding: '12px 18px',
                            borderRadius: '14px', textAlign: 'center', zIndex: 999,
                            fontSize: '13px', fontWeight: '600', boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                        }}
                    >
                        ⚠️ {errorMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
            `}</style>
        </motion.div>
    );
};
