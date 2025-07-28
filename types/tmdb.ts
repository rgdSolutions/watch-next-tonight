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
