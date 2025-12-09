import { WeatherResult } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const getWeather = async (location: string): Promise<WeatherResult> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/weather/location/${encodeURIComponent(location)}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch weather data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Weather API Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch weather data. Please try again."
    );
  }
};

export const getWeatherByCoordinates = async (
  lat: number,
  lon: number
): Promise<WeatherResult> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/weather/coordinates?lat=${lat}&lon=${lon}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch weather data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Weather API Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch weather data. Please try again."
    );
  }
};
