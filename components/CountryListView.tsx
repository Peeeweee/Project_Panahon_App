import React, { useState, useMemo } from 'react';
import { WORLD_COUNTRIES, Country, searchCountries } from '../data/countries';

interface CountryListViewProps {
  onSelectCountry: (country: Country) => void;
  isVisible: boolean;
}

const CountryListView: React.FC<CountryListViewProps> = ({ onSelectCountry, isVisible }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

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

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {continent.countries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => handleCountryClick(country)}
                        className="group bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 hover:border-purple-400/50 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 text-left"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{country.flag}</span>
                          <span className="text-xs text-white/40 font-mono">{country.code}</span>
                        </div>
                        <div className="text-white font-medium text-sm group-hover:text-purple-200 transition-colors">
                          {country.name}
                        </div>
                        {country.capital && (
                          <div className="text-white/50 text-xs mt-1">
                            {country.capital}
                          </div>
                        )}
                      </button>
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

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountryClick(country)}
                    className="group bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 hover:border-purple-400/50 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{country.flag}</span>
                      <span className="text-xs text-white/40 font-mono">{country.code}</span>
                    </div>
                    <div className="text-white font-medium text-sm group-hover:text-purple-200 transition-colors">
                      {country.name}
                    </div>
                    {country.capital && (
                      <div className="text-white/50 text-xs mt-1">
                        {country.capital}
                      </div>
                    )}
                  </button>
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
