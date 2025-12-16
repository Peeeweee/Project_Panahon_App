
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import WorldMapView from './components/WorldMapView';
import ListViewPage from './components/ListViewPage';
import Dashboard from './components/Dashboard';
import WeatherBackground from './components/WeatherBackground';
import { getWeather, getWeatherByCoordinates } from './services/weatherService';
import { WeatherResult } from './types';
import { TemperatureUnit } from './utils/temperatureUtils';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dashboard State
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number; name: string } | undefined>(undefined);

  // Temperature Unit State
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('C');

  // View Mode State (Map or List)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Load temperature unit from localStorage on mount
  useEffect(() => {
    const savedUnit = localStorage.getItem('panahon_temperature_unit');
    if (savedUnit === 'C' || savedUnit === 'F') {
      setTemperatureUnit(savedUnit);
    }
  }, []);

  // Save temperature unit to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('panahon_temperature_unit', temperatureUnit);
  }, [temperatureUnit]);

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setWeatherData(null);
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

  // Determine weather type for background effects
  const weatherType = useMemo(() => {
    if (!weatherData) return null;
    const c = weatherData.condition.toLowerCase();
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return 'rain';
    if (c.includes('cloud') || c.includes('overcast') || c.includes('fog') || c.includes('mist')) return 'cloudy';
    if (c.includes('snow') || c.includes('ice') || c.includes('blizzard')) return 'snow';
    if (c.includes('storm') || c.includes('thunder')) return 'storm';
    return 'clear';
  }, [weatherData]);

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-[#1a0b2e] via-[#2e1065] to-[#4c1d95] overflow-hidden font-sans">

      {/* Full-Screen Weather Background Animation */}
      {weatherType && weatherData && (
        <div className="absolute inset-0 z-5 transition-opacity duration-1000">
          <WeatherBackground weatherType={weatherType} isFullScreen={true} />
        </div>
      )}

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

      {/* World Map View */}
      <WorldMapView
        isVisible={hasStarted && viewMode === 'map'}
        temperatureUnit={temperatureUnit}
        isSearchOpen={isSearchOpen}
      />

      {/* List View Page */}
      <ListViewPage
        isVisible={hasStarted && viewMode === 'list'}
        temperatureUnit={temperatureUnit}
      />

      {/* Dashboard Modal */}
      <Dashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        userLocation={userLocation}
        temperatureUnit={temperatureUnit}
      />
    </div>
  );
};

export default App;
