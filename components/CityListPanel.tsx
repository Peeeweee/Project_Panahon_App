import React, { useMemo, useState } from 'react';
import { City } from '../data/cities';

interface CityListPanelProps {
  countryName: string;
  cities: City[];
  onCityClick: (city: City) => void;
  weatherType: 'rain' | 'snow' | 'cloudy' | 'storm' | 'clear';
}

const CityListPanel: React.FC<CityListPanelProps> = ({
  countryName,
  cities,
  onCityClick,
  weatherType
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

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

  // Determine color based on weather
  const accentColor = useMemo(() => {
    switch (weatherType) {
      case 'rain': return 'rgb(96, 165, 250)';
      case 'snow': return 'rgb(165, 243, 252)';
      case 'storm': return 'rgb(251, 191, 36)';
      case 'cloudy': return 'rgb(156, 163, 175)';
      default: return 'rgb(251, 146, 60)';
    }
  }, [weatherType]);

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col bg-gradient-to-br from-purple-900/20 to-black/40 backdrop-blur-sm">
      {/* Header with Enhanced Search Bar */}
      <div className="p-4 border-b border-white/20 bg-gradient-to-r from-purple-900/40 to-indigo-900/40">
        <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl border-2 border-purple-400/60 shadow-lg shadow-purple-500/20 flex items-center gap-3 hover:border-purple-400 transition-all">
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

        {/* Results count */}
        <div className="mt-2 text-xs text-white/50 text-center">
          {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'} • {Object.keys(citiesByRegion).length} {Object.keys(citiesByRegion).length === 1 ? 'region' : 'regions'}
        </div>
      </div>

      {/* Scrollable City List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
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
                  onClick={() => onCityClick(city)}
                  onMouseEnter={() => setHoveredCity(city.name)}
                  onMouseLeave={() => setHoveredCity(null)}
                  type="button"
                  className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    {/* City Name */}
                    <div className="flex items-center gap-2 flex-1">
                      {/* City Dot */}
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0 transition-transform group-hover:scale-150"
                        style={{ backgroundColor: accentColor }}
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
                      className={`w-4 h-4 text-white/30 group-hover:text-purple-400 group-hover:translate-x-1 transition-all flex-shrink-0 ${hoveredCity === city.name ? 'opacity-100' : 'opacity-0'}`}
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

export default CityListPanel;
