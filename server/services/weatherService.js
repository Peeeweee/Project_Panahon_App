import fetch from 'node-fetch';

// Normalize location names to match geocoding API expectations
function normalizeLocationName(location) {
  const normalizations = {
    // Countries
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

    // Islands and Territories (abbreviated in map)
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
  // Normalize the location name first
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

// Reverse Geocoding API to convert coordinates to location name
async function reverseGeocode(latitude, longitude) {
  // Use BigDataCloud's free reverse geocoding API (no API key required)
  const reverseGeoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

  try {
    const response = await fetch(reverseGeoUrl);
    const data = await response.json();

    if (data) {
      // Clean country name - remove "(the)" suffix
      const cleanCountry = (data.countryName || 'Unknown').replace(/\s*\(the\)\s*/gi, '').trim();

      // Build location string with available data, avoiding duplicates
      const parts = [];
      const city = data.city || data.locality;
      const region = data.principalSubdivision;

      if (city) parts.push(city);

      // Only add region if it's different from city
      if (region && region !== city && !city?.includes(region)) {
        parts.push(region);
      }

      // Only add country if we have a city or region
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

  // Final fallback: return coordinates as name
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

// Fetch weather data from Open-Meteo API
export async function getWeatherByCoordinates(latitude, longitude, locationName = null, countryCode = null) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;

  const response = await fetch(weatherUrl);
  const data = await response.json();

  if (!data.current) {
    throw new Error('Weather data not available');
  }

  // If no location name provided, reverse geocode the coordinates
  let finalLocationName = locationName;
  let finalCountryCode = countryCode;

  if (!locationName) {
    const geoData = await reverseGeocode(latitude, longitude);
    // Use the pre-formatted name from reverseGeocode (already includes city, region, country)
    finalLocationName = geoData.name;
    finalCountryCode = geoData.countryCode;
  }

  const current = data.current;
  const condition = getWeatherCondition(current.weather_code);
  const temp = current.temperature_2m;
  const humidity = current.relative_humidity_2m;
  const windSpeed = current.wind_speed_10m;

  return {
    location: finalLocationName,
    isoCode: finalCountryCode,
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

// Fetch weather by location name
export async function getWeatherByLocation(location) {
  // First, geocode the location
  const geoData = await geocodeLocation(location);

  // Then fetch weather for those coordinates
  const locationString = geoData.admin1
    ? `${geoData.name}, ${geoData.admin1}, ${geoData.country}`
    : `${geoData.name}, ${geoData.country}`;

  return await getWeatherByCoordinates(
    geoData.latitude,
    geoData.longitude,
    locationString,
    geoData.countryCode
  );
}

// Fetch 7-day forecast
export async function get7DayForecast(latitude, longitude, locationName = null, countryCode = null) {
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,wind_speed_10m_max&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;

  const response = await fetch(forecastUrl);
  const data = await response.json();

  if (!data.daily) {
    throw new Error('Forecast data not available');
  }

  // If no location name provided, reverse geocode the coordinates
  let finalLocationName = locationName;
  let finalCountryCode = countryCode;

  if (!locationName) {
    const geoData = await reverseGeocode(latitude, longitude);
    finalLocationName = geoData.name;
    finalCountryCode = geoData.countryCode;
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

  return {
    location: finalLocationName,
    isoCode: finalCountryCode,
    timezone: data.timezone,
    forecast: forecast
  };
}
