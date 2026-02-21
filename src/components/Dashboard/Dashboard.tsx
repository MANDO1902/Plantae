import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Leaf, History, User, Search } from 'lucide-react';

interface DashboardProps {
    onScan: () => void;
    onHistory: () => void;
    onGarden: () => void;
    onSearch: () => void;
    onProfile: () => void;
    darkMode?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ onScan, onHistory, onGarden, onSearch, onProfile, darkMode }) => {
    const bg = darkMode ? '#0a120a' : '#F0F7F0';
    const headerBg = darkMode ? '#0e160e' : 'white';
    const cardBg = darkMode ? '#1a291a' : 'white';
    const borderColor = darkMode ? '#2a3d2a' : '#E0EDE0';
    const textColor = darkMode ? '#e0f0e0' : '#1A4D2E';
    const subText = darkMode ? 'rgba(180,220,180,0.6)' : 'rgba(78,52,46,0.6)';
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: bg, fontFamily: 'system-ui, -apple-system, sans-serif', overflow: 'hidden', position: 'relative' }}>

            {/* Header */}
            <div style={{ padding: '52px 20px 16px', background: headerBg, borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', background: '#1A4D2E', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Leaf size={18} color="white" />
                    </div>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: textColor, letterSpacing: '-0.5px' }}>Plantae</span>
                </div>
                <button onClick={onProfile} style={{ width: '38px', height: '38px', background: '#1A4D2E', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={18} color="white" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '90px' }} className="no-scrollbar">

                {/* Hero Scan Card */}
                <div style={{ padding: '20px 20px 12px' }}>
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={onScan}
                        style={{ width: '100%', background: 'linear-gradient(135deg, #1A4D2E 0%, #2E7D4F 100%)', border: 'none', borderRadius: '28px', padding: '28px 24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', boxShadow: '0 8px 32px rgba(26,77,46,0.3)', position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
                        <div style={{ width: '54px', height: '54px', background: 'rgba(255,255,255,0.18)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Camera size={26} color="white" />
                        </div>
                        <div>
                            <div style={{ fontSize: '22px', fontWeight: '800', color: 'white', marginBottom: '6px' }}>Identify a Plant</div>
                            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>Point your camera or upload a photo — Gemini AI identifies any plant on Earth instantly</div>
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '8px 16px', alignSelf: 'flex-start' }}>
                            <div style={{ width: '8px', height: '8px', background: '#4CAF50', borderRadius: '50%' }} />
                            <span style={{ color: 'white', fontSize: '13px', fontWeight: '700' }}>Powered by Gemini AI</span>
                        </div>
                    </motion.button>
                </div>

                {/* Quick Actions */}
                <div style={{ padding: '4px 20px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    {[
                        { icon: Search, label: 'Search', sublabel: 'Any plant', action: onSearch, color: darkMode ? '#1a2a3a' : '#E3F2FD', iconColor: '#1565C0' },
                        { icon: History, label: 'History', sublabel: 'Past scans', action: onHistory, color: darkMode ? '#1a2d1a' : '#E8F5E9', iconColor: '#2E7D32' },
                        { icon: Leaf, label: 'Garden', sublabel: 'My plants', action: onGarden, color: darkMode ? '#2a2a0a' : '#FFF8E1', iconColor: '#F57F17' },
                    ].map(({ icon: Icon, label, sublabel, action, color, iconColor }) => (
                        <motion.button
                            key={label}
                            whileTap={{ scale: 0.95 }}
                            onClick={action}
                            style={{ background: cardBg, border: 'none', borderRadius: '20px', padding: '16px 12px', cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 10px rgba(26,77,46,0.06)' }}
                        >
                            <div style={{ width: '38px', height: '38px', background: color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                                <Icon size={20} color={iconColor} />
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: textColor, marginBottom: '2px' }}>{label}</div>
                            <div style={{ fontSize: '11px', color: subText, lineHeight: 1.2 }}>{sublabel}</div>
                        </motion.button>
                    ))}
                </div>

                {/* Info Banner */}
                <div style={{ padding: '8px 20px' }}>
                    <div style={{ background: cardBg, borderRadius: '20px', padding: '16px 20px', boxShadow: '0 2px 10px rgba(26,77,46,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '32px' }}>🌍</div>
                        <div>
                            <div style={{ fontWeight: '700', fontSize: '15px', color: textColor, marginBottom: '2px' }}>400,000+ Species</div>
                            <div style={{ fontSize: '13px', color: subText, lineHeight: 1.3 }}>Gemini AI can identify and explain any plant on Earth</div>
                        </div>
                    </div>
                </div>

                {/* How it works */}
                <div style={{ padding: '8px 20px 0' }}>
                    <h2 style={{ fontSize: '15px', fontWeight: '700', color: textColor, margin: '0 0 12px' }}>How it works</h2>
                    {[
                        { num: '1', title: 'Point or Upload', desc: 'Use your camera or pick a photo from your gallery' },
                        { num: '2', title: 'AI Identifies', desc: 'Gemini analyzes the image and identifies the plant species' },
                        { num: '3', title: 'Get Full Details', desc: 'Receive care guide, toxicity, and botanical information' },
                    ].map((step) => (
                        <div key={step.num} style={{ background: cardBg, borderRadius: '16px', padding: '14px 16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 8px rgba(26,77,46,0.04)' }}>
                            <div style={{ width: '36px', height: '36px', background: '#1A4D2E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ color: 'white', fontWeight: '800', fontSize: '14px' }}>{step.num}</span>
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '14px', color: textColor, marginBottom: '2px' }}>{step.title}</div>
                                <div style={{ fontSize: '12px', color: subText }}>{step.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Tab Bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: headerBg, borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0', paddingBottom: 'max(14px, env(safe-area-inset-bottom))' }}>
                <button onClick={onGarden} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', color: '#4CAF50' }}>
                    <Leaf size={22} /><span style={{ fontSize: '10px', fontWeight: '600' }}>Garden</span>
                </button>
                <button onClick={onSearch} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', color: subText }}>
                    <Search size={22} /><span style={{ fontSize: '10px', fontWeight: '600' }}>Search</span>
                </button>
                <button onClick={onScan} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', marginTop: '-24px' }}>
                    <div style={{ width: '60px', height: '60px', background: '#1A4D2E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(26,77,46,0.4)' }}>
                        <Camera size={26} color="white" />
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '600', color: subText, marginTop: '4px' }}>Scan</span>
                </button>
                <button onClick={onHistory} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', color: subText }}>
                    <History size={22} /><span style={{ fontSize: '10px', fontWeight: '600' }}>History</span>
                </button>
                <button onClick={onProfile} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', color: subText }}>
                    <User size={22} /><span style={{ fontSize: '10px', fontWeight: '600' }}>Profile</span>
                </button>
            </div>
        </div>
    );
};
