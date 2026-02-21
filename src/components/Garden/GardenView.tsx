import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Leaf } from 'lucide-react';
import type { PlantData } from '../../services/plantService';

interface GardenViewProps {
    garden: PlantData[];
    onClose: () => void;
    onSelect: (item: PlantData) => void;
    darkMode?: boolean;
}

export const GardenView: React.FC<GardenViewProps> = ({ garden, onClose, onSelect, darkMode }) => {
    const bg = darkMode ? '#0e160e' : '#F0F7F0';
    const headerBg = darkMode ? '#0a120a' : 'white';
    const cardBg = darkMode ? '#1a291a' : 'white';
    const borderColor = darkMode ? '#2a3d2a' : '#E0EDE0';
    const textColor = darkMode ? '#e0f0e0' : '#1A4D2E';
    const subText = darkMode ? 'rgba(180,220,180,0.45)' : 'rgba(78,52,46,0.45)';

    return (
        <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            style={{ position: 'fixed', inset: 0, zIndex: 120, background: bg, display: 'flex', flexDirection: 'column' }}
        >
            {/* Header */}
            <div style={{ padding: '52px 20px 16px', background: headerBg, borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Heart size={22} color="#e53935" fill="#e53935" />
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: textColor, margin: 0 }}>My Garden</h2>
                </div>
                <button onClick={onClose} style={{ width: '40px', height: '40px', background: bg, border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <X size={20} color={textColor} />
                </button>
            </div>

            {/* Grid */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }} className="no-scrollbar">
                {garden.length === 0 ? (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center', padding: '0 40px' }}>
                        <div style={{ width: '72px', height: '72px', background: cardBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Leaf size={36} color={textColor} />
                        </div>
                        <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: textColor, opacity: 0.6 }}>Your garden is empty</p>
                        <p style={{ margin: 0, fontSize: '13px', color: subText }}>Identify a plant and add it to your collection!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {garden.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => onSelect(item)}
                                style={{ background: cardBg, borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 12px rgba(26,77,46,0.08)' }}
                            >
                                <div style={{ height: '130px', overflow: 'hidden' }}>
                                    <img
                                        src={item.image}
                                        alt={item.commonName}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=300'; }}
                                    />
                                </div>
                                <div style={{ padding: '10px 12px 14px' }}>
                                    <h3 style={{ fontWeight: '700', fontSize: '13px', color: textColor, margin: '0 0 3px', lineHeight: 1.2 }}>{item.commonName}</h3>
                                    <p style={{ fontSize: '11px', color: subText, fontStyle: 'italic', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.scientificName}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
