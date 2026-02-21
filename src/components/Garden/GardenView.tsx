import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Leaf } from 'lucide-react';
import type { PlantData } from '../../services/plantService';

interface GardenViewProps {
    garden: PlantData[];
    onClose: () => void;
    onSelect: (item: PlantData) => void;
}

export const GardenView: React.FC<GardenViewProps> = ({ garden, onClose, onSelect }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            style={{ position: 'fixed', inset: 0, zIndex: 120, background: '#F0F7F0', display: 'flex', flexDirection: 'column' }}
        >
            {/* Header */}
            <div style={{ padding: '52px 20px 16px', background: 'white', borderBottom: '1px solid #E0EDE0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Heart size={22} color="#e53935" fill="#e53935" />
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1A4D2E', margin: 0 }}>My Garden</h2>
                </div>
                <button onClick={onClose} style={{ width: '40px', height: '40px', background: '#F0F7F0', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <X size={20} color="#1A4D2E" />
                </button>
            </div>

            {/* Grid */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }} className="no-scrollbar">
                {garden.length === 0 ? (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#4E342E', opacity: 0.4, textAlign: 'center', padding: '0 40px' }}>
                        <div style={{ width: '72px', height: '72px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Leaf size={36} />
                        </div>
                        <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1A4D2E', opacity: 0.6 }}>Your garden is empty</p>
                        <p style={{ margin: 0, fontSize: '13px' }}>Identify a plant and add it to your collection!</p>
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
                                style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 12px rgba(26,77,46,0.08)' }}
                            >
                                <div style={{ height: '130px', overflow: 'hidden' }}>
                                    <img
                                        src={item.image}
                                        alt={item.commonName}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ padding: '10px 12px 14px' }}>
                                    <h3 style={{ fontWeight: '700', fontSize: '13px', color: '#1A4D2E', margin: '0 0 3px', lineHeight: 1.2 }}>{item.commonName}</h3>
                                    <p style={{ fontSize: '11px', color: '#4E342E', opacity: 0.45, fontStyle: 'italic', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.scientificName}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
