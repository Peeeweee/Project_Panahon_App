// Serverless function for getting weather by location name
// Vercel serverless function format

// Normalize location names to match geocoding API expectations
function normalizeLocationName(location) {
  const normalizations = {
    'United States of America': 'United States',
    'USA': 'United States',
    'U.S.A.': 'United States',
    'U.S.': 'United States',
    'UK': 'United Kingdom',
    'U.K.': 'United Kingdom',
    'UAE': 'United Arab Emirates',
    'Russia': 'Russian Federation',
    'South Korea': 'Korea',
    'North Korea': 'Korea',
    'Solomon Is.': 'Solomon Islands',
    'Falkland Is.': 'Falkland Islands',
    'Fr. S. Antarctic Lands': 'French Southern and Antarctic Lands',
    'N. Mariana Is.': 'Northern Mariana Islands',
    'Marshall Is.': 'Marshall Islands',
    'Cook Is.': 'Cook Islands',
    'Br. Indian Ocean Ter.': 'British Indian Ocean Territory',
    'U.S. Virgin Is.': 'United States Virgin Islands',
    'Cayman Is.': 'Cayman Islands',
    'Turks and Caicos Is.': 'Turks and Caicos Islands',
    'Br. Virgin Is.': 'British Virgin Islands',
  };
  return normalizations[location] || location;
}

// Geocoding API to convert location name to coordinates
async function geocodeLocation(location) {
  const normalizedLocation = normalizeLocationName(location);
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(normalizedLocation)}&count=1&language=en&format=json`;

  const response = await fetch(geocodingUrl);
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`Location "${location}" not found`);
  }

  const result = data.results[0];
  return {
    latitude: result.latitude,
    longitude: result.longitude,
    name: result.name,
    country: result.country,
    countryCode: result.country_code?.toUpperCase() || 'N/A',
    admin1: result.admin1 || '',
    timezone: result.timezone || 'UTC'
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

// Fetch weather data from Open-Meteo API
async function getWeatherByCoordinates(latitude, longitude, locationName, countryCode) {
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

  return {
    location: locationName,
    isoCode: countryCode,
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
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({
        error: 'Missing parameter',
        message: 'Location parameter is required'
      });
    }

    // Geocode the location
    const geoData = await geocodeLocation(location);

    // Build location string
    const locationString = geoData.admin1
      ? `${geoData.name}, ${geoData.admin1}, ${geoData.country}`
      : `${geoData.name}, ${geoData.country}`;

    // Fetch weather
    const weatherData = await getWeatherByCoordinates(
      geoData.latitude,
      geoData.longitude,
      locationString,
      geoData.countryCode
    );

    res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error fetching weather by location:', error);
    res.status(500).json({
      error: 'Failed to fetch weather data',
      message: error.message
    });
  }
}
