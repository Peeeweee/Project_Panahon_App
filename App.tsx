
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WorldMap from './components/WorldMap';
import WeatherCard from './components/WeatherCard';
import CountryTransition from './components/CountryTransition';
import Favorites from './components/Favorites';
import Dashboard from './components/Dashboard';
import CountryListView from './components/CountryListView';
import { getWeather, getWeatherByCoordinates } from './services/weatherService';
import { WeatherResult, TransitionData, FavoriteLocation } from './types';
import { TemperatureUnit } from './utils/temperatureUtils';
import { Country } from './data/countries';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Animation State
  const [transitionData, setTransitionData] = useState<TransitionData | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  // Dashboard State
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number; name: string } | undefined>(undefined);

  // Favorites State
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);

  // Temperature Unit State
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('C');

  // View Mode State (Map or List)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Load favorites and temperature unit from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('panahon_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    }

    const savedUnit = localStorage.getItem('panahon_temperature_unit');
    if (savedUnit === 'C' || savedUnit === 'F') {
      setTemperatureUnit(savedUnit);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('panahon_favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  // Save temperature unit to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('panahon_temperature_unit', temperatureUnit);
  }, [temperatureUnit]);

  const handleStart = () => {
    setHasStarted(true);
  };

  const resetState = () => {
    setWeatherData(null);
    setTransitionData(null);
    setError(null);
    setIsExiting(false);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    resetState();
    // Close search bar on mobile or desktop after search to show map/card better
    setIsSearchOpen(false);

    try {
      const data = await getWeather(query);
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleRegionClick = (regionName: string, pathData: string, rect: DOMRect) => {
    // Only allow clicking if we have started
    if (!hasStarted) return;
    
    // Start Transition Animation
    setTransitionData({ path: pathData, initialRect: rect });

    setQuery(regionName);
    setLoading(true);
    setError(null);
    setWeatherData(null);
    setIsExiting(false);

    getWeather(regionName)
      .then(data => {
        // Minimal delay to ensure animation has time to look cool before data pops in
        setTimeout(() => {
          setWeatherData(data);
        }, 800);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleCloseCard = () => {
    // Trigger exit animation
    setIsExiting(true);

    // Wait for animation to complete before removing data from DOM
    setTimeout(() => {
        setWeatherData(null);
        setTransitionData(null);
        setQuery(''); // Clear the query to truly reset
        setError(null);
        setIsExiting(false);
    }, 1000); // Match animation duration in CountryTransition
  };

  const handleDismissError = () => {
    // Reset everything immediately
    setError(null);
    setWeatherData(null);
    setTransitionData(null);
    setQuery('');
    setLoading(false);
    setIsExiting(false);
  };

  // Current Location Handler
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const data = await getWeatherByCoordinates(latitude, longitude);
          setWeatherData(data);
          // Save user location for dashboard
          setUserLocation({ lat: latitude, lon: longitude, name: data.location });
        } catch (err: any) {
          setError(err.message || 'Failed to fetch weather for your location');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        setError('Unable to retrieve your location. Please check permissions.');
        console.error('Geolocation error:', error);
      }
    );
  };

  // Dashboard Handler
  const handleToggleDashboard = () => {
    setIsDashboardOpen(!isDashboardOpen);
  };

  // Temperature Unit Toggle Handler
  const handleToggleTemperatureUnit = () => {
    setTemperatureUnit((prevUnit: TemperatureUnit) => prevUnit === 'C' ? 'F' : 'C');
  };

  // View Mode Toggle Handler
  const handleToggleView = () => {
    setViewMode((prevMode) => prevMode === 'map' ? 'list' : 'map');
  };

  // Country Selection Handler (from List View)
  const handleSelectCountry = async (country: Country) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);
    setIsExiting(false);

    try {
      const data = await getWeatherByCoordinates(country.coordinates.lat, country.coordinates.lon);
      setWeatherData(data);
      setUserLocation({ lat: country.coordinates.lat, lon: country.coordinates.lon, name: data.location });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  // Share Weather Handler
  const handleShareWeather = async () => {
    if (!weatherData) return;

    const shareText = `🌤️ Weather in ${weatherData.location}\n${weatherData.temperature} - ${weatherData.condition}\n💧 Humidity: ${weatherData.humidity}\n💨 Wind: ${weatherData.wind}\n\nVia Panahon Weather App`;
    const shareUrl = window.location.href;

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Weather in ${weatherData.location}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        // Show a temporary success message
        setError('Weather info copied to clipboard! ✓');
        setTimeout(() => setError(null), 2000);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        setError('Unable to share. Please try again.');
      }
    }
  };

  // Favorites Handlers
  const addToFavorites = () => {
    if (!weatherData) return;

    const newFavorite: FavoriteLocation = {
      name: weatherData.location,
      isoCode: weatherData.isoCode,
      timestamp: Date.now(),
    };

    // Check if already in favorites
    const exists = favorites.some(fav => fav.name === newFavorite.name);
    if (!exists) {
      setFavorites([...favorites, newFavorite]);
    }
  };

  const removeFromFavorites = (name: string) => {
    setFavorites(favorites.filter(fav => fav.name !== name));
  };

  const handleSelectFavorite = async (name: string) => {
    setLoading(true);
    setError(null);
    setQuery(name);

    try {
      const data = await getWeather(name);
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = weatherData ? favorites.some(fav => fav.name === weatherData.location) : false;

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-[#1a0b2e] via-[#2e1065] to-[#4c1d95] overflow-hidden font-sans">
      
      {/* Background Map Layer */}
      {/* Dim the map when a country is selected to emphasize the transition */}
      <div className={`absolute inset-0 transition-all duration-1000 ${hasStarted ? 'opacity-100' : 'opacity-40'} ${transitionData && !isExiting ? 'brightness-50 blur-[2px] scale-105' : 'scale-100'}`}>
         <WorldMap
           onRegionClick={!weatherData && !loading && !transitionData ? handleRegionClick : undefined}
         />
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-transparent to-[#1a0b2e]/80 pointer-events-none z-10 transition-opacity duration-1000 ${hasStarted ? 'opacity-0' : 'opacity-100'}`}></div>
      
      {/* Radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(26,11,46,0.5)_100%)] pointer-events-none z-10"></div>

      {/* --- ANIMATED ELEMENTS --- */}

      {/* 1. Logo Icon Transition */}
      <div 
        className={`fixed z-50 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)
          ${hasStarted 
            ? 'top-6 left-6 w-10 h-10' 
            : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100px] w-24 h-24'
          }
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`${hasStarted ? 'h-6 w-6' : 'h-12 w-12'} text-white transition-all duration-1000`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      </div>

      {/* 2. Title Text Transition */}
      <div 
        className={`fixed z-50 font-bold text-white tracking-tight transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) whitespace-nowrap
          ${hasStarted 
            ? 'top-7 left-20 text-2xl translate-y-0 translate-x-0' 
            : 'top-1/2 left-1/2 -translate-x-1/2 translate-y-4 text-5xl md:text-6xl'
          }
        `}
      >
        Panahon
      </div>

      {/* 3. Subtitle (Fades out) */}
      <div 
        className={`fixed z-40 text-purple-200 text-lg font-light transition-all duration-700 delay-100
          ${hasStarted 
            ? 'opacity-0 top-6 left-20 pointer-events-none' 
            : 'opacity-100 top-1/2 left-1/2 -translate-x-1/2 translate-y-20'
          }
        `}
      >
        Where in the world are we going today?
      </div>

      {/* 4. Continue Button (Fades out) */}
      <div 
        className={`fixed z-50 transition-all duration-500 delay-0
          ${hasStarted 
            ? 'opacity-0 scale-90 pointer-events-none top-1/2 left-1/2 -translate-x-1/2 translate-y-32' 
            : 'opacity-100 scale-100 top-1/2 left-1/2 -translate-x-1/2 translate-y-32'
          }
        `}
      >
        <button 
          onClick={handleStart}
          className="group relative px-8 py-3 bg-white text-[#1a0b2e] font-semibold rounded-full overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-shadow duration-300"
        >
          <span className="relative z-10 flex items-center gap-2">
            Continue
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>

      {/* --- MAIN CONTENT LAYER --- */}
      
      {/* Search Overlay (Only visible when started and toggled) */}
      <div className={`fixed top-20 right-6 z-40 transition-all duration-500 origin-top-right ${hasStarted && isSearchOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        <form onSubmit={handleSearch} className="flex shadow-2xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city..."
              className="bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 px-4 py-2 rounded-l-xl focus:outline-none focus:bg-white/20 w-64"
              autoFocus={isSearchOpen}
            />
            <button type="submit" className="bg-purple-600/80 hover:bg-purple-600 backdrop-blur-xl text-white px-4 rounded-r-xl border-y border-r border-white/20">
              Go
            </button>
        </form>
      </div>

      <Header
        showControls={hasStarted}
        onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
        isSearchOpen={isSearchOpen}
        onCurrentLocation={handleCurrentLocation}
        onToggleDashboard={handleToggleDashboard}
        temperatureUnit={temperatureUnit}
        onToggleTemperatureUnit={handleToggleTemperatureUnit}
        viewMode={viewMode}
        onToggleView={handleToggleView}
      />

      {/* Country List View */}
      <CountryListView
        isVisible={hasStarted && viewMode === 'list' && !weatherData && !loading}
        onSelectCountry={handleSelectCountry}
      />

      {/* Dashboard Modal */}
      <Dashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        userLocation={userLocation}
        temperatureUnit={temperatureUnit}
      />

      {/* Transition Overlay */}
      {transitionData && <CountryTransition data={transitionData} isExiting={isExiting} />}

      {/* Main Container for Cards */}
      <main className="fixed inset-0 z-40 pointer-events-none flex flex-col items-center justify-center p-4">
        
        {/* Loading Indicator */}
        {loading && !weatherData && (
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-full animate-pulse transition-opacity duration-500">
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {/* Results Card */}
        {weatherData && (
          <div className="pointer-events-auto perspective-1000 w-full flex justify-center">
             <WeatherCard
                data={weatherData}
                onClose={handleCloseCard}
                isExiting={isExiting}
                onToggleFavorite={addToFavorites}
                isFavorite={isFavorite}
                temperatureUnit={temperatureUnit}
                onShare={handleShareWeather}
             />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 pointer-events-auto bg-red-500/20 backdrop-blur-md border border-red-500/40 text-red-200 px-6 py-4 rounded-xl max-w-md text-center animate-in fade-in duration-300">
            <p>{error}</p>
            <button onClick={handleDismissError} className="text-sm underline mt-2 hover:text-white">Dismiss</button>
          </div>
        )}

      </main>

      {/* Favorites Bar */}
      <Favorites
        favorites={favorites}
        onSelectFavorite={handleSelectFavorite}
        onRemoveFavorite={removeFromFavorites}
        isVisible={hasStarted && viewMode === 'map' && !weatherData && !loading}
      />
    </div>
  );
};

export default App;
