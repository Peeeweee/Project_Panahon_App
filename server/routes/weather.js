import express from 'express';
import { getWeatherByLocation, getWeatherByCoordinates, get7DayForecast } from '../services/weatherService.js';

const router = express.Router();

// Get weather by location name (city, country, etc.)
router.get('/location/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const weatherData = await getWeatherByLocation(location);
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather by location:', error);
    res.status(500).json({
      error: 'Failed to fetch weather data',
      message: error.message
    });
  }
});

// Get weather by coordinates (lat, lon)
router.get('/coordinates', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'Latitude (lat) and longitude (lon) are required'
      });
    }

    const weatherData = await getWeatherByCoordinates(parseFloat(lat), parseFloat(lon));
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    res.status(500).json({
      error: 'Failed to fetch weather data',
      message: error.message
    });
  }
});

// Get 7-day forecast by coordinates
router.get('/forecast/coordinates', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'Latitude (lat) and longitude (lon) are required'
      });
    }

    const forecastData = await get7DayForecast(parseFloat(lat), parseFloat(lon));
    res.json(forecastData);
  } catch (error) {
    console.error('Error fetching forecast by coordinates:', error);
    res.status(500).json({
      error: 'Failed to fetch forecast data',
      message: error.message
    });
  }
});

export default router;
