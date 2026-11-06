export type TrailDifficulty = 'Facile' | 'Modéré' | 'Difficile' | 'Expert';

export type TrailType = 'Boucle' | 'Aller-retour' | 'Point à point';

export interface ElevationPoint {
  km: number;
  altitude: number;
}

export interface TrailWeather {
  temp: number;
  condition: 'Ensoleillé' | 'Nuageux' | 'Pluvieux' | 'Brouillard' | 'Orageux';
  windKmH: number;
  uvIndex: number;
  humidity: number;
  advice: string;
}

export interface Trail {
  id: string;
  title: string;
  subtitle: string;
  region: string;
  location: string;
  difficulty: TrailDifficulty;
  distanceKm: number;
  duration: string;
  durationMinutes: number;
  elevationGainM: number;
  elevationMaxM: number;
  rating: number;
  reviewsCount: number;
  trailType: TrailType;
  imageUrl: string;
  tags: string[];
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  highlights: string[];
  weather: TrailWeather;
  elevationProfile: ElevationPoint[];
  gearRecommendations: string[];
  author: {
    name: string;
    role: string;
  };
}
