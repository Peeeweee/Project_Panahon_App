import React, { useMemo, useState } from 'react';
import { City } from '../data/cities';

interface HybridCityViewProps {
  countryName: string;
  countryPath: string;
  countryRect: DOMRect;
  cities: City[];
  onCityClick: (city: City) => void;
  weatherType: 'rain' | 'snow' | 'cloudy' | 'storm' | 'clear';
  onBack?: () => void; // Callback for back button
  cityName?: string; // Current city name for breadcrumb
}

const HybridCityView: React.FC<HybridCityViewProps> = ({
  countryName,
  countryPath,
  countryRect,
  cities,
  onCityClick,
  weatherType,
  onBack,
  cityName
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'hybrid' | 'list' | 'map'>('hybrid'); // New: Toggle between views

  // Calculate geographic bounds from the actual city coordinates
  const geoBounds = useMemo(() => {
    if (cities.length === 0) {
      return { minLat: -90, maxLat: 90, minLon: -180, maxLon: 180 };
    }

    const lats = cities.map(c => c.lat);
    const lons = cities.map(c => c.lon);

    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLon: Math.min(...lons),
      maxLon: Math.max(...lons)
    };
  }, [cities]);

  // Calculate the bounding box of the SVG country path
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
    const { minLat, maxLat, minLon, maxLon } = geoBounds;
    const { minX, maxX, minY, maxY } = pathBounds;

    // Calculate Mercator Y for this latitude
    const latRad = lat * Math.PI / 180;
    const mercatorY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));

    // Calculate Mercator Y for bounds
    const minLatRad = minLat * Math.PI / 180;
    const maxLatRad = maxLat * Math.PI / 180;
    const mercatorMinY = Math.log(Math.tan(Math.PI / 4 + minLatRad / 2));
    const mercatorMaxY = Math.log(Math.tan(Math.PI / 4 + maxLatRad / 2));

    // Map longitude linearly
    const lonNormalized = (lon - minLon) / (maxLon - minLon);
    const x = minX + lonNormalized * (maxX - minX);

    // Map Mercator Y (note: Mercator Y increases as latitude decreases)
    const mercatorNormalized = (mercatorY - mercatorMaxY) / (mercatorMinY - mercatorMaxY);
    const y = minY + mercatorNormalized * (maxY - minY);

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

  // Group cities by region
  const citiesByRegion = useMemo(() => {
    const grouped: Record<string, City[]> = {};
    filteredCities.forEach(city => {
      const region = city.region || 'Other';
      if (!grouped[region]) grouped[region] = [];
      grouped[region].push(city);
    });
    return grouped;
  }, [filteredCities]);

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

  const accentColor = useMemo(() => {
    switch (weatherType) {
      case 'rain': return 'rgb(96, 165, 250)';
      case 'snow': return 'rgb(165, 243, 252)';
      case 'storm': return 'rgb(251, 191, 36)';
      case 'cloudy': return 'rgb(156, 163, 175)';
      default: return 'rgb(251, 146, 60)';
    }
  }, [weatherType]);

  const handleCityClickInternal = (city: City) => {
    setSelectedCity(city.name);
    onCityClick(city);
  };

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col bg-gradient-to-br from-purple-900/20 to-black/40 backdrop-blur-sm">
      {/* Breadcrumb Navigation (Above Search) */}
      <div className="absolute top-3 left-3 z-50 flex items-center gap-2">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="group p-2 bg-black/60 hover:bg-white/20 rounded-full transition-all backdrop-blur-md border border-white/20 shadow-lg"
            title="Back to country"
            type="button"
          >
            <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        )}

        {/* Breadcrumb Trail */}
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5 text-white text-xs font-medium">
          <span className="text-white/50">World</span>
          <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className={cityName ? 'text-white/70' : 'text-white'}>{countryName}</span>
          {cityName && (
            <>
              <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white">{cityName}</span>
            </>
          )}
        </div>
      </div>

      {/* Header: Search Bar + View Toggle */}
      <div className="pt-16 px-3 pb-3 border-b border-white/20 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 z-20">
        {/* Search Bar */}
        <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border-2 border-purple-400/60 shadow-lg shadow-purple-500/20 flex items-center gap-3 hover:border-purple-400 transition-all">
          <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cities or regions..."
            className="bg-transparent text-gray-900 text-base font-medium placeholder-gray-500 outline-none flex-1"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-500 hover:text-purple-600 transition-colors p-1 hover:bg-purple-100 rounded-full"
              title="Clear search"
              type="button"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* View Toggle + Results */}
        <div className="mt-2 flex items-center justify-between gap-3">
          {/* Results count */}
          <div className="text-xs text-white/70 font-medium">
            {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'} • {Object.keys(citiesByRegion).length} {Object.keys(citiesByRegion).length === 1 ? 'region' : 'regions'}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="List View"
              type="button"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              List
            </button>
            <button
              onClick={() => setViewMode('hybrid')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'hybrid'
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Hybrid View"
              type="button"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              Both
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Map View"
              type="button"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Map
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Layout based on View Mode */}
      <div className="flex-1 flex overflow-hidden">
        {/* Interactive Map */}
        {(viewMode === 'map' || viewMode === 'hybrid') && (
        <div className={`${viewMode === 'hybrid' ? 'w-[55%]' : 'w-full'} relative ${viewMode === 'hybrid' ? 'border-r border-white/10' : ''}`}>
          <style>{`
            @keyframes marker-appear {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
            @keyframes ripple-pulse {
              0%, 100% { opacity: 0.6; }
              50% { opacity: 0; }
            }
            .city-marker-group {
              cursor: pointer;
            }
          `}</style>

          <svg
            className="absolute inset-0 w-full h-full"
            viewBox={`${pathBounds.minX - 10} ${pathBounds.minY - 10} ${pathBounds.maxX - pathBounds.minX + 20} ${pathBounds.maxY - pathBounds.minY + 20}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Gradient for country background */}
              <linearGradient id="countryGradientHybrid" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(167, 139, 250, 0.2)" />
                <stop offset="100%" stopColor="rgba(76, 29, 149, 0.3)" />
              </linearGradient>

              {/* Glow filter for markers */}
              <filter id="markerGlowHybrid" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Drop shadow for country */}
              <filter id="countryShadowHybrid" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Country outline */}
            <path
              d={countryPath}
              fill="url(#countryGradientHybrid)"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth={0.4}
              filter="url(#countryShadowHybrid)"
              vectorEffect="non-scaling-stroke"
            />

            {/* City markers */}
            {filteredCities.map((city) => {
              const { x, y } = projectCityToSVG(city);
              const isHovered = hoveredCity === city.name;
              const isSelected = selectedCity === city.name;
              const isCapital = city.isCapital;

              return (
                <g key={city.name}>
                  {/* Invisible larger hit area for easier clicking */}
                  <circle
                    cx={x}
                    cy={y}
                    r={8}
                    fill="transparent"
                    className="city-marker-group"
                    onMouseEnter={() => setHoveredCity(city.name)}
                    onMouseLeave={() => setHoveredCity(null)}
                    onClick={() => handleCityClickInternal(city)}
                    style={{ pointerEvents: 'all' }}
                  />

                  {/* Ripple effect on hover/select - static, no animation */}
                  {(isHovered || isSelected) && (
                    <circle
                      cx={x}
                      cy={y}
                      r={isCapital ? 5 : 4}
                      fill={markerColor}
                      opacity={0.2}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}

                  {/* City marker dot - fixed size, no scaling */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isCapital ? 2.5 : 1.8}
                    fill={isSelected ? 'rgba(167, 139, 250, 1)' : isHovered ? 'rgba(255, 255, 255, 1)' : markerColor}
                    stroke="rgba(255, 255, 255, 0.9)"
                    strokeWidth={isSelected || isHovered ? 0.8 : 0.5}
                    filter="url(#markerGlowHybrid)"
                    vectorEffect="non-scaling-stroke"
                    style={{ pointerEvents: 'none' }}
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
                      style={{ pointerEvents: 'none' }}
                    />
                  )}

                  {/* Hover tooltip */}
                  {isHovered && (
                    <g style={{ pointerEvents: 'none' }}>
                      <rect
                        x={x + 4}
                        y={y - 12}
                        width={Math.max(city.name.length * 4, 40)}
                        height={14}
                        rx={2}
                        fill="rgba(15, 10, 40, 0.98)"
                        stroke="rgba(167, 139, 250, 0.8)"
                        strokeWidth={0.4}
                        vectorEffect="non-scaling-stroke"
                      />
                      <text
                        x={x + 4 + Math.max(city.name.length * 4, 40) / 2}
                        y={y - 4}
                        fill="white"
                        fontSize="6"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {city.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Map overlay label */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white/70 text-[10px] font-semibold">
            📍 Click any city on map
          </div>
        </div>
        )}

        {/* City List */}
        {(viewMode === 'list' || viewMode === 'hybrid') && (
        <div className={`${viewMode === 'hybrid' ? 'w-[45%]' : 'w-full'} flex flex-col overflow-hidden`}>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
            {Object.entries(citiesByRegion).sort(([a], [b]) => a.localeCompare(b)).map(([region, regionCities]: [string, City[]]) => (
              <div key={region} className="mb-3">
                {/* Region Header */}
                <div className="px-2 py-1 mb-1 flex items-center gap-2">
                  <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    {region}
                  </span>
                  <span className="text-[10px] text-white/40">
                    ({regionCities.length})
                  </span>
                </div>

                {/* Cities in this region */}
                <div className="space-y-1">
                  {regionCities.sort((a, b) => (b.population || 0) - (a.population || 0)).map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCityClickInternal(city)}
                      onMouseEnter={() => setHoveredCity(city.name)}
                      onMouseLeave={() => setHoveredCity(null)}
                      type="button"
                      className={`w-full text-left px-3 py-2 rounded-lg border transition-all group ${
                        selectedCity === city.name
                          ? 'bg-purple-500/30 border-purple-400'
                          : hoveredCity === city.name
                          ? 'bg-white/10 border-purple-400/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-400/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {/* City Name */}
                        <div className="flex items-center gap-2 flex-1">
                          {/* City Dot */}
                          <div
                            className={`w-2 h-2 rounded-full flex-shrink-0 transition-transform ${
                              hoveredCity === city.name ? 'scale-150' : 'scale-100'
                            }`}
                            style={{ backgroundColor: selectedCity === city.name ? 'rgb(167, 139, 250)' : accentColor }}
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white group-hover:text-purple-200 transition-colors truncate">
                                {city.name}
                              </span>
                              {city.isCapital && (
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-500/30 flex-shrink-0">
                                  ⭐ Capital
                                </span>
                              )}
                            </div>

                            {/* Population hint */}
                            {city.population && (
                              <div className="text-[10px] text-white/40 mt-0.5">
                                Pop. {(city.population / 1000000).toFixed(1)}M
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Arrow indicator */}
                        <svg
                          className={`w-4 h-4 text-white/30 group-hover:text-purple-400 group-hover:translate-x-1 transition-all flex-shrink-0 ${
                            hoveredCity === city.name || selectedCity === city.name ? 'opacity-100' : 'opacity-0'
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Empty state */}
            {filteredCities.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <svg className="w-12 h-12 text-white/20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white/50 text-sm">No cities found</p>
                <p className="text-white/30 text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(167, 139, 250, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(167, 139, 250, 0.5);
        }
      `}</style>
    </div>
  );
};

export default HybridCityView;
