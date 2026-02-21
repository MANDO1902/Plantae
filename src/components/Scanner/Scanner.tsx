import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Sparkles } from 'lucide-react';

interface ScannerProps {
    onClose: () => void;
    onCapture: (imageData: string) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onClose, onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [laserY, setLaserY] = useState(0);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        async function setupCamera() {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                    audio: false
                });
                streamRef.current = mediaStream;
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Camera access error:", err);
            }
        }
        setupCamera();

        // Laser animation
        let direction = 1;
        let pos = 0;
        const interval = setInterval(() => {
            pos += direction * 2;
            if (pos >= 100) direction = -1;
            if (pos <= 0) direction = 1;
            setLaserY(pos);
        }, 20);

        return () => {
            isMounted.current = false;
            clearInterval(interval);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                const dataUrl = canvasRef.current.toDataURL('image/jpeg');
                setIsAnalyzing(true);
                setTimeout(() => {
                    if (isMounted.current) {
                        onCapture(dataUrl);
                    }
                }, 2000);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        >
            {/* Camera Feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Overlay */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {/* Dark borders */}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />

                {/* Scan frame */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)', width: '75vw', height: '55vh', maxWidth: '340px', maxHeight: '420px' }}>
                    {/* Transparent window */}
                    <div style={{ position: 'absolute', inset: 0, background: 'transparent', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '24px', overflow: 'hidden' }}>
                        {/* Laser */}
                        {!isAnalyzing && (
                            <div style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: `${laserY}%`,
                                height: '2px',
                                background: 'linear-gradient(to right, transparent, #4CAF50, transparent)',
                                boxShadow: '0 0 12px #4CAF50',
                                transition: 'top 0.02s linear'
                            }} />
                        )}

                        {/* Analyzing overlay */}
                        <AnimatePresence>
                            {isAnalyzing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ position: 'absolute', inset: 0, background: 'rgba(26,77,46,0.5)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                                >
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                        <Sparkles size={48} color="white" />
                                    </motion.div>
                                    <span style={{ color: 'white', fontSize: '17px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Analyzing...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Corner marks */}
                    {[['0', '0', 'top-0 left-0'], ['auto', '0', 'top-0 right-0'], ['0', 'auto', 'bottom-0 left-0'], ['auto', 'auto', 'bottom-0 right-0']].map((_, i) => {
                        const positions = [
                            { top: -2, left: -2, borderTop: '4px solid #4CAF50', borderLeft: '4px solid #4CAF50', borderRadius: '4px 0 0 0' },
                            { top: -2, right: -2, borderTop: '4px solid #4CAF50', borderRight: '4px solid #4CAF50', borderRadius: '0 4px 0 0' },
                            { bottom: -2, left: -2, borderBottom: '4px solid #4CAF50', borderLeft: '4px solid #4CAF50', borderRadius: '0 0 0 4px' },
                            { bottom: -2, right: -2, borderBottom: '4px solid #4CAF50', borderRight: '4px solid #4CAF50', borderRadius: '0 0 4px 0' },
                        ];
                        return <div key={i} style={{ position: 'absolute', width: '28px', height: '28px', ...positions[i] }} />;
                    })}
                </div>
            </div>

            {/* Close Button */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '52px 20px 0', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
                <button onClick={onClose} style={{ width: '44px', height: '44px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                    <X size={22} color="white" />
                </button>
                <div style={{ color: 'white', fontSize: '13px', fontWeight: '600', opacity: 0.7, alignSelf: 'center' }}>Point at a plant</div>
                <div style={{ width: '44px' }} />
            </div>

            {/* Capture Button */}
            <div style={{ position: 'absolute', bottom: '48px', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
                <button
                    onClick={captureImage}
                    disabled={isAnalyzing}
                    style={{ width: '80px', height: '80px', background: 'white', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isAnalyzing ? 'not-allowed' : 'pointer', boxShadow: '0 0 0 6px rgba(255,255,255,0.25)', opacity: isAnalyzing ? 0.5 : 1 }}
                >
                    <div style={{ width: '62px', height: '62px', background: '#1A4D2E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Camera size={30} color="white" />
                    </div>
                </button>
            </div>

            {/* Hidden canvas */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </motion.div>
    );
};
