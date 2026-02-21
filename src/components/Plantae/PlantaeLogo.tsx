import React from 'react';
import './animations.css';

interface PlantaeLogoProps {
    className?: string;
    style?: React.CSSProperties;
}

export const PlantaeLogo: React.FC<PlantaeLogoProps> = ({ className, style }) => {
    return (
        <svg
            viewBox="0 0 1000 850"
            className={`w-full h-auto overflow-visible ${className || ''}`}
            style={style}
            aria-label="Plantae Logo"
        >
            <text
                x="50%"
                y="400"
                textAnchor="middle"
                className="font-script"
                style={{
                    fontSize: '240px',
                    fill: '#1a1a1a',
                    fillOpacity: 0,
                    stroke: '#1a1a1a',
                    strokeWidth: '3.5px',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeDasharray: 1000,
                    strokeDashoffset: 1000,
                    animation: `
            write 2.5s cubic-bezier(0.37, 0, 0.63, 1) forwards 0.5s,
            fillIn 2s ease forwards 1.0s
          `
                }}
            >
                Plantae
            </text>

            <path
                d="M 495,360 
           C 600,300 950,350 955,520 
           C 915,640 300,580 300,450 
           C 300,350 580,450 600,700 
           C 610,850 550,950 580,1100
           C 600,1200 580,1300 580,1650"
                style={{
                    fill: 'none',
                    stroke: '#1a1a1a',
                    strokeWidth: '4.5px',
                    strokeLinecap: 'round',
                    strokeDasharray: 3500,
                    strokeDashoffset: 3500,
                    opacity: 0,
                    animation: `
            dropTail 2.8s cubic-bezier(0.45, 0, 0.55, 1) forwards 2.7s,
            fadeOut 1s ease forwards 5.2s
          `
                }}
            />
        </svg>
    );
};
