import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Leaf, History, User, Search, ChevronRight, Droplets, Sun, Sparkles } from 'lucide-react';

interface DashboardProps {
    onScan: () => void;
    onHistory: () => void;
    onGarden: () => void;
    onSearch: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onScan, onHistory, onGarden, onSearch }) => {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#F0F7F0', color: '#1A4D2E', fontFamily: 'system-ui, -apple-system, sans-serif', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{ padding: '16px 20px 12px', background: 'white', borderBottom: '1px solid #E0EDE0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <button onClick={onGarden} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <div style={{ width: '32px', height: '32px', background: '#1A4D2E', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Leaf size={18} color="white" />
                    </div>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#1A4D2E', letterSpacing: '-0.5px' }}>Plantae</span>
                </button>
                <button onClick={onSearch} style={{ background: '#F0F7F0', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Search size={20} color="#1A4D2E" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }} className="no-scrollbar">

                {/* Hero / Scan Card */}
                <div style={{ padding: '20px 20px 8px' }}>
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={onScan}
                        style={{ width: '100%', background: 'linear-gradient(135deg, #1A4D2E 0%, #2D7A4F 100%)', border: 'none', borderRadius: '24px', padding: '28px 24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', boxShadow: '0 8px 32px rgba(26,77,46,0.3)', position: 'relative', overflow: 'hidden' }}
                    >
                        {/* Background decoration */}
                        <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                        <div style={{ position: 'absolute', right: '20px', top: '20px', width: '60px', height: '60px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />

                        <div style={{ width: '52px', height: '52px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                            <Camera size={26} color="white" />
                        </div>
                        <div>
                            <div style={{ fontSize: '22px', fontWeight: '800', color: 'white', marginBottom: '4px' }}>Scan a Plant</div>
                            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: '400' }}>Point your camera to identify any plant instantly</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>Open Camera</span>
                            <ChevronRight size={16} color="rgba(255,255,255,0.9)" />
                        </div>
                    </motion.button>
                </div>

                {/* Quick Actions */}
                <div style={{ padding: '8px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={onHistory}
                        style={{ background: 'white', border: 'none', borderRadius: '20px', padding: '20px 16px', cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 12px rgba(26,77,46,0.06)' }}
                    >
                        <div style={{ width: '40px', height: '40px', background: '#EDF7ED', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                            <History size={20} color="#1A4D2E" />
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#1A4D2E', marginBottom: '2px' }}>History</div>
                        <div style={{ fontSize: '12px', color: '#4E342E', opacity: 0.5 }}>Past scans</div>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={onSearch}
                        style={{ background: 'white', border: 'none', borderRadius: '20px', padding: '20px 16px', cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 12px rgba(26,77,46,0.06)' }}
                    >
                        <div style={{ width: '40px', height: '40px', background: '#EDF7ED', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                            <Search size={20} color="#1A4D2E" />
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#1A4D2E', marginBottom: '2px' }}>Browse</div>
                        <div style={{ fontSize: '12px', color: '#4E342E', opacity: 0.5 }}>Plant database</div>
                    </motion.button>
                </div>

                {/* Daily Tips */}
                <div style={{ padding: '8px 20px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#1A4D2E', margin: 0 }}>Daily Care Tips</h2>
                        <span style={{ fontSize: '13px', color: '#4CAF50', fontWeight: '600' }}>View all</span>
                    </div>

                    {[
                        { icon: Droplets, iconBg: '#E3F2FD', iconColor: '#1976D2', plant: 'Monstera', tip: 'Check soil moisture before watering', tag: 'Watering' },
                        { icon: Sun, iconBg: '#FFFDE7', iconColor: '#F9A825', plant: 'Snake Plant', tip: 'Indirect sunlight is best today', tag: 'Light' },
                        { icon: Sparkles, iconBg: '#F3E5F5', iconColor: '#7B1FA2', plant: 'Peace Lily', tip: 'Time to wipe down the leaves', tag: 'Care' },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            style={{ background: 'white', borderRadius: '16px', padding: '14px 16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 2px 8px rgba(26,77,46,0.05)' }}
                        >
                            <div style={{ width: '44px', height: '44px', background: item.iconBg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <item.icon size={22} color={item.iconColor} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1A4D2E' }}>{item.plant}</div>
                                <div style={{ fontSize: '12px', color: '#4E342E', opacity: 0.6 }}>{item.tip}</div>
                            </div>
                            <span style={{ background: '#EDF7ED', color: '#1A4D2E', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.3px' }}>{item.tag}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom Tab Bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #E0EDE0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0 20px', paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
                <button onClick={onGarden} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#4CAF50' }}>
                    <Leaf size={24} />
                    <span style={{ fontSize: '10px', fontWeight: '600' }}>Garden</span>
                </button>
                <button onClick={onSearch} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                    <Search size={24} />
                    <span style={{ fontSize: '10px', fontWeight: '600' }}>Search</span>
                </button>
                <button onClick={onScan} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', marginTop: '-24px' }}>
                    <div style={{ width: '60px', height: '60px', background: '#1A4D2E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(26,77,46,0.4)' }}>
                        <Camera size={26} color="white" />
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '600', color: '#999', marginTop: '4px' }}>Scan</span>
                </button>
                <button onClick={onHistory} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                    <History size={24} />
                    <span style={{ fontSize: '10px', fontWeight: '600' }}>History</span>
                </button>
                <button style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                    <User size={24} />
                    <span style={{ fontSize: '10px', fontWeight: '600' }}>Profile</span>
                </button>
            </div>
        </div>
    );
};
