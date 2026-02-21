import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Sparkles, ImagePlus, AlertCircle } from 'lucide-react';
import { identifyPlantWithGemini } from '../../services/geminiService';
import type { PlantData } from '../../services/plantService';

interface ScannerProps {
    onClose: () => void;
    onCapture: (result: PlantData | { error: string } | null) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onClose, onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const isMounted = useRef(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzeStatus, setAnalyzeStatus] = useState('Identifying...');
    const [laserY, setLaserY] = useState(0);
    const [cameraError, setCameraError] = useState(false);

    useEffect(() => {
        isMounted.current = true;
        async function setupCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment', width: { ideal: 1280 } },
                    audio: false
                });
                streamRef.current = stream;
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch {
                setCameraError(true);
            }
        }
        setupCamera();

        let dir = 1, pos = 0;
        const interval = setInterval(() => {
            pos += dir * 1.5;
            if (pos >= 98) dir = -1;
            if (pos <= 2) dir = 1;
            setLaserY(pos);
        }, 20);

        return () => {
            isMounted.current = false;
            clearInterval(interval);
            streamRef.current?.getTracks().forEach(t => t.stop());
        };
    }, []);

    const analyzeImage = useCallback(async (dataUrl: string) => {
        setIsAnalyzing(true);
        setAnalyzeStatus('Sending to Gemini AI...');
        try {
            setAnalyzeStatus('Identifying plant...');
            const result = await identifyPlantWithGemini(dataUrl);
            if (isMounted.current) {
                // Attach a fallback image using Unsplash if Gemini didn't return one
                // Only do this if result is a valid plant object (i.e. not null and not an error object)
                if (result && !('error' in result) && !result.image) {
                    // images.unsplash.com (source.unsplash.com is deprecated/broken)
                    result.image = `https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=600`;
                }
                onCapture(result);
            }
        } catch (err) {
            console.error('Scanner analyze error:', err);
            if (isMounted.current) {
                // If it's a real error (not just "no plant"), we still return null
                // but we could trigger a specific alert if we wanted.
                onCapture(null);
            }
        } finally {
            if (isMounted.current) setIsAnalyzing(false);
        }
    }, [onCapture]);

    const captureFromCamera = () => {
        if (!videoRef.current || !canvasRef.current || isAnalyzing) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        analyzeImage(canvasRef.current.toDataURL('image/jpeg', 0.85));
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || isAnalyzing) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const url = ev.target?.result as string;
            if (url) analyzeImage(url);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const cornerStyle = (pos: object) => ({ position: 'absolute' as const, width: '26px', height: '26px', ...pos });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#0a0a0a', overflow: 'hidden' }}
        >
            {/* Camera Feed */}
            {!cameraError ? (
                <video ref={videoRef} autoPlay playsInline
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
            ) : (
                <div style={{ position: 'absolute', inset: 0, background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                    <AlertCircle size={48} color="rgba(255,255,255,0.3)" />
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', textAlign: 'center', padding: '0 40px', margin: 0 }}>
                        Camera unavailable. Use the upload button below to identify a plant from your photos.
                    </p>
                </div>
            )}

            {/* Dim overlay + scan frame */}
            {!cameraError && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)' }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -58%)', width: '78vw', height: '52vh', maxWidth: '320px', maxHeight: '380px' }}>
                        <div style={{ position: 'absolute', inset: 0, border: '1.5px solid rgba(255,255,255,0.18)', borderRadius: '20px', overflow: 'hidden' }}>
                            {!isAnalyzing && (
                                <div style={{ position: 'absolute', left: 0, right: 0, top: `${laserY}%`, height: '2px', background: 'linear-gradient(to right, transparent, #4CAF50, transparent)', boxShadow: '0 0 12px rgba(76,175,80,0.7)' }} />
                            )}
                            <AnimatePresence>
                                {isAnalyzing && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', inset: 0, background: 'rgba(26,77,46,0.55)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
                                            <Sparkles size={44} color="white" />
                                        </motion.div>
                                        <span style={{ color: 'white', fontSize: '14px', fontWeight: '700', textAlign: 'center' }}>{analyzeStatus}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {/* Corners */}
                        <div style={cornerStyle({ top: -2, left: -2, borderTop: '3px solid #4CAF50', borderLeft: '3px solid #4CAF50', borderRadius: '4px 0 0 0' })} />
                        <div style={cornerStyle({ top: -2, right: -2, borderTop: '3px solid #4CAF50', borderRight: '3px solid #4CAF50', borderRadius: '0 4px 0 0' })} />
                        <div style={cornerStyle({ bottom: -2, left: -2, borderBottom: '3px solid #4CAF50', borderLeft: '3px solid #4CAF50', borderRadius: '0 0 0 4px' })} />
                        <div style={cornerStyle({ bottom: -2, right: -2, borderBottom: '3px solid #4CAF50', borderRight: '3px solid #4CAF50', borderRadius: '0 0 4px 0' })} />
                    </div>
                </div>
            )}

            {/* Top bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '48px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <button onClick={onClose} style={{ width: '44px', height: '44px', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                    <X size={22} color="white" />
                </button>
                <div style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', borderRadius: '20px', padding: '6px 14px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: '700' }}>✦ Gemini AI</span>
                </div>
                <div style={{ width: '44px' }} />
            </div>

            {/* Bottom controls */}
            <div style={{ position: 'absolute', bottom: '44px', left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '36px', zIndex: 10, paddingBottom: 'env(safe-area-inset-bottom)' }}>
                {/* Upload */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <button onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing}
                        style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)', opacity: isAnalyzing ? 0.4 : 1 }}>
                        <ImagePlus size={24} color="white" />
                    </button>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: '600' }}>Upload</span>
                </div>

                {/* Capture */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <button onClick={captureFromCamera} disabled={isAnalyzing || cameraError}
                        style={{ width: '80px', height: '80px', background: 'white', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (isAnalyzing || cameraError) ? 'not-allowed' : 'pointer', boxShadow: '0 0 0 6px rgba(255,255,255,0.2)', opacity: (isAnalyzing || cameraError) ? 0.4 : 1 }}>
                        <div style={{ width: '64px', height: '64px', background: '#1A4D2E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Camera size={30} color="white" />
                        </div>
                    </button>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: '600' }}>Scan</span>
                </div>

                {/* Placeholder for symmetry */}
                <div style={{ width: '56px' }} />
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
        </motion.div>
    );
};
