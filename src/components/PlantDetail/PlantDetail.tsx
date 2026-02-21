import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Sun, Thermometer, AlertTriangle, X, Heart } from 'lucide-react';
import type { PlantData } from '../../services/plantService';

interface PlantDetailProps {
    plant: PlantData;
    onClose: () => void;
    onSave?: (plant: PlantData) => void;
    isInGarden?: boolean;
    darkMode?: boolean;
}

const careCard = (icon: React.ReactNode, label: string, value: string, darkMode?: boolean) => (
    <div style={{ background: darkMode ? '#1a291a' : '#F0F7F0', padding: '14px', borderRadius: '16px', flex: '1 1 calc(50% - 6px)' }}>
        <div style={{ marginBottom: '6px' }}>{icon}</div>
        <div style={{ fontSize: '10px', fontWeight: '700', color: darkMode ? '#7aab7a' : '#1A4D2E', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '13px', fontWeight: '600', color: darkMode ? '#e0f0e0' : '#1A4D2E' }}>{value}</div>
    </div>
);

export const PlantDetail: React.FC<PlantDetailProps> = ({ plant, onClose, onSave, isInGarden, darkMode }) => {
    const sheetBg = darkMode ? '#0e160e' : 'white';
    const textColor = darkMode ? '#e0f0e0' : '#1A4D2E';
    const subText = darkMode ? 'rgba(180,220,180,0.7)' : 'rgba(78,52,46,0.7)';
    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ position: 'fixed', inset: 0, zIndex: 110, background: sheetBg, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
        >
            {/* Image Header */}
            <div style={{ position: 'relative', height: '42vh', flexShrink: 0 }}>
                <img
                    src={plant.image || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=800'}
                    alt={plant.commonName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=800'; }}
                />
                {/* Dark gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />

                {/* Top Controls */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '48px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={onClose} style={{ width: '40px', height: '40px', background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                        <X size={20} color="white" />
                    </button>
                    <button onClick={() => onSave?.(plant)} style={{ width: '40px', height: '40px', background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                        <Heart size={20} color={isInGarden ? '#ff6b6b' : 'white'} fill={isInGarden ? '#ff6b6b' : 'none'} />
                    </button>
                </div>

                {/* Plant Name */}
                <div style={{ position: 'absolute', bottom: '24px', left: '20px', right: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ background: '#4CAF50', color: 'white', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '20px', letterSpacing: '0.5px' }}>
                            {Math.round(plant.confidence * 100)}% Match
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{plant.family}</span>
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'white', margin: '0 0 4px', lineHeight: 1.1 }}>{plant.commonName}</h1>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', margin: 0, fontSize: '14px' }}>{plant.scientificName}</p>
                </div>
            </div>

            {/* Content Sheet */}
            <div style={{ background: sheetBg, borderRadius: '28px 28px 0 0', marginTop: '-20px', padding: '24px 20px', position: 'relative', zIndex: 10, flex: 1 }}>
                {/* About */}
                <section style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '17px', fontWeight: '800', color: textColor, marginBottom: '8px' }}>About</h2>
                    <p style={{ color: subText, lineHeight: 1.7, fontSize: '14px', margin: 0 }}>{plant.description}</p>
                </section>

                {/* Care Guide */}
                <section style={{ marginBottom: '28px' }}>
                    <h2 style={{ fontSize: '17px', fontWeight: '800', color: textColor, marginBottom: '12px' }}>Care Guide</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {careCard(<Droplets size={20} color="#1976D2" />, 'Watering', plant.care.water, darkMode)}
                        {careCard(<Sun size={20} color="#F9A825" />, 'Sunlight', plant.care.light, darkMode)}
                        {careCard(<Thermometer size={20} color="#e64a19" />, 'Temperature', plant.care.temperature, darkMode)}
                        {careCard(<AlertTriangle size={20} color="#c62828" />, 'Toxicity', plant.toxicity, darkMode)}
                    </div>
                </section>

                {/* Action Button */}
                <button
                    onClick={() => onSave?.(plant)}
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '20px',
                        border: isInGarden ? '2px solid #4CAF50' : 'none',
                        background: isInGarden ? '#EDF7ED' : '#1A4D2E',
                        color: isInGarden ? '#1A4D2E' : 'white',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        marginBottom: 'env(safe-area-inset-bottom, 0px)'
                    }}
                >
                    {isInGarden ? '✓ In Your Garden' : '+ Add to My Garden'}
                </button>
            </div>
        </motion.div>
    );
};
