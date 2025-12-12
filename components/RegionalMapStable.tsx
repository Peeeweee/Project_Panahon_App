import React, { useMemo, useState } from 'react';
import { City } from '../data/cities';

interface RegionalMapStableProps {
  countryName: string;
  countryPath: string;
  countryRect: DOMRect;
  cities: City[];
  onCityClick: (city: City) => void;
  weatherType: 'rain' | 'snow' | 'cloudy' | 'storm' | 'clear';
}

const RegionalMapStable: React.FC<RegionalMapStableProps> = ({
  countryName,
  countryPath,
  countryRect,
  cities,
  onCityClick,
  weatherType
}) => {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate the bounding box of the country path
  const pathBounds = useMemo(() => {
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

  // Convert lat/lon to SVG coordinates with proper Mercator projection
  const projectCityToSVG = (city: City) => {
    const { lat, lon } = city;
    const { minX, maxX, minY, maxY } = pathBounds;

    // Use proper Mercator projection (same as D3 uses for the country path)
    const mercatorY = Math.log(Math.tan((Math.PI / 4) + (lat * Math.PI / 360)));

    // Normalize to SVG bounds
    const x = ((lon + 180) / 360) * (maxX - minX) + minX;
    const y = minY + (maxY - minY) * (1 - (mercatorY + Math.PI) / (2 * Math.PI));

    return { x, y };
  };

  // Filter cities by search query
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cities;
    const query = searchQuery.toLowerCase();
    return cities.filter(city =>
      city.name.toLowerCase().includes(query) ||
      city.region?.toLowerCase().includes(query)
    );
  }, [cities, searchQuery]);

  // Determine marker color based on weather
  const markerColor = useMemo(() => {
    switch (weatherType) {
      case 'rain': return 'rgba(96, 165, 250, 1)';
      case 'snow': return 'rgba(165, 243, 252, 1)';
      case 'storm': return 'rgba(251, 191, 36, 1)';
      case 'cloudy': return 'rgba(156, 163, 175, 1)';
      default: return 'rgba(251, 146, 60, 1)';
    }
  }, [weatherType]);

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col">
      {/* Search Bar */}
      <div className="absolute top-2 left-2 right-2 z-30 flex justify-center">
        <div className="bg-black/60 backdrop-blur-xl px-3 py-2 rounded-full border border-white/20 flex items-center gap-2 w-full max-w-xs">
          <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cities..."
            className="bg-transparent text-white text-xs placeholder-white/40 outline-none flex-1"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-white/50 hover:text-white">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* City Count */}
      <div className="absolute bottom-2 right-2 z-30 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/20 text-white/70 text-[10px] font-medium">
        {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'}
      </div>

      <style>{`
        @keyframes marker-appear {
          0% { transform: scale(0) translateY(-10px); opacity: 0; }
          60% { transform: scale(1.3) translateY(0); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes label-fade-in {
          0% { opacity: 0; transform: translateY(-5px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .city-group {
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .city-group:hover .city-marker-dot {
          transform: scale(1.5);
        }
        .city-group:hover .city-label-bg {
          background: rgba(167, 139, 250, 0.95);
          border-color: rgba(255, 255, 255, 0.8);
        }
        .city-marker-dot {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .city-label-bg {
          transition: all 0.3s ease;
        }
      `}</style>

      {/* SVG Map */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-auto"
        viewBox={`${pathBounds.minX - 10} ${pathBounds.minY - 10} ${pathBounds.maxX - pathBounds.minX + 20} ${pathBounds.maxY - pathBounds.minY + 20}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradient for country background */}
          <linearGradient id="countryGradientStable" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(167, 139, 250, 0.2)" />
            <stop offset="100%" stopColor="rgba(76, 29, 149, 0.3)" />
          </linearGradient>

          {/* Glow filter for markers */}
          <filter id="markerGlowStable" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Drop shadow for country */}
          <filter id="countryShadowStable" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Country outline */}
        <path
          d={countryPath}
          fill="url(#countryGradientStable)"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={0.4}
          filter="url(#countryShadowStable)"
          vectorEffect="non-scaling-stroke"
        />

        {/* City markers and labels */}
        {filteredCities.map((city, index) => {
          const { x, y } = projectCityToSVG(city);
          const isHovered = hoveredCity === city.name;
          const isCapital = city.isCapital;

          // Calculate label width based on name length
          const labelWidth = Math.max(city.name.length * 3.5, 30);
          const labelHeight = 10;

          return (
            <g
              key={city.name}
              className="city-group"
              onMouseEnter={() => setHoveredCity(city.name)}
              onMouseLeave={() => setHoveredCity(null)}
              onClick={() => onCityClick(city)}
              style={{
                animation: `marker-appear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 30}ms forwards`,
                opacity: 0
              }}
            >
              {/* City marker dot */}
              <circle
                cx={x}
                cy={y}
                r={isCapital ? 2.5 : 1.8}
                fill={markerColor}
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth={0.4}
                className="city-marker-dot"
                filter="url(#markerGlowStable)"
                vectorEffect="non-scaling-stroke"
              />

              {/* Capital star indicator */}
              {isCapital && (
                <circle
                  cx={x}
                  cy={y}
                  r={4}
                  fill="none"
                  stroke="rgba(251, 191, 36, 0.6)"
                  strokeWidth={0.5}
                  vectorEffect="non-scaling-stroke"
                  style={{
                    animation: isHovered ? 'pulse-marker 1.5s ease-in-out infinite' : 'none'
                  }}
                />
              )}

              {/* Persistent City Label */}
              <g
                style={{
                  animation: `label-fade-in 0.3s ease ${index * 30 + 200}ms forwards`,
                  opacity: 0
                }}
              >
                {/* Label background */}
                <rect
                  x={x + 4}
                  y={y - labelHeight / 2}
                  width={labelWidth}
                  height={labelHeight}
                  rx={2}
                  className="city-label-bg"
                  fill={isHovered ? "rgba(167, 139, 250, 0.95)" : "rgba(0, 0, 0, 0.7)"}
                  stroke={isHovered ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.2)"}
                  strokeWidth={0.3}
                  vectorEffect="non-scaling-stroke"
                />

                {/* City name text */}
                <text
                  x={x + 4 + labelWidth / 2}
                  y={y + 2}
                  fill="white"
                  fontSize={isCapital ? "6" : "5"}
                  fontWeight={isCapital ? "700" : "500"}
                  textAnchor="middle"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {city.name}
                </text>
              </g>

              {/* Hover tooltip with more details */}
              {isHovered && (
                <g>
                  <rect
                    x={x + 4}
                    y={y - labelHeight / 2 - 14}
                    width={Math.max(labelWidth, 50)}
                    height={12}
                    rx={2}
                    fill="rgba(15, 10, 40, 0.98)"
                    stroke="rgba(167, 139, 250, 0.8)"
                    strokeWidth={0.4}
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x={x + 4 + Math.max(labelWidth, 50) / 2}
                    y={y - labelHeight / 2 - 6}
                    fill="rgba(167, 139, 250, 1)"
                    fontSize="5"
                    fontWeight="600"
                    textAnchor="middle"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    📍 {city.region || 'Click to view'}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default RegionalMapStable;
