import { GoogleGenAI } from "@google/genai";
import { WeatherResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getWeather = async (location: string): Promise<WeatherResult> => {
  try {
    const modelId = "gemini-2.5-flash"; // Efficient for search tasks
    
    // We use the googleSearch tool because typical LLMs have knowledge cutoffs.
    // Weather requires real-time data.
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `What is the current weather in ${location}? 
      
      Return the response in this specific format:
      Location: [City/Country Name]
      ISO: [3-Letter Country/Region ISO Code, e.g. USA, PHL, JPN]
      Temperature: [Temp in Celsius/Fahrenheit, e.g. 27°C (80°F)]
      Condition: [Short condition, e.g. Partly Cloudy, Light Rain]
      Humidity: [Humidity %]
      Wind: [Wind Speed]
      Description: [A short, witty, or poetic description of the vibe in 1-2 sentences. Make it atmospheric.]
      `,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const text = response.text || "";
    
    // Simple parsing of the structured text response
    const extract = (key: string) => {
      const regex = new RegExp(`${key}:\\s*(.*)`, "i");
      const match = text.match(regex);
      return match ? match[1].trim() : "N/A";
    };

    // Extract grounding sources
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk) => ({
        title: chunk.web?.title || "Source",
        uri: chunk.web?.uri || "#",
      }))
      .filter((s) => s.uri !== "#") || [];

    // Deduplicate sources
    const uniqueSources = Array.from(
      new Map<string, { title: string; uri: string }>(
        sources.map((item) => [item.uri, item])
      ).values()
    ).slice(0, 3);

    const rawIso = extract("ISO");
    // Fallback if ISO extraction fails
    const isoCode = rawIso !== "N/A" && rawIso.length <= 4 ? rawIso : location.substring(0, 3).toUpperCase();

    return {
      location: extract("Location") !== "N/A" ? extract("Location") : location,
      isoCode: isoCode,
      temperature: extract("Temperature"),
      condition: extract("Condition"),
      humidity: extract("Humidity"),
      wind: extract("Wind"),
      description: extract("Description"),
      sources: uniqueSources,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch weather data. Please try again.");
  }
};