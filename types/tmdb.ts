// TMDB API Types

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  adult: boolean;
  media_type?: 'movie';
  runtime?: number; // Movie runtime in minutes
}

export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  media_type?: 'tv';
  episode_run_time?: number[]; // Episode runtime in minutes
  number_of_episodes?: number;
  number_of_seasons?: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

// Transformed types for our app
export enum MediaType {
  MOVIE = 'movie',
  TV = 'tv',
}

export interface MediaItem {
  id: string;
  tmdbId: number;
  title: string;
  type: MediaType;
  overview: string;
  releaseDate: string;
  posterPath: string | null;
  backdropPath: string | null;
  rating: number;
  voteCount: number;
  popularity: number;
  genreIds: number[];
  originalLanguage: string;
  adult?: boolean;
  runtime?: number; // Runtime in minutes (for movies)
  episodeRunTime?: number[]; // Episode runtimes (for TV shows)
  numberOfEpisodes?: number; // Total episodes (for TV shows)
  numberOfSeasons?: number; // Total seasons (for TV shows)
}

export interface SearchResults {
  results: MediaItem[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface GenreList {
  genres: TMDBGenre[];
}

// API Response types
export interface TMDBSearchResponse {
  page: number;
  results: (TMDBMovie | TMDBTVShow)[];
  total_pages: number;
  total_results: number;
}

export interface TMDBDiscoverResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenreResponse {
  genres: TMDBGenre[];
}

// Video/Trailer types
export interface TMDBVideo {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TMDBVideoResponse {
  id: number;
  results: TMDBVideo[];
}

// Watch Provider types
export interface TMDBProvider {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export interface TMDBWatchProviderResult {
  link?: string;
  rent?: TMDBProvider[];
  buy?: TMDBProvider[];
  flatrate?: TMDBProvider[];
  free?: TMDBProvider[];
}

export interface TMDBWatchProviderResponse {
  id: number;
  results: {
    [countryCode: string]: TMDBWatchProviderResult;
  };
}
