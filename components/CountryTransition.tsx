
import React, { useEffect, useState, useCallback } from 'react';
import { TransitionData } from '../types';

interface CountryTransitionProps {
  data: TransitionData;
  isExiting: boolean;
}

const CountryTransition: React.FC<CountryTransitionProps> = ({ data, isExiting }) => {
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: 'translate(0, 0) scale(1)',
    opacity: 0.8,
  });

  // Function to calculate position based on current window size
  const calculateStyle = useCallback((isResizeEvent = false) => {
    // 1. Viewport Center
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;

    // 2. Element Center (Fixed based on initial click)
    const countryCenterX = data.initialRect.left + data.initialRect.width / 2;
    const countryCenterY = data.initialRect.top + data.initialRect.height / 2;

    // 3. Base Translation
    let translateX = viewportCenterX - countryCenterX;
    let translateY = viewportCenterY - countryCenterY;

    // 4. Offset Logic (Must match WeatherCard layout)
    // Desktop (md: 768px+): Card is split left/right. Left panel width is ~50% of card.
    // Card max-width is 3xl (~48rem / 768px). Half is 384px. Center of left panel is -192px from center.
    if (window.innerWidth >= 768) {
       translateX -= 192; 
       translateY -= 60; // Visual tweak to move it slightly up in the left panel
    } else {
       // Mobile: Card is stacked. Left panel is on top with fixed h-64 (256px).
       // We want to center in that top 256px area.
       // The card is roughly centered in viewport.
       // Top panel center is relative to card center.
       // If card height is ~600px, top is -300px. Center of top section is -300 + 128 = -172px approx.
       translateY -= 140; 
    }

    // 5. Scale Logic
    const maxDimension = Math.max(data.initialRect.width, data.initialRect.height);
    // Dynamic target size based on viewport
    const targetDimension = Math.min(window.innerWidth, window.innerHeight) * 0.35; 
    let scale = targetDimension / maxDimension;
    scale = Math.max(1.8, Math.min(scale, 12));

    return {
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        opacity: 1,
        // On resize, we want instant updates (no lag). On entry, we want smooth animation.
        transition: isResizeEvent 
            ? 'none' 
            : 'transform 1000ms cubic-bezier(0.4, 0, 0.2, 1), opacity 500ms ease-in'
    };
  }, [data.initialRect]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
        if (!isExiting) {
            setStyle(calculateStyle(true));
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateStyle, isExiting]);

  // Handle Entry / Exit Animations
  useEffect(() => {
    if (isExiting) {
        // Reverse to origin
        setStyle({
            transform: 'translate(0, 0) scale(1)',
            opacity: 0,
            transition: 'transform 1000ms cubic-bezier(0.4, 0, 0.2, 1), opacity 800ms ease-out'
        });
    } else {
        // Initial Entry (frame delay to ensure transition triggers)
        requestAnimationFrame(() => {
            setStyle(calculateStyle(false));
        });
    }
  }, [isExiting, calculateStyle]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      <svg className="w-full h-full">
        <defs>
          <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
             <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.5" />
          </filter>
          <linearGradient id="gradient-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(167, 139, 250, 0.8)" />
            <stop offset="100%" stopColor="rgba(76, 29, 149, 1)" />
          </linearGradient>
        </defs>
        
        <path
          d={data.path}
          fill="url(#gradient-fill)"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth={0.5} 
          filter="url(#drop-shadow)"
          style={{
            ...style,
            transformOrigin: `${data.initialRect.left + data.initialRect.width / 2}px ${data.initialRect.top + data.initialRect.height / 2}px`,
            vectorEffect: 'non-scaling-stroke' 
          }}
        />
      </svg>
    </div>
  );
};

export default CountryTransition;
