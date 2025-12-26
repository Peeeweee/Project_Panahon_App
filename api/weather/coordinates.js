// Serverless function for getting weather by coordinates
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
        countryCode: data.countryCode || 'N/A',
        admin1: region || '',
        timezone: 'UTC'
      };
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
  }

  return {
    name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
    country: 'Unknown',
    countryCode: 'N/A',
    admin1: '',
    timezone: 'UTC'
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

// Generate weather description based on conditions
function generateDescription(condition, temp, humidity, windSpeed) {
  const tempC = Math.round(temp);
  const descriptions = {
    'Clear': `A beautiful clear day with ${tempC}°C. Perfect weather for outdoor activities.`,
    'Mainly Clear': `Mostly clear skies with ${tempC}°C. A pleasant day ahead.`,
    'Partly Cloudy': `Partly cloudy with ${tempC}°C. A nice mix of sun and clouds.`,
    'Cloudy': `Overcast conditions with ${tempC}°C. The sky is covered with clouds.`,
    'Foggy': `Foggy conditions reducing visibility, temperature at ${tempC}°C.`,
    'Light Rain': `Light rain falling, ${tempC}°C. Don't forget your umbrella.`,
    'Rain': `Rainy weather at ${tempC}°C. Stay dry out there!`,
    'Heavy Rain': `Heavy rainfall at ${tempC}°C. Better stay indoors.`,
    'Light Snow': `Light snow falling, ${tempC}°C. A gentle winter scene.`,
    'Snow': `Snowy conditions at ${tempC}°C. Winter wonderland outside.`,
    'Heavy Snow': `Heavy snowfall at ${tempC}°C. Conditions may be hazardous.`,
    'Thunderstorm': `Thunderstorm activity with ${tempC}°C. Seek shelter immediately.`,
  };
  return descriptions[condition] || `Current conditions: ${condition} at ${tempC}°C with ${humidity}% humidity and ${windSpeed} km/h winds.`;
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

    // Fetch weather from Open-Meteo API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;

    const response = await fetch(weatherUrl);
    const data = await response.json();

    if (!data.current) {
      throw new Error('Weather data not available');
    }

    const current = data.current;
    const condition = getWeatherCondition(current.weather_code);
    const temp = current.temperature_2m;
    const humidity = current.relative_humidity_2m;
    const windSpeed = current.wind_speed_10m;

    const weatherData = {
      location: geoData.name,
      isoCode: geoData.countryCode,
      temperature: `${Math.round(temp)}°C`,
      condition: condition,
      humidity: `${humidity}%`,
      wind: `${Math.round(windSpeed)} km/h`,
      description: generateDescription(condition, temp, humidity, windSpeed),
      coordinates: {
        lat: latitude,
        lon: longitude
      },
      sources: [
        {
          title: 'Open-Meteo Weather API',
          uri: 'https://open-meteo.com'
        }
      ],
      timestamp: current.time,
      timezone: data.timezone
    };

    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    res.status(500).json({
      error: 'Failed to fetch weather data',
      message: error.message
    });
  }
}
