import React, { useState, useMemo, useEffect } from 'react';
import { WORLD_COUNTRIES, Country, searchCountries } from '../data/countries';
import { getWeatherByCoordinates } from '../services/weatherService';

interface CountryListViewProps {
  onSelectCountry: (country: Country) => void;
  isVisible: boolean;
}

interface CountryWeatherPreview {
  temperature: string;
  condition: string;
  icon: string;
}

// Get weather icon based on condition
const getWeatherIcon = (condition: string): string => {
  const c = condition.toLowerCase();
  if (c.includes('clear') || c.includes('sunny')) return '☀️';
  if (c.includes('cloud') || c.includes('overcast')) return '☁️';
  if (c.includes('partly')) return '⛅';
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return '🌧️';
  if (c.includes('snow') || c.includes('blizzard')) return '❄️';
  if (c.includes('storm') || c.includes('thunder')) return '⛈️';
  if (c.includes('fog') || c.includes('mist')) return '🌫️';
  if (c.includes('wind')) return '💨';
  return '🌤️';
};

// Get time-based greeting and icon
const getTimeBasedInfo = (coordinates: { lat: number; lon: number }): { icon: string; label: string } => {
  const now = new Date();
  const hour = now.getUTCHours();

  // Approximate timezone offset based on longitude
  const timezoneOffset = Math.round(coordinates.lon / 15);
  const localHour = (hour + timezoneOffset + 24) % 24;

  if (localHour >= 5 && localHour < 12) return { icon: '🌅', label: 'Morning' };
  if (localHour >= 12 && localHour < 17) return { icon: '☀️', label: 'Afternoon' };
  if (localHour >= 17 && localHour < 20) return { icon: '🌆', label: 'Evening' };
  return { icon: '🌙', label: 'Night' };
};

// Get climate zone based on latitude
const getClimateZone = (lat: number): { emoji: string; name: string } => {
  const absLat = Math.abs(lat);
  if (absLat > 66.5) return { emoji: '🧊', name: 'Polar' };
  if (absLat > 60) return { emoji: '❄️', name: 'Subarctic' };
  if (absLat > 40) return { emoji: '🍂', name: 'Temperate' };
  if (absLat > 23.5) return { emoji: '🌡️', name: 'Subtropical' };
  return { emoji: '🌴', name: 'Tropical' };
};

// Get themed gradient for each country based on their flag colors or culture
const getCountryGradient = (countryCode: string): string => {
  const gradients: { [key: string]: string } = {
    // Popular countries with themed gradients
    'PH': 'linear-gradient(135deg, rgba(0, 56, 168, 0.6) 0%, rgba(206, 17, 38, 0.6) 100%)', // Philippines: Blue & Red
    'US': 'linear-gradient(135deg, rgba(60, 59, 110, 0.6) 0%, rgba(178, 34, 52, 0.6) 100%)', // USA: Navy & Red
    'JP': 'linear-gradient(135deg, rgba(188, 0, 45, 0.6) 0%, rgba(255, 255, 255, 0.3) 100%)', // Japan: Red & White
    'FR': 'linear-gradient(135deg, rgba(0, 85, 164, 0.6) 0%, rgba(239, 65, 53, 0.6) 100%)', // France: Blue & Red
    'IT': 'linear-gradient(135deg, rgba(0, 146, 70, 0.6) 0%, rgba(206, 43, 55, 0.6) 100%)', // Italy: Green & Red
    'CN': 'linear-gradient(135deg, rgba(238, 28, 37, 0.6) 0%, rgba(255, 222, 0, 0.6) 100%)', // China: Red & Gold
    'GB': 'linear-gradient(135deg, rgba(1, 33, 105, 0.6) 0%, rgba(200, 16, 46, 0.6) 100%)', // UK: Blue & Red
    'AU': 'linear-gradient(135deg, rgba(0, 0, 139, 0.6) 0%, rgba(255, 215, 0, 0.6) 100%)', // Australia: Blue & Gold
    'BR': 'linear-gradient(135deg, rgba(0, 156, 59, 0.6) 0%, rgba(254, 223, 0, 0.6) 100%)', // Brazil: Green & Yellow
    'IN': 'linear-gradient(135deg, rgba(255, 153, 51, 0.6) 0%, rgba(19, 136, 8, 0.6) 100%)', // India: Saffron & Green
    'EG': 'linear-gradient(135deg, rgba(206, 17, 38, 0.6) 0%, rgba(255, 215, 0, 0.6) 100%)', // Egypt: Red & Gold
    'GR': 'linear-gradient(135deg, rgba(13, 94, 175, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)', // Greece: Blue & White
    'ES': 'linear-gradient(135deg, rgba(198, 11, 30, 0.6) 0%, rgba(255, 196, 0, 0.6) 100%)', // Spain: Red & Yellow
    'TH': 'linear-gradient(135deg, rgba(45, 42, 74, 0.6) 0%, rgba(166, 25, 46, 0.6) 100%)', // Thailand: Navy & Red
    'TR': 'linear-gradient(135deg, rgba(227, 10, 23, 0.6) 0%, rgba(255, 255, 255, 0.3) 100%)', // Turkey: Red & White
    'MX': 'linear-gradient(135deg, rgba(0, 104, 71, 0.6) 0%, rgba(206, 17, 38, 0.6) 100%)', // Mexico: Green & Red
    'KR': 'linear-gradient(135deg, rgba(0, 71, 160, 0.6) 0%, rgba(205, 28, 38, 0.6) 100%)', // South Korea: Blue & Red
    'CA': 'linear-gradient(135deg, rgba(255, 0, 0, 0.6) 0%, rgba(255, 255, 255, 0.3) 100%)', // Canada: Red & White
    'DE': 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(255, 206, 0, 0.6) 100%)', // Germany: Black & Gold
    'RU': 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(213, 43, 30, 0.6) 100%)', // Russia: White & Red
  };

  // Return themed gradient or default purple gradient
  return gradients[countryCode] || 'linear-gradient(135deg, rgba(147, 51, 234, 0.5) 0%, rgba(79, 70, 229, 0.5) 100%)';
};

const CountryListView: React.FC<CountryListViewProps> = ({ onSelectCountry, isVisible }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Filter countries based on search and selected continent
  const filteredCountries = useMemo(() => {
    if (searchQuery.trim()) {
      return searchCountries(searchQuery);
    }

    if (selectedContinent) {
      const continent = WORLD_COUNTRIES.find(c => c.name === selectedContinent);
      return continent ? continent.countries : [];
    }

    return [];
  }, [searchQuery, selectedContinent]);

  const handleCountryClick = (country: Country) => {
    onSelectCountry(country);
    setSearchQuery('');
    setSelectedContinent(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-30 bg-gradient-to-br from-[#1a0b2e] via-[#2e1065] to-[#4c1d95] overflow-hidden pt-20">
      {/* Header with Search */}
      <div className="sticky top-0 z-40 bg-[#1a0b2e]/95 backdrop-blur-xl border-b border-white/10 p-6 pt-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">
            🗺️ Explore Locations Worldwide
          </h1>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedContinent(null);
              }}
              placeholder="Search countries, capitals, or codes..."
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 px-5 py-3 rounded-2xl focus:outline-none focus:bg-white/20 focus:border-purple-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/50" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>

          {/* Continent Filter Pills */}
          {!searchQuery && (
            <div className="flex flex-wrap gap-2 mt-4">
              {WORLD_COUNTRIES.map((continent) => (
                <button
                  key={continent.name}
                  onClick={() => setSelectedContinent(selectedContinent === continent.name ? null : continent.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedContinent === continent.name
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {continent.emoji} {continent.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="overflow-y-auto h-[calc(100vh-280px)] px-6 py-6 pb-12">
        <div className="max-w-7xl mx-auto">

          {/* Show continents when no filter is active */}
          {!searchQuery && !selectedContinent && (
            <div className="space-y-8">
              {WORLD_COUNTRIES.map((continent) => (
                <div key={continent.name} className="animate-in fade-in duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{continent.emoji}</span>
                    <h2 className="text-2xl font-bold text-white">{continent.name}</h2>
                    <span className="text-white/40 text-sm ml-auto">{continent.countries.length} countries</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {continent.countries.map((country) => (
                      <div
                        key={country.code}
                        className="relative"
                        style={{
                          height: hoveredCountry === country.code ? '200px' : '140px',
                          transition: 'height 500ms ease-in-out'
                        }}
                      >
                        <button
                          onClick={() => handleCountryClick(country)}
                          onMouseEnter={() => setHoveredCountry(country.code)}
                          onMouseLeave={() => setHoveredCountry(null)}
                          className="absolute inset-0 border border-white/10 rounded-xl overflow-hidden transition-all duration-500 text-left shadow-lg hover:shadow-2xl hover:shadow-purple-500/40 hover:border-purple-400"
                          style={{
                            background: hoveredCountry === country.code
                              ? getCountryGradient(country.code)
                              : 'rgba(255, 255, 255, 0.05)'
                          }}
                        >
                        {/* Animated Gradient Overlay on Hover */}
                        <div
                          className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-transparent to-indigo-900/40 transition-opacity duration-500"
                          style={{
                            opacity: hoveredCountry === country.code ? 1 : 0,
                            zIndex: 1
                          }}
                        />

                        {/* Content */}
                        <div className="relative p-4 flex flex-col h-full transition-all duration-500" style={{ zIndex: 2 }}>
                          {/* Top section - Flag and Code */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className="transition-all duration-500"
                                style={{
                                  fontSize: hoveredCountry === country.code ? '2.5rem' : '1.5rem'
                                }}
                              >
                                {country.flag}
                              </span>
                              <span className="text-xs text-white/40 font-mono transition-colors duration-300">
                                {country.code}
                              </span>
                            </div>
                            {/* Time of day indicator */}
                            <div className="text-lg transition-all duration-300">
                              {getTimeBasedInfo(country.coordinates).icon}
                            </div>
                          </div>

                          {/* Country name */}
                          <div
                            className="text-white font-medium transition-all duration-500 mb-1"
                            style={{
                              fontSize: hoveredCountry === country.code ? '1.125rem' : '0.875rem',
                              fontWeight: hoveredCountry === country.code ? 700 : 500,
                              color: hoveredCountry === country.code ? 'rgb(233, 213, 255)' : 'white'
                            }}
                          >
                            {country.name}
                          </div>

                          {/* Capital with icon */}
                          {country.capital && (
                            <div className="flex items-center gap-1 mb-2">
                              <span className="text-white/30 text-xs">🏛️</span>
                              <div
                                className="text-white/50 transition-all duration-300"
                                style={{
                                  fontSize: hoveredCountry === country.code ? '0.875rem' : '0.7rem',
                                  opacity: hoveredCountry === country.code ? 1 : 0.7
                                }}
                              >
                                {country.capital}
                              </div>
                            </div>
                          )}

                          {/* Info badges - Always visible */}
                          <div className="flex flex-wrap gap-1.5 mt-auto">
                            {/* Climate zone badge */}
                            <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                              <span className="text-xs">{getClimateZone(country.coordinates.lat).emoji}</span>
                              <span className="text-white/70 text-[0.65rem] font-medium">
                                {getClimateZone(country.coordinates.lat).name}
                              </span>
                            </div>

                            {/* Time badge */}
                            <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                              <span className="text-white/70 text-[0.65rem] font-medium">
                                {getTimeBasedInfo(country.coordinates).label}
                              </span>
                            </div>
                          </div>

                          {/* Expanded content on hover */}
                          <div
                            className="transition-all duration-500 overflow-hidden"
                            style={{
                              maxHeight: hoveredCountry === country.code ? '100px' : '0px',
                              opacity: hoveredCountry === country.code ? 1 : 0,
                              marginTop: hoveredCountry === country.code ? '12px' : '0px'
                            }}
                          >
                            <div className="pt-3 border-t border-white/20 space-y-2">
                              {/* Coordinates */}
                              <div className="flex items-center gap-1.5 text-white/60 text-xs">
                                <span>📍</span>
                                <span>{country.coordinates.lat.toFixed(2)}°, {country.coordinates.lon.toFixed(2)}°</span>
                              </div>
                              {/* Click to explore */}
                              <div className="text-purple-300 text-xs font-medium flex items-center gap-1">
                                <span>✨</span>
                                <span>Click to explore weather</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Show filtered countries (search or continent filter) */}
          {(searchQuery || selectedContinent) && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-4 text-white/60">
                {filteredCountries.length} {filteredCountries.length === 1 ? 'result' : 'results'}
                {searchQuery && ` for "${searchQuery}"`}
                {selectedContinent && ` in ${selectedContinent}`}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredCountries.map((country) => (
                  <div
                    key={country.code}
                    className="relative"
                    style={{
                      height: hoveredCountry === country.code ? '200px' : '140px',
                      transition: 'height 500ms ease-in-out'
                    }}
                  >
                    <button
                      onClick={() => handleCountryClick(country)}
                      onMouseEnter={() => setHoveredCountry(country.code)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      className="absolute inset-0 border border-white/10 rounded-xl overflow-hidden transition-all duration-500 text-left shadow-lg hover:shadow-2xl hover:shadow-purple-500/40 hover:border-purple-400"
                      style={{
                        background: hoveredCountry === country.code
                          ? getCountryGradient(country.code)
                          : 'rgba(255, 255, 255, 0.05)'
                      }}
                    >
                    {/* Animated Gradient Overlay on Hover */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-transparent to-indigo-900/40 transition-opacity duration-500"
                      style={{
                        opacity: hoveredCountry === country.code ? 1 : 0,
                        zIndex: 1
                      }}
                    />

                    {/* Content */}
                    <div className="relative p-4 flex flex-col h-full transition-all duration-500" style={{ zIndex: 2 }}>
                      {/* Top section - Flag and Code */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="transition-all duration-500"
                            style={{
                              fontSize: hoveredCountry === country.code ? '2.5rem' : '1.5rem'
                            }}
                          >
                            {country.flag}
                          </span>
                          <span className="text-xs text-white/40 font-mono transition-colors duration-300">
                            {country.code}
                          </span>
                        </div>
                        {/* Time of day indicator */}
                        <div className="text-lg transition-all duration-300">
                          {getTimeBasedInfo(country.coordinates).icon}
                        </div>
                      </div>

                      {/* Country name */}
                      <div
                        className="text-white font-medium transition-all duration-500 mb-1"
                        style={{
                          fontSize: hoveredCountry === country.code ? '1.125rem' : '0.875rem',
                          fontWeight: hoveredCountry === country.code ? 700 : 500,
                          color: hoveredCountry === country.code ? 'rgb(233, 213, 255)' : 'white'
                        }}
                      >
                        {country.name}
                      </div>

                      {/* Capital with icon */}
                      {country.capital && (
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-white/30 text-xs">🏛️</span>
                          <div
                            className="text-white/50 transition-all duration-300"
                            style={{
                              fontSize: hoveredCountry === country.code ? '0.875rem' : '0.7rem',
                              opacity: hoveredCountry === country.code ? 1 : 0.7
                            }}
                          >
                            {country.capital}
                          </div>
                        </div>
                      )}

                      {/* Info badges - Always visible */}
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {/* Climate zone badge */}
                        <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                          <span className="text-xs">{getClimateZone(country.coordinates.lat).emoji}</span>
                          <span className="text-white/70 text-[0.65rem] font-medium">
                            {getClimateZone(country.coordinates.lat).name}
                          </span>
                        </div>

                        {/* Time badge */}
                        <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                          <span className="text-white/70 text-[0.65rem] font-medium">
                            {getTimeBasedInfo(country.coordinates).label}
                          </span>
                        </div>
                      </div>

                      {/* Expanded content on hover */}
                      <div
                        className="transition-all duration-500 overflow-hidden"
                        style={{
                          maxHeight: hoveredCountry === country.code ? '100px' : '0px',
                          opacity: hoveredCountry === country.code ? 1 : 0,
                          marginTop: hoveredCountry === country.code ? '12px' : '0px'
                        }}
                      >
                        <div className="pt-3 border-t border-white/20 space-y-2">
                          {/* Coordinates */}
                          <div className="flex items-center gap-1.5 text-white/60 text-xs">
                            <span>📍</span>
                            <span>{country.coordinates.lat.toFixed(2)}°, {country.coordinates.lon.toFixed(2)}°</span>
                          </div>
                          {/* Click to explore */}
                          <div className="text-purple-300 text-xs font-medium flex items-center gap-1">
                            <span>✨</span>
                            <span>Click to explore weather</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    </button>
                  </div>
                ))}
              </div>

              {filteredCountries.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <div className="text-white/60 text-lg">No countries found</div>
                  <div className="text-white/40 text-sm mt-2">Try a different search term</div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CountryListView;
