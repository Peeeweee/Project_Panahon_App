import React, { useMemo, useState } from 'react';
import { City } from '../data/cities';

interface RegionalMapProps {
  countryName: string;
  countryPath: string; // SVG path data for the country
  countryRect: DOMRect; // Original position of the country on world map
  cities: City[];
  onCityClick: (city: City) => void;
  weatherType: 'rain' | 'snow' | 'cloudy' | 'storm' | 'clear';
}

const RegionalMap: React.FC<RegionalMapProps> = ({
  countryName,
  countryPath,
  countryRect,
  cities,
  onCityClick,
  weatherType
}) => {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  // Calculate the bounding box of the country path
  const pathBounds = useMemo(() => {
    // Parse SVG path to get approximate bounds
    // This is a simplified version - in production you'd use proper path parsing
    const pathRegex = /[-+]?[0-9]*\.?[0-9]+/g;
    const coords = countryPath.match(pathRegex)?.map(parseFloat) || [];

    if (coords.length < 2) {
      return { minX: 0, maxX: 100, minY: 0, maxY: 100 };
    }

    const xs = coords.filter((_, i) => i % 2 === 0);
    const ys = coords.filter((_, i) => i % 2 === 1);

    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys)
    };
  }, [countryPath]);

  // Convert lat/lon to SVG coordinates within the country bounds
  const projectCityToSVG = (city: City) => {
    const { lat, lon } = city;
    const { minX, maxX, minY, maxY } = pathBounds;

    // Simple mercator-like projection (simplified)
    // This maps lat/lon to the SVG coordinate space
    const x = ((lon + 180) / 360) * (maxX - minX) + minX;
    const y = ((90 - lat) / 180) * (maxY - minY) + minY;

    return { x, y };
  };

  // Determine marker color based on weather
  const markerColor = useMemo(() => {
    switch (weatherType) {
      case 'rain': return 'rgba(96, 165, 250, 1)'; // blue
      case 'snow': return 'rgba(165, 243, 252, 1)'; // cyan
      case 'storm': return 'rgba(251, 191, 36, 1)'; // amber
      case 'cloudy': return 'rgba(156, 163, 175, 1)'; // gray
      default: return 'rgba(251, 146, 60, 1)'; // orange
    }
  }, [weatherType]);

  return (
    <>
      <style>{`
        @keyframes pulse-marker {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 2px currentColor); }
          50% { filter: drop-shadow(0 0 6px currentColor); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .city-marker {
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation: bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .city-marker:hover {
          transform: scale(1.8);
          animation: glow-pulse 1.5s ease-in-out infinite;
        }
        .city-marker-pulse {
          animation: pulse-marker 3s ease-in-out infinite;
        }
      `}</style>

      <svg
        className="absolute inset-0 w-full h-full pointer-events-auto"
        viewBox={`${pathBounds.minX - 10} ${pathBounds.minY - 10} ${pathBounds.maxX - pathBounds.minX + 20} ${pathBounds.maxY - pathBounds.minY + 20}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradient for country background */}
          <linearGradient id="countryGradientRegional" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(167, 139, 250, 0.3)" />
            <stop offset="100%" stopColor="rgba(76, 29, 149, 0.5)" />
          </linearGradient>

          {/* Glow filter for markers */}
          <filter id="markerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Drop shadow for country */}
          <filter id="countryShadowRegional" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Country outline */}
        <path
          d={countryPath}
          fill="url(#countryGradientRegional)"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth={0.5}
          filter="url(#countryShadowRegional)"
          vectorEffect="non-scaling-stroke"
        />

        {/* City markers */}
        {cities.map((city, index) => {
          const { x, y } = projectCityToSVG(city);
          const isHovered = hoveredCity === city.name;
          const isCapital = city.isCapital;

          return (
            <g
              key={city.name}
              onMouseEnter={() => setHoveredCity(city.name)}
              onMouseLeave={() => setHoveredCity(null)}
              onClick={() => onCityClick(city)}
              style={{
                cursor: 'pointer',
                animationDelay: `${index * 50}ms` // Staggered animation
              }}
            >
              {/* Ripple effect on hover */}
              {isHovered && (
                <circle
                  cx={x}
                  cy={y}
                  r={isCapital ? 4 : 3}
                  fill={markerColor}
                  opacity={0.3}
                  style={{ animation: 'ripple 1.5s ease-out infinite' }}
                />
              )}

              {/* Main marker dot */}
              <circle
                cx={x}
                cy={y}
                r={isCapital ? 3 : 2}
                fill={markerColor}
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth={0.5}
                className={`city-marker ${!isHovered ? 'city-marker-pulse' : ''}`}
                filter="url(#markerGlow)"
                vectorEffect="non-scaling-stroke"
              />

              {/* Capital star indicator */}
              {isCapital && (
                <path
                  d={`M ${x},${y - 5} L ${x + 1.5},${y - 2} L ${x + 5},${y - 2} L ${x + 2},${y} L ${x + 3},${y + 4} L ${x},${y + 2} L ${x - 3},${y + 4} L ${x - 2},${y} L ${x - 5},${y - 2} L ${x - 1.5},${y - 2} Z`}
                  fill="rgba(251, 191, 36, 0.8)"
                  stroke="rgba(255, 255, 255, 0.9)"
                  strokeWidth={0.3}
                  opacity={isHovered ? 1 : 0.6}
                  className="city-marker"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {/* Enhanced City tooltip (only on hover) */}
              {isHovered && (
                <g>
                  {/* Tooltip background with gradient */}
                  <defs>
                    <linearGradient id={`tooltip-gradient-${city.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(30, 20, 60, 0.95)" />
                      <stop offset="100%" stopColor="rgba(15, 10, 40, 0.98)" />
                    </linearGradient>
                  </defs>

                  {/* Tooltip card */}
                  <rect
                    x={x + 6}
                    y={y - 20}
                    width={Math.max(city.name.length * 5.5, 60)}
                    height={city.region ? 32 : 24}
                    fill={`url(#tooltip-gradient-${city.name})`}
                    rx={4}
                    stroke="rgba(167, 139, 250, 0.5)"
                    strokeWidth={0.5}
                    vectorEffect="non-scaling-stroke"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                  />

                  {/* City name */}
                  <text
                    x={x + 10}
                    y={y - 10}
                    fill="white"
                    fontSize="9"
                    fontWeight="700"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {city.name}
                  </text>

                  {/* Region subtitle with icon */}
                  {city.region && (
                    <>
                      <text
                        x={x + 10}
                        y={y - 2}
                        fill="rgba(167, 139, 250, 0.8)"
                        fontSize="6"
                        fontWeight="500"
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      >
                        📍 {city.region}
                      </text>
                    </>
                  )}

                  {/* Capital indicator in tooltip */}
                  {isCapital && (
                    <text
                      x={x + 10}
                      y={city.region ? y + 6 : y - 2}
                      fill="rgba(251, 191, 36, 0.9)"
                      fontSize="5"
                      fontWeight="600"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      ⭐ Capital
                    </text>
                  )}

                  {/* Click hint */}
                  <text
                    x={x + Math.max(city.name.length * 5.5, 60) - 2}
                    y={y - 12}
                    fill="rgba(255, 255, 255, 0.4)"
                    fontSize="7"
                    textAnchor="end"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    →
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Overlay instruction hint (fades out after a few seconds) */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none animate-pulse z-10">
        <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 text-white/70 text-[10px] font-semibold uppercase tracking-wider">
          Click a city to explore
        </div>
      </div>
    </>
  );
};

export default RegionalMap;
