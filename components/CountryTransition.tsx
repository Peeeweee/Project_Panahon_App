
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
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const viewportCenterX = viewportWidth / 2;
    const viewportCenterY = viewportHeight / 2;

    // Country's initial center position
    const countryCenterX = data.initialRect.left + data.initialRect.width / 2;
    const countryCenterY = data.initialRect.top + data.initialRect.height / 2;

    // Calculate target position (LEFT PANEL of the weather card)
    let targetX: number;
    let targetY: number;
    let leftPanelWidth: number;

    if (viewportWidth >= 768) {
       // Desktop: Card is max-w-3xl (768px max) and centered
       // But actual card width depends on viewport
       const actualCardWidth = Math.min(768, viewportWidth - 32); // Account for mx-4
       leftPanelWidth = actualCardWidth / 2; // Left panel is 50% of card

       // Card's left edge position
       const cardLeftEdge = viewportCenterX - (actualCardWidth / 2);

       // Target: Center of left panel
       targetX = cardLeftEdge + (leftPanelWidth / 2);
       targetY = viewportCenterY;
    } else {
       // Mobile: Stacked layout, left panel is on top
       leftPanelWidth = Math.min(viewportWidth - 32, 768);
       targetX = viewportCenterX;
       targetY = viewportCenterY - 80; // Move up to top panel
    }

    const translateX = targetX - countryCenterX;
    const translateY = targetY - countryCenterY;

    // Scale Logic - Adaptive based on country size and left panel size
    const maxDimension = Math.max(data.initialRect.width, data.initialRect.height);
    // Target should fit comfortably in the left panel (use 70% of panel width)
    const targetDimension = leftPanelWidth * 0.7;
    let scale = targetDimension / maxDimension;

    // Clamp scale to reasonable bounds
    scale = Math.max(1.8, Math.min(scale, 8));

    return {
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        opacity: 0.8,
        transition: isResizeEvent
            ? 'none'
            : 'transform 1000ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 800ms ease-in-out'
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
