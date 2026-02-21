import React from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Leaf } from 'lucide-react';
import type { HistoryItem } from '../../services/storageService';

interface HistoryViewProps {
    history: HistoryItem[];
    onClose: () => void;
    onSelect: (item: HistoryItem) => void;
    darkMode?: boolean;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onClose, onSelect, darkMode }) => {
    const bg = darkMode ? '#0e160e' : '#F0F7F0';
    const headerBg = darkMode ? '#0a120a' : 'white';
    const cardBg = darkMode ? '#1a291a' : 'white';
    const borderColor = darkMode ? '#2a3d2a' : '#E0EDE0';
    const textColor = darkMode ? '#e0f0e0' : '#1A4D2E';
    const subText = darkMode ? 'rgba(180,220,180,0.55)' : 'rgba(78,52,46,0.55)';

    return (
        <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            style={{ position: 'fixed', inset: 0, zIndex: 120, background: bg, display: 'flex', flexDirection: 'column' }}
        >
            {/* Header */}
            <div style={{ padding: '52px 20px 16px', background: headerBg, borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: textColor, margin: 0 }}>Scan History</h2>
                <button onClick={onClose} style={{ width: '40px', height: '40px', background: bg, border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <X size={20} color={textColor} />
                </button>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }} className="no-scrollbar">
                {history.length === 0 ? (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: textColor, opacity: 0.4 }}>
                        <div style={{ width: '72px', height: '72px', background: cardBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Leaf size={36} />
                        </div>
                        <p style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>No scans yet. Start scanning!</p>
                    </div>
                ) : (
                    history.map((item, i) => (
                        <motion.div
                            key={`${item.id}-${item.timestamp}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            onClick={() => onSelect(item)}
                            style={{ background: cardBg, padding: '12px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(26,77,46,0.05)' }}
                        >
                            <img
                                src={item.image}
                                alt={item.commonName}
                                style={{ width: '70px', height: '70px', borderRadius: '14px', objectFit: 'cover', flexShrink: 0 }}
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=200'; }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h3 style={{ fontWeight: '700', fontSize: '15px', color: textColor, margin: '0 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.commonName}</h3>
                                <p style={{ fontSize: '12px', color: subText, fontStyle: 'italic', margin: '0 0 8px' }}>{item.scientificName}</p>
                                <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: subText, fontWeight: '600' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={11} />
                                        {new Date(item.timestamp).toLocaleDateString()}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={11} />
                                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};
