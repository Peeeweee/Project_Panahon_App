import React, { useState, useEffect } from 'react';
import { TemperatureUnit, convertTemperature } from '../utils/temperatureUtils';

interface ForecastDay {
  date: string;
  tempMax: string;
  tempMin: string;
  condition: string;
  precipitationChance: string;
  windSpeed: string;
}

interface ForecastData {
  location: string;
  isoCode: string;
  timezone: string;
  forecast: ForecastDay[];
}

interface GlobalCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
  flag: string;
}

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation?: { lat: number; lon: number; name: string };
  temperatureUnit: TemperatureUnit;
}

const Dashboard: React.FC<DashboardProps> = ({ isOpen, onClose, userLocation, temperatureUnit }) => {
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [globalWeather, setGlobalWeather] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'forecast' | 'global'>('forecast');

  // Major cities around the world for global weather
  const globalCities: GlobalCity[] = [
    { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060, flag: '🇺🇸' },
    { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278, flag: '🇬🇧' },
    { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, flag: '🇯🇵' },
    { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, flag: '🇫🇷' },
    { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, flag: '🇦🇺' },
    { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, flag: '🇦🇪' },
    { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, flag: '🇸🇬' },
    { name: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777, flag: '🇮🇳' },
  ];

  // Fetch 7-day forecast for user's location
  useEffect(() => {
    if (isOpen && userLocation && activeTab === 'forecast') {
      setLoading(true);
      fetch(`http://localhost:3001/api/weather/forecast/coordinates?lat=${userLocation.lat}&lon=${userLocation.lon}`)
        .then(res => res.json())
        .then(data => {
          setForecastData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching forecast:', err);
          setLoading(false);
        });
    }
  }, [isOpen, userLocation, activeTab]);

  // Fetch global weather
  useEffect(() => {
    if (isOpen && activeTab === 'global') {
      setLoading(true);
      Promise.all(
        globalCities.map(city =>
          fetch(`http://localhost:3001/api/weather/coordinates?lat=${city.lat}&lon=${city.lon}`)
            .then(res => res.json())
            .then(data => ({ ...data, flag: city.flag, name: city.name, country: city.country }))
        )
      ).then(results => {
        setGlobalWeather(results);
        setLoading(false);
      }).catch(err => {
        console.error('Error fetching global weather:', err);
        setLoading(false);
      });
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-[#1a0b2e] to-[#2e1065] rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10">

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Weather Dashboard</h2>
            <p className="text-white/60 text-sm mt-1">
              {activeTab === 'forecast' ? '7-Day Forecast' : 'Global Weather Updates'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-all text-white/60 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('forecast')}
            className={`flex-1 px-6 py-4 font-medium transition-all ${
              activeTab === 'forecast'
                ? 'text-white bg-white/5 border-b-2 border-purple-500'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            📅 7-Day Forecast
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`flex-1 px-6 py-4 font-medium transition-all ${
              activeTab === 'global'
                ? 'text-white bg-white/5 border-b-2 border-purple-500'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            🌍 Global Weather
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {/* 7-Day Forecast Tab */}
          {activeTab === 'forecast' && !loading && forecastData && (
            <div className="space-y-3">
              <div className="text-white/80 text-sm mb-4">
                📍 {forecastData.location}
              </div>
              {forecastData.forecast.map((day, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-4 hover:bg-white/10 transition-all border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-white/60 text-xs">
                          {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-white/40 text-xs">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="text-3xl">{getWeatherEmoji(day.condition)}</div>
                      <div>
                        <div className="text-white font-medium">{day.condition}</div>
                        <div className="text-white/60 text-sm flex items-center gap-2">
                          <span>💧 {day.precipitationChance}</span>
                          <span>💨 {day.windSpeed}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{convertTemperature(day.tempMax, 'C', temperatureUnit)}</div>
                      <div className="text-white/60 text-sm">{convertTemperature(day.tempMin, 'C', temperatureUnit)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Global Weather Tab */}
          {activeTab === 'global' && !loading && globalWeather.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {globalWeather.map((city, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-4 hover:bg-white/10 transition-all border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{city.flag}</span>
                      <div>
                        <div className="text-white font-medium">{city.name}</div>
                        <div className="text-white/60 text-sm">{city.country}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">{convertTemperature(city.temperature, 'C', temperatureUnit)}</div>
                      <div className="text-white/60 text-sm">{city.condition}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-4 text-xs text-white/60">
                    <span>💧 {city.humidity}</span>
                    <span>💨 {city.wind}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && activeTab === 'forecast' && !forecastData && (
            <div className="text-center py-12 text-white/60">
              <p>📍 Use your current location or select a location to see the 7-day forecast</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get weather emoji
const getWeatherEmoji = (condition: string): string => {
  const emojiMap: { [key: string]: string } = {
    'Clear': '☀️',
    'Mainly Clear': '🌤️',
    'Partly Cloudy': '⛅',
    'Cloudy': '☁️',
    'Foggy': '🌫️',
    'Light Drizzle': '🌦️',
    'Drizzle': '🌧️',
    'Heavy Drizzle': '🌧️',
    'Light Rain': '🌦️',
    'Rain': '🌧️',
    'Heavy Rain': '⛈️',
    'Light Snow': '🌨️',
    'Snow': '❄️',
    'Heavy Snow': '❄️',
    'Thunderstorm': '⛈️',
  };

  return emojiMap[condition] || '🌡️';
};

export default Dashboard;
