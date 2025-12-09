// Temperature conversion utilities

export type TemperatureUnit = 'C' | 'F';

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}

/**
 * Convert Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5/9;
}

/**
 * Parse temperature string and extract numeric value
 * Handles formats like "25°C", "77°F", "25", etc.
 */
export function parseTemperature(tempString: string): number {
  const match = tempString.match(/-?\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * Convert temperature string from one unit to another
 */
export function convertTemperature(tempString: string, fromUnit: TemperatureUnit, toUnit: TemperatureUnit): string {
  if (fromUnit === toUnit) return tempString;

  const value = parseTemperature(tempString);
  const converted = fromUnit === 'C'
    ? Math.round(celsiusToFahrenheit(value))
    : Math.round(fahrenheitToCelsius(value));

  return `${converted}°${toUnit}`;
}

/**
 * Format temperature with unit symbol
 */
export function formatTemperature(value: number, unit: TemperatureUnit): string {
  return `${Math.round(value)}°${unit}`;
}
