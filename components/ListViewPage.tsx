import React, { useState, useEffect } from 'react';
import CountryListView from './CountryListView';
import WeatherCard from './WeatherCard';
import { getWeatherByCoordinates } from '../services/weatherService';
import { WeatherResult, FavoriteLocation } from '../types';
import { TemperatureUnit } from '../utils/temperatureUtils';
import { Country } from '../data/countries';
import { City } from '../data/cities';

interface ListViewPageProps {
  isVisible: boolean;
  temperatureUnit: TemperatureUnit;
}

const ListViewPage: React.FC<ListViewPageProps> = ({
  isVisible,
  temperatureUnit,
}) => {
  const [weatherData, setWeatherData] = useState<WeatherResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  // Favorites State
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('panahon_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('panahon_favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  // Country Selection Handler
  const handleSelectCountry = async (country: Country) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);
    setIsExiting(false);

    try {
      const data = await getWeatherByCoordinates(country.coordinates.lat, country.coordinates.lon);
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCard = () => {
    setIsExiting(true);

    setTimeout(() => {
      setWeatherData(null);
      setError(null);
      setIsExiting(false);
    }, 1000);
  };

  const handleDismissError = () => {
    setError(null);
    setWeatherData(null);
    setLoading(false);
    setIsExiting(false);
  };

  // Share Weather Handler
  const handleShareWeather = async () => {
    if (!weatherData) return;

    const shareText = `🌤️ Weather in ${weatherData.location}\n${weatherData.temperature} - ${weatherData.condition}\n💧 Humidity: ${weatherData.humidity}\n💨 Wind: ${weatherData.wind}\n\nVia Panahon Weather App`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Weather in ${weatherData.location}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
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

    const exists = favorites.some(fav => fav.name === newFavorite.name);
    if (!exists) {
      setFavorites([...favorites, newFavorite]);
    }
  };

  const isFavorite = weatherData ? favorites.some(fav => fav.name === weatherData.location) : false;

  // Handle City Click
  const handleCityClick = async (city: City) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByCoordinates(city.lat, city.lon);
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch city weather');
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-30">
      {/* Country List View */}
      <CountryListView
        isVisible={!weatherData && !loading}
        onSelectCountry={handleSelectCountry}
      />

      {/* Loading Indicator Overlay */}
      {loading && !weatherData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-full animate-pulse">
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      )}

      {/* Weather Card Overlay */}
      {weatherData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="pointer-events-auto perspective-1000 w-full flex justify-center">
            <WeatherCard
              data={weatherData}
              onClose={handleCloseCard}
              isExiting={isExiting}
              onToggleFavorite={addToFavorites}
              isFavorite={isFavorite}
              temperatureUnit={temperatureUnit}
              onShare={handleShareWeather}
              initialPosition={undefined}
              countryPath={undefined}
              countryRect={undefined}
              onCityClick={handleCityClick}
              viewMode="list"
            />
          </div>
        </div>
      )}

      {/* Error Message Overlay */}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="pointer-events-auto bg-red-500/20 backdrop-blur-md border border-red-500/40 text-red-200 px-6 py-4 rounded-xl max-w-md text-center animate-in fade-in duration-300">
            <p>{error}</p>
            <button onClick={handleDismissError} className="text-sm underline mt-2 hover:text-white">Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListViewPage;
