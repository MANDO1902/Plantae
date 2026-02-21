import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Sparkles, ImagePlus } from 'lucide-react';

interface ScannerProps {
    onClose: () => void;
    onCapture: (imageData: string) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onClose, onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const isMounted = useRef(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [laserY, setLaserY] = useState(0);
    const [cameraError, setCameraError] = useState(false);

    useEffect(() => {
        isMounted.current = true;
        async function setupCamera() {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
                    audio: false
                });
                streamRef.current = mediaStream;
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Camera access error:", err);
                setCameraError(true);
            }
        }
        setupCamera();

        // Laser animation
        let direction = 1;
        let pos = 0;
        const interval = setInterval(() => {
            pos += direction * 1.5;
            if (pos >= 98) direction = -1;
            if (pos <= 2) direction = 1;
            setLaserY(pos);
        }, 20);

        return () => {
            isMounted.current = false;
            clearInterval(interval);
            streamRef.current?.getTracks().forEach(track => track.stop());
        };
    }, []);

    const processCapture = useCallback((dataUrl: string) => {
        setIsAnalyzing(true);
        setTimeout(() => {
            if (isMounted.current) {
                onCapture(dataUrl);
            }
        }, 2000);
    }, [onCapture]);

    const captureFromCamera = () => {
        if (videoRef.current && canvasRef.current && !isAnalyzing) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                processCapture(canvasRef.current.toDataURL('image/jpeg', 0.9));
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || isAnalyzing) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            if (dataUrl) {
                processCapture(dataUrl);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        >
            {/* Camera Feed */}
            {!cameraError ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                />
            ) : (
                <div style={{ position: 'absolute', inset: 0, background: '#1a1a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: 'rgba(255,255,255,0.5)' }}>
                    <Camera size={48} />
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', textAlign: 'center', padding: '0 40px' }}>Camera not available. Please upload a photo instead.</p>
                </div>
            )}

            {/* Scan Frame Overlay */}
            {!cameraError && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    {/* Dim edges */}
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
                    {/* Frame */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -58%)',
                        width: '78vw', height: '52vh',
                        maxWidth: '320px', maxHeight: '380px',
                    }}>
                        {/* Clear window (no background) */}
                        <div style={{ position: 'absolute', inset: 0, border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '20px', overflow: 'hidden' }}>
                            {/* Laser */}
                            {!isAnalyzing && (
                                <div style={{
                                    position: 'absolute', left: 0, right: 0, height: '2px', top: `${laserY}%`,
                                    background: 'linear-gradient(to right, transparent 0%, #4CAF50 30%, #81C784 50%, #4CAF50 70%, transparent 100%)',
                                    boxShadow: '0 0 10px 2px rgba(76,175,80,0.6)',
                                }} />
                            )}
                            {/* Analyzing */}
                            <AnimatePresence>
                                {isAnalyzing && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', inset: 0, background: 'rgba(26,77,46,0.55)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
                                            <Sparkles size={40} color="white" />
                                        </motion.div>
                                        <span style={{ color: 'white', fontSize: '15px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Identifying...</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {/* Corner marks */}
                        {[
                            { top: -2, left: -2, borderTop: '3px solid #4CAF50', borderLeft: '3px solid #4CAF50', borderRadius: '4px 0 0 0' },
                            { top: -2, right: -2, borderTop: '3px solid #4CAF50', borderRight: '3px solid #4CAF50', borderRadius: '0 4px 0 0' },
                            { bottom: -2, left: -2, borderBottom: '3px solid #4CAF50', borderLeft: '3px solid #4CAF50', borderRadius: '0 0 0 4px' },
                            { bottom: -2, right: -2, borderBottom: '3px solid #4CAF50', borderRight: '3px solid #4CAF50', borderRadius: '0 0 4px 0' },
                        ].map((s, i) => <div key={i} style={{ position: 'absolute', width: '24px', height: '24px', ...s }} />)}
                    </div>
                </div>
            )}

            {/* Top Controls */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '48px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <button onClick={onClose} style={{ width: '44px', height: '44px', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                    <X size={22} color="white" />
                </button>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', fontWeight: '600' }}>Point at a plant</span>
                <div style={{ width: '44px' }} />
            </div>

            {/* Bottom Controls: Upload + Capture */}
            <div style={{ position: 'absolute', bottom: '40px', left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '32px', zIndex: 10, paddingBottom: 'env(safe-area-inset-bottom)' }}>
                {/* Upload photo button */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                    style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)' }}
                >
                    <ImagePlus size={24} color="white" />
                </button>

                {/* Main capture button */}
                <button
                    onClick={captureFromCamera}
                    disabled={isAnalyzing || cameraError}
                    style={{ width: '80px', height: '80px', background: 'white', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (isAnalyzing || cameraError) ? 'not-allowed' : 'pointer', boxShadow: '0 0 0 6px rgba(255,255,255,0.2)', opacity: (isAnalyzing || cameraError) ? 0.4 : 1 }}
                >
                    <div style={{ width: '64px', height: '64px', background: '#1A4D2E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Camera size={30} color="white" />
                    </div>
                </button>

                {/* Spacer */}
                <div style={{ width: '56px', height: '56px' }} />
            </div>

            {/* Hidden inputs */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
            />
        </motion.div>
    );
};
