import React, { useState, useMemo } from 'react';
import { City } from '../data/cities';

interface CityLocationPanelProps {
  cityName: string;
  cityData: City;
  countryName: string;
  countryPath: string;
  allCities: City[];
  weatherType: 'rain' | 'snow' | 'cloudy' | 'storm' | 'clear';
}

const CityLocationPanel: React.FC<CityLocationPanelProps> = ({
  cityName,
  cityData,
  countryName,
  countryPath,
  allCities,
  weatherType
}) => {
  const [showFullMap, setShowFullMap] = useState(false);

  // Calculate geographic bounds from all cities
  const geoBounds = useMemo(() => {
    if (allCities.length === 0) {
      return { minLat: -90, maxLat: 90, minLon: -180, maxLon: 180 };
    }

    const lats = allCities.map(c => c.lat);
    const lons = allCities.map(c => c.lon);

    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLon: Math.min(...lons),
      maxLon: Math.max(...lons)
    };
  }, [allCities]);

  // Calculate SVG path bounds
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

  // Project city coordinates to SVG
  const projectCityToSVG = (city: City) => {
    const { lat, lon } = city;
    const { minLat, maxLat, minLon, maxLon } = geoBounds;
    const { minX, maxX, minY, maxY } = pathBounds;

    const latRad = lat * Math.PI / 180;
    const mercatorY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));

    const minLatRad = minLat * Math.PI / 180;
    const maxLatRad = maxLat * Math.PI / 180;
    const mercatorMinY = Math.log(Math.tan(Math.PI / 4 + minLatRad / 2));
    const mercatorMaxY = Math.log(Math.tan(Math.PI / 4 + maxLatRad / 2));

    const lonNormalized = (lon - minLon) / (maxLon - minLon);
    const x = minX + lonNormalized * (maxX - minX);

    const mercatorNormalized = (mercatorY - mercatorMaxY) / (mercatorMinY - mercatorMaxY);
    const y = minY + mercatorNormalized * (maxY - minY);

    return { x, y };
  };

  const cityPosition = projectCityToSVG(cityData);

  // Marker color based on weather
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
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
      {!showFullMap ? (
        // Simple Location Indicator (Default View)
        <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
          {/* Country Outline with City Pin */}
          <svg
            className="w-full h-full max-w-md max-h-96"
            viewBox={`${pathBounds.minX - 10} ${pathBounds.minY - 10} ${pathBounds.maxX - pathBounds.minX + 20} ${pathBounds.maxY - pathBounds.minY + 20}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Simple gradient for country */}
              <linearGradient id="countryGradientSimple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(167, 139, 250, 0.15)" />
                <stop offset="100%" stopColor="rgba(76, 29, 149, 0.25)" />
              </linearGradient>

              {/* Pin marker filter */}
              <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Country outline */}
            <path
              d={countryPath}
              fill="url(#countryGradientSimple)"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth={0.5}
              vectorEffect="non-scaling-stroke"
            />

            {/* Location Pin */}
            <g transform={`translate(${cityPosition.x}, ${cityPosition.y})`}>
              {/* Pin shadow/glow */}
              <circle
                cx={0}
                cy={0}
                r={4}
                fill={markerColor}
                opacity={0.3}
              />

              {/* Pin base circle */}
              <circle
                cx={0}
                cy={0}
                r={2}
                fill={markerColor}
                stroke="rgba(255, 255, 255, 1)"
                strokeWidth={0.5}
                filter="url(#pinGlow)"
                vectorEffect="non-scaling-stroke"
              />

              {/* Pin pointer/drop */}
              <path
                d="M 0,-2 L -1.5,2 L 0,4 L 1.5,2 Z"
                fill={markerColor}
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth={0.3}
                vectorEffect="non-scaling-stroke"
              />

              {/* Pulsing ring animation */}
              <circle
                cx={0}
                cy={0}
                r={3}
                fill="none"
                stroke={markerColor}
                strokeWidth={0.5}
                opacity={0.6}
                vectorEffect="non-scaling-stroke"
              >
                <animate
                  attributeName="r"
                  from="3"
                  to="6"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.6"
                  to="0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </svg>

          {/* Location Info Card */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-xl max-w-xs">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: markerColor }}></div>
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">{cityName}</div>
                <div className="text-white/50 text-xs">{cityData.region}, {countryName}</div>
              </div>
            </div>

            {cityData.population && (
              <div className="mt-2 pt-2 border-t border-white/10 text-white/40 text-xs flex items-center gap-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span>Population: {(cityData.population / 1000000).toFixed(2)}M</span>
              </div>
            )}
          </div>

          {/* Expand Map Button */}
          <button
            onClick={() => setShowFullMap(true)}
            className="absolute bottom-8 right-8 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2 hover:scale-105"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Show Full Map
          </button>
        </div>
      ) : (
        // Full Interactive Map View
        <div className="w-full h-full relative">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={`${pathBounds.minX - 10} ${pathBounds.minY - 10} ${pathBounds.maxX - pathBounds.minX + 20} ${pathBounds.maxY - pathBounds.minY + 20}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="countryGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(167, 139, 250, 0.2)" />
                <stop offset="100%" stopColor="rgba(76, 29, 149, 0.3)" />
              </linearGradient>

              <filter id="mapGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Country outline */}
            <path
              d={countryPath}
              fill="url(#countryGradientFull)"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth={0.4}
              vectorEffect="non-scaling-stroke"
            />

            {/* All cities as small dots */}
            {allCities.map((city) => {
              const pos = projectCityToSVG(city);
              const isCurrentCity = city.name === cityName;

              return (
                <g key={city.name}>
                  {/* Other cities - smaller gray dots */}
                  {!isCurrentCity && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={0.8}
                      fill="rgba(255, 255, 255, 0.3)"
                      stroke="rgba(255, 255, 255, 0.5)"
                      strokeWidth={0.2}
                      vectorEffect="non-scaling-stroke"
                    />
                  )}

                  {/* Current city - highlighted */}
                  {isCurrentCity && (
                    <g>
                      {/* Pulsing ring */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={4}
                        fill="none"
                        stroke={markerColor}
                        strokeWidth={0.4}
                        opacity={0.5}
                        vectorEffect="non-scaling-stroke"
                      >
                        <animate
                          attributeName="r"
                          from="4"
                          to="8"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.5"
                          to="0"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>

                      {/* Main marker */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={2.5}
                        fill={markerColor}
                        stroke="rgba(255, 255, 255, 1)"
                        strokeWidth={0.5}
                        filter="url(#mapGlow)"
                        vectorEffect="non-scaling-stroke"
                      />

                      {/* Label */}
                      <g>
                        <rect
                          x={pos.x + 4}
                          y={pos.y - 8}
                          width={Math.max(city.name.length * 3.5, 40)}
                          height={12}
                          rx={2}
                          fill="rgba(15, 10, 40, 0.98)"
                          stroke={markerColor}
                          strokeWidth={0.4}
                          vectorEffect="non-scaling-stroke"
                        />
                        <text
                          x={pos.x + 4 + Math.max(city.name.length * 3.5, 40) / 2}
                          y={pos.y - 1}
                          fill="white"
                          fontSize="5"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {city.name}
                        </text>
                      </g>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Collapse Button */}
          <button
            onClick={() => setShowFullMap(false)}
            className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-white/20 rounded-full transition-all backdrop-blur-md border border-white/20 shadow-lg group"
            type="button"
            title="Collapse map"
          >
            <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Map Info */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 text-white/70 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: markerColor }}></div>
              <span className="font-semibold text-white">{cityName}</span>
              <span className="text-white/40">•</span>
              <span>{allCities.length} cities shown</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityLocationPanel;
