// Serverless function for getting 7-day forecast by coordinates
// Vercel serverless function format

// Reverse Geocoding API to convert coordinates to location name
async function reverseGeocode(latitude, longitude) {
  const reverseGeoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

  try {
    const response = await fetch(reverseGeoUrl);
    const data = await response.json();

    if (data) {
      const cleanCountry = (data.countryName || 'Unknown').replace(/\s*\(the\)\s*/gi, '').trim();

      const parts = [];
      const city = data.city || data.locality;
      const region = data.principalSubdivision;

      if (city) parts.push(city);

      if (region && region !== city && !city?.includes(region)) {
        parts.push(region);
      }

      if (parts.length > 0 && cleanCountry !== 'Unknown') {
        parts.push(cleanCountry);
      }

      return {
        name: parts.length > 0 ? parts.join(', ') : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        country: cleanCountry,
        countryCode: data.countryCode || 'N/A'
      };
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
  }

  return {
    name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
    country: 'Unknown',
    countryCode: 'N/A'
  };
}

// Weather condition code mapping (WMO Weather interpretation codes)
function getWeatherCondition(weatherCode) {
  const conditions = {
    0: 'Clear',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Cloudy',
    45: 'Foggy',
    48: 'Foggy',
    51: 'Light Drizzle',
    53: 'Drizzle',
    55: 'Heavy Drizzle',
    56: 'Light Freezing Drizzle',
    57: 'Freezing Drizzle',
    61: 'Light Rain',
    63: 'Rain',
    65: 'Heavy Rain',
    66: 'Light Freezing Rain',
    67: 'Freezing Rain',
    71: 'Light Snow',
    73: 'Snow',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Light Showers',
    81: 'Showers',
    82: 'Heavy Showers',
    85: 'Light Snow Showers',
    86: 'Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
    99: 'Thunderstorm with Heavy Hail'
  };
  return conditions[weatherCode] || 'Unknown';
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'Latitude (lat) and longitude (lon) are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    // Reverse geocode to get location name
    const geoData = await reverseGeocode(latitude, longitude);

    // Fetch 7-day forecast from Open-Meteo API
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,wind_speed_10m_max&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;

    const response = await fetch(forecastUrl);
    const data = await response.json();

    if (!data.daily) {
      throw new Error('Forecast data not available');
    }

    const daily = data.daily;
    const forecast = [];

    for (let i = 0; i < 7; i++) {
      forecast.push({
        date: daily.time[i],
        tempMax: `${Math.round(daily.temperature_2m_max[i])}°C`,
        tempMin: `${Math.round(daily.temperature_2m_min[i])}°C`,
        condition: getWeatherCondition(daily.weather_code[i]),
        precipitationChance: `${daily.precipitation_probability_max[i] || 0}%`,
        windSpeed: `${Math.round(daily.wind_speed_10m_max[i])} km/h`
      });
    }

    const forecastData = {
      location: geoData.name,
      isoCode: geoData.countryCode,
      timezone: data.timezone,
      forecast: forecast
    };

    res.status(200).json(forecastData);
  } catch (error) {
    console.error('Error fetching forecast by coordinates:', error);
    res.status(500).json({
      error: 'Failed to fetch forecast data',
      message: error.message
    });
  }
}
