import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Leaf, History, ChevronRight, Moon, Bell, Globe, Info, Star, Trash2, CheckCircle } from 'lucide-react';

interface ProfileViewProps {
    onClose: () => void;
    gardenCount: number;
    historyCount: number;
    onClearHistory: () => void;
    onClearGarden: () => void;
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
    onClose, gardenCount, historyCount, onClearHistory, onClearGarden, darkMode, onToggleDarkMode
}) => {
    const [notifications, setNotifications] = useState(true);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2000);
    };

    const handleClearHistory = () => {
        onClearHistory();
        showToast('✅ Scan history cleared');
    };

    const handleClearGarden = () => {
        onClearGarden();
        showToast('✅ Garden cleared');
    };

    const bg = darkMode ? '#0e160e' : '#F0F7F0';
    const headerBg = darkMode ? '#0a120a' : 'white';
    const cardBg = darkMode ? '#1a291a' : 'white';
    const borderColor = darkMode ? '#2a3d2a' : '#E0EDE0';
    const rowBorder = darkMode ? '#1e2d1e' : '#F0F7F0';
    const iconBg = darkMode ? '#1e2d1e' : '#E8F5E9';
    const textColor = darkMode ? '#e0f0e0' : '#1A4D2E';
    const subTextColor = darkMode ? 'rgba(180,220,180,0.6)' : 'rgba(78,52,46,0.6)';

    return (
        <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            style={{ position: 'fixed', inset: 0, zIndex: 130, background: bg, display: 'flex', flexDirection: 'column' }}
        >
            {/* Header */}
            <div style={{ padding: '52px 20px 20px', background: headerBg, borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: textColor, margin: 0 }}>Profile</h2>
                <button onClick={onClose} style={{ width: '40px', height: '40px', background: bg, border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <X size={20} color={textColor} />
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
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>Gemini AI · Free Plan</div>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: cardBg, borderRadius: '20px', padding: '18px', textAlign: 'center', boxShadow: '0 2px 10px rgba(26,77,46,0.05)' }}>
                        <div style={{ fontSize: '32px', fontWeight: '900', color: textColor, lineHeight: 1 }}>{gardenCount}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '6px' }}>
                            <Leaf size={14} color="#4CAF50" />
                            <span style={{ fontSize: '13px', color: subTextColor, fontWeight: '600' }}>My Garden</span>
                        </div>
                    </div>
                    <div style={{ background: cardBg, borderRadius: '20px', padding: '18px', textAlign: 'center', boxShadow: '0 2px 10px rgba(26,77,46,0.05)' }}>
                        <div style={{ fontSize: '32px', fontWeight: '900', color: textColor, lineHeight: 1 }}>{historyCount}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '6px' }}>
                            <History size={14} color="#4CAF50" />
                            <span style={{ fontSize: '13px', color: subTextColor, fontWeight: '600' }}>Scans Done</span>
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div style={{ background: cardBg, borderRadius: '20px', marginBottom: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(26,77,46,0.05)' }}>
                    {/* Dark Mode Toggle — wired to global state */}
                    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${rowBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', background: iconBg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Moon size={18} color={textColor} />
                            </div>
                            <span style={{ fontWeight: '600', fontSize: '15px', color: textColor }}>Dark Mode</span>
                        </div>
                        <button
                            onClick={onToggleDarkMode}
                            style={{ width: '48px', height: '28px', background: darkMode ? '#4CAF50' : '#E0EDE0', borderRadius: '14px', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.25s' }}
                        >
                            <div style={{ position: 'absolute', top: '3px', left: darkMode ? '23px' : '3px', width: '22px', height: '22px', background: 'white', borderRadius: '50%', transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
                        </button>
                    </div>

                    {/* Notifications */}
                    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${rowBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', background: iconBg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bell size={18} color={textColor} />
                            </div>
                            <span style={{ fontWeight: '600', fontSize: '15px', color: textColor }}>Notifications</span>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            style={{ width: '48px', height: '28px', background: notifications ? '#4CAF50' : '#E0EDE0', borderRadius: '14px', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.25s' }}
                        >
                            <div style={{ position: 'absolute', top: '3px', left: notifications ? '23px' : '3px', width: '22px', height: '22px', background: 'white', borderRadius: '50%', transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
                        </button>
                    </div>

                    {[
                        { icon: Globe, label: 'Data Source', value: 'Gemini AI + GBIF' },
                        { icon: Star, label: 'App Version', value: '1.0.0' },
                        { icon: Info, label: 'About Plantae', value: '' },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} style={{ padding: '12px 16px', borderBottom: `1px solid ${rowBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '36px', height: '36px', background: iconBg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={18} color={textColor} />
                                </div>
                                <span style={{ fontWeight: '600', fontSize: '15px', color: textColor }}>{label}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {value && <span style={{ fontSize: '13px', color: subTextColor }}>{value}</span>}
                                <ChevronRight size={16} color="#C8E6C9" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Danger Zone */}
                <div style={{ background: cardBg, borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(26,77,46,0.05)' }}>
                    <button onClick={handleClearHistory} style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', borderBottom: `1px solid ${rowBorder}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', background: '#FFF3E0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={18} color="#E65100" />
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '15px', color: '#E65100' }}>Clear Scan History</span>
                    </button>
                    <button onClick={handleClearGarden} style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', background: '#FFEBEE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={18} color="#C62828" />
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '15px', color: '#C62828' }}>Clear My Garden</span>
                    </button>
                </div>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        style={{
                            position: 'fixed', bottom: '30px', left: '20px', right: '20px',
                            background: '#1A4D2E', color: 'white', padding: '14px 20px',
                            borderRadius: '16px', textAlign: 'center', zIndex: 999,
                            fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                        }}
                    >
                        <CheckCircle size={18} />
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
