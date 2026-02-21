import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Leaf, History, ChevronRight, Moon, Bell, Globe, Info, Star, Trash2 } from 'lucide-react';

interface ProfileViewProps {
    onClose: () => void;
    gardenCount: number;
    historyCount: number;
    onClearHistory: () => void;
    onClearGarden: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onClose, gardenCount, historyCount, onClearHistory, onClearGarden }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
        <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            style={{ position: 'fixed', inset: 0, zIndex: 130, background: '#F0F7F0', display: 'flex', flexDirection: 'column' }}
        >
            {/* Header */}
            <div style={{ padding: '52px 20px 20px', background: 'white', borderBottom: '1px solid #E0EDE0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1A4D2E', margin: 0 }}>Profile</h2>
                <button onClick={onClose} style={{ width: '40px', height: '40px', background: '#F0F7F0', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <X size={20} color="#1A4D2E" />
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }} className="no-scrollbar">
                {/* Avatar Card */}
                <div style={{ background: 'linear-gradient(135deg, #1A4D2E, #2E7D4F)', borderRadius: '24px', padding: '28px 24px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 8px 32px rgba(26,77,46,0.25)' }}>
                    <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                        🌿
                    </div>
                    <div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '4px' }}>Plant Enthusiast</div>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>Using Gemini AI · Free Plan</div>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: 'white', borderRadius: '20px', padding: '18px', textAlign: 'center', boxShadow: '0 2px 10px rgba(26,77,46,0.05)' }}>
                        <div style={{ fontSize: '32px', fontWeight: '900', color: '#1A4D2E', lineHeight: 1 }}>{gardenCount}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '6px' }}>
                            <Leaf size={14} color="#4CAF50" />
                            <span style={{ fontSize: '13px', color: '#4E342E', opacity: 0.6, fontWeight: '600' }}>My Garden</span>
                        </div>
                    </div>
                    <div style={{ background: 'white', borderRadius: '20px', padding: '18px', textAlign: 'center', boxShadow: '0 2px 10px rgba(26,77,46,0.05)' }}>
                        <div style={{ fontSize: '32px', fontWeight: '900', color: '#1A4D2E', lineHeight: 1 }}>{historyCount}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '6px' }}>
                            <History size={14} color="#4CAF50" />
                            <span style={{ fontSize: '13px', color: '#4E342E', opacity: 0.6, fontWeight: '600' }}>Scans Done</span>
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div style={{ background: 'white', borderRadius: '20px', marginBottom: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(26,77,46,0.05)' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0F7F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', background: '#E8F5E9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Moon size={18} color="#1A4D2E" />
                            </div>
                            <span style={{ fontWeight: '600', fontSize: '15px', color: '#1A4D2E' }}>Dark Mode</span>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            style={{ width: '48px', height: '28px', background: darkMode ? '#1A4D2E' : '#E0EDE0', borderRadius: '14px', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
                        >
                            <div style={{ position: 'absolute', top: '3px', left: darkMode ? '23px' : '3px', width: '22px', height: '22px', background: 'white', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
                        </button>
                    </div>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0F7F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', background: '#E8F5E9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bell size={18} color="#1A4D2E" />
                            </div>
                            <span style={{ fontWeight: '600', fontSize: '15px', color: '#1A4D2E' }}>Notifications</span>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            style={{ width: '48px', height: '28px', background: notifications ? '#1A4D2E' : '#E0EDE0', borderRadius: '14px', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
                        >
                            <div style={{ position: 'absolute', top: '3px', left: notifications ? '23px' : '3px', width: '22px', height: '22px', background: 'white', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
                        </button>
                    </div>
                    {[
                        { icon: Globe, label: 'Data Source', value: 'Gemini AI + GBIF' },
                        { icon: Star, label: 'App Version', value: '1.0.0' },
                        { icon: Info, label: 'About Plantae', value: '' },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} style={{ padding: '12px 16px', borderBottom: '1px solid #F0F7F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '36px', height: '36px', background: '#E8F5E9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={18} color="#1A4D2E" />
                                </div>
                                <span style={{ fontWeight: '600', fontSize: '15px', color: '#1A4D2E' }}>{label}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {value && <span style={{ fontSize: '13px', color: '#4E342E', opacity: 0.5 }}>{value}</span>}
                                <ChevronRight size={16} color="#C8E6C9" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Danger Zone */}
                <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(26,77,46,0.05)' }}>
                    <button onClick={onClearHistory} style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', borderBottom: '1px solid #F0F7F0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', background: '#FFF3E0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={18} color="#E65100" />
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '15px', color: '#E65100' }}>Clear Scan History</span>
                    </button>
                    <button onClick={onClearGarden} style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', background: '#FFEBEE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={18} color="#C62828" />
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '15px', color: '#C62828' }}>Clear My Garden</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
