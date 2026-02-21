import React from 'react';
import { PlantaeLogo } from './PlantaeLogo';

export const PlantaeCinematicLogo: React.FC = () => {
    return (
        <div className="w-full h-full flex items-center justify-center select-none pointer-events-none p-0">
            {/* 
         Responsive Container:
         - Widths matched to user preference (95vw mobile, 60vw tablet, 45vw desktop).
      */}
            <div className="relative w-[95vw] md:w-[60vw] lg:w-[45vw] mx-auto flex items-center justify-center">
                <PlantaeLogo />
            </div>
        </div>
    );
};
