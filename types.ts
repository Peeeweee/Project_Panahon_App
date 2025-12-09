export interface WeatherResult {
  location: string;
  isoCode: string;
  temperature: string;
  condition: string;
  description: string;
  humidity: string;
  wind: string;
  sources: Array<{ title: string; uri: string }>;
}

export interface GeoJSONFeature {
  type: "Feature";
  properties: {
    name: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

export interface TransitionData {
  path: string;
  initialRect: DOMRect;
  color?: string;
}

export interface WorldMapProps {
  onRegionClick?: (regionName: string, pathData: string, rect: DOMRect) => void;
}

export interface FavoriteLocation {
  name: string;
  isoCode: string;
  timestamp: number;
}