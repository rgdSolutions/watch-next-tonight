import { MediaType } from '@/types/tmdb';

export const mockMovieResponse = {
  id: 550,
  title: 'Fight Club',
  overview:
    'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
  release_date: '1999-10-15',
  poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
  vote_average: 8.433,
  vote_count: 26280,
  popularity: 73.433,
  genre_ids: [18, 53, 35],
  original_language: 'en',
  adult: false,
};

export const mockTVResponse = {
  id: 1396,
  name: 'Breaking Bad',
  overview:
    "When Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of only two years left to live. He becomes filled with a sense of fearlessness and an unrelenting desire to secure his family's financial future at any cost as he enters the dangerous world of drugs and crime.",
  first_air_date: '2008-01-20',
  poster_path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
  backdrop_path: '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
  vote_average: 8.88,
  vote_count: 12000,
  popularity: 245.733,
  genre_ids: [18, 80],
  original_language: 'en',
};

export const mockSearchMultiResponse = {
  page: 1,
  results: [
    { ...mockMovieResponse, media_type: 'movie' },
    { ...mockTVResponse, media_type: 'tv' },
  ],
  total_pages: 1,
  total_results: 2,
};

export const mockDiscoverMoviesResponse = {
  page: 1,
  results: [mockMovieResponse],
  total_pages: 1,
  total_results: 1,
};

export const mockDiscoverTVResponse = {
  page: 1,
  results: [mockTVResponse],
  total_pages: 1,
  total_results: 1,
};

export const mockGenresResponse = {
  genres: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
  ],
};

// Expected transformed responses
export const expectedTransformedMovie = {
  id: 'tmdb-movie-550',
  tmdbId: 550,
  title: 'Fight Club',
  type: MediaType.MOVIE,
  overview:
    'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
  releaseDate: '1999-10-15',
  posterPath: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  backdropPath: 'https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
  rating: 8.433,
  voteCount: 26280,
  popularity: 73.433,
  genreIds: [18, 53, 35],
  originalLanguage: 'en',
  adult: false,
};

export const expectedTransformedTV = {
  id: 'tmdb-tv-1396',
  tmdbId: 1396,
  title: 'Breaking Bad',
  type: MediaType.TV,
  overview:
    "When Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of only two years left to live. He becomes filled with a sense of fearlessness and an unrelenting desire to secure his family's financial future at any cost as he enters the dangerous world of drugs and crime.",
  releaseDate: '2008-01-20',
  posterPath: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
  backdropPath: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
  rating: 8.88,
  voteCount: 12000,
  popularity: 245.733,
  genreIds: [18, 80],
  originalLanguage: 'en',
  adult: undefined,
};
