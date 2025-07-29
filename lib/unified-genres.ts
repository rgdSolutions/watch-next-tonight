import { TMDBGenre } from '@/types/tmdb';

export interface UnifiedGenre {
  id: string;
  name: string;
  emoji: string;
  movieIds: number[];
  tvIds: number[];
}

// Create a unified genre list that maps between movie and TV genres
export const UNIFIED_GENRES: UnifiedGenre[] = [
  {
    id: 'action',
    name: 'Action',
    emoji: '🎬',
    movieIds: [28], // Action
    tvIds: [10759], // Action & Adventure
  },
  {
    id: 'adventure',
    name: 'Adventure',
    emoji: '🗺️',
    movieIds: [12], // Adventure
    tvIds: [10759], // Action & Adventure
  },
  {
    id: 'animation',
    name: 'Animation',
    emoji: '🎨',
    movieIds: [16], // Animation
    tvIds: [16], // Animation
  },
  {
    id: 'comedy',
    name: 'Comedy',
    emoji: '😂',
    movieIds: [35], // Comedy
    tvIds: [35], // Comedy
  },
  {
    id: 'crime',
    name: 'Crime',
    emoji: '🕵️',
    movieIds: [80], // Crime
    tvIds: [80], // Crime
  },
  {
    id: 'documentary',
    name: 'Documentary',
    emoji: '📹',
    movieIds: [99], // Documentary
    tvIds: [99], // Documentary
  },
  {
    id: 'drama',
    name: 'Drama',
    emoji: '🎭',
    movieIds: [18], // Drama
    tvIds: [18], // Drama
  },
  {
    id: 'family',
    name: 'Family',
    emoji: '👨‍👩‍👧‍👦',
    movieIds: [10751], // Family
    tvIds: [10751], // Family
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    emoji: '🧙‍♂️',
    movieIds: [14], // Fantasy
    tvIds: [10765], // Sci-Fi & Fantasy
  },
  {
    id: 'horror',
    name: 'Horror',
    emoji: '👻',
    movieIds: [27], // Horror
    tvIds: [], // No direct TV equivalent
  },
  {
    id: 'mystery',
    name: 'Mystery',
    emoji: '🔍',
    movieIds: [9648], // Mystery
    tvIds: [9648], // Mystery
  },
  {
    id: 'romance',
    name: 'Romance',
    emoji: '💕',
    movieIds: [10749], // Romance
    tvIds: [], // No direct TV equivalent
  },
  {
    id: 'sci-fi',
    name: 'Sci-Fi',
    emoji: '🚀',
    movieIds: [878], // Science Fiction
    tvIds: [10765], // Sci-Fi & Fantasy
  },
  {
    id: 'thriller',
    name: 'Thriller',
    emoji: '🔪',
    movieIds: [53], // Thriller
    tvIds: [], // No direct TV equivalent
  },
  {
    id: 'war',
    name: 'War',
    emoji: '⚔️',
    movieIds: [10752], // War
    tvIds: [10768], // War & Politics
  },
  {
    id: 'western',
    name: 'Western',
    emoji: '🤠',
    movieIds: [37], // Western
    tvIds: [37], // Western
  },
  {
    id: 'music',
    name: 'Music',
    emoji: '🎵',
    movieIds: [10402], // Music
    tvIds: [], // No direct TV equivalent
  },
  {
    id: 'history',
    name: 'History',
    emoji: '📜',
    movieIds: [36], // History
    tvIds: [], // No direct TV equivalent
  },
  {
    id: 'reality',
    name: 'Reality',
    emoji: '📺',
    movieIds: [], // No movie equivalent
    tvIds: [10764], // Reality
  },
  {
    id: 'kids',
    name: 'Kids',
    emoji: '👶',
    movieIds: [], // No movie equivalent
    tvIds: [10762], // Kids
  },
];

/**
 * Get unified genres from API genre lists
 * This merges movie and TV genres into a unified list
 */
export function getUnifiedGenres(movieGenres: TMDBGenre[], tvGenres: TMDBGenre[]): UnifiedGenre[] {
  // Create a map of genre IDs to names for quick lookup
  const movieGenreMap = new Map(movieGenres.map((g) => [g.id, g.name]));
  const tvGenreMap = new Map(tvGenres.map((g) => [g.id, g.name]));

  // Filter out unified genres that have at least one valid ID
  return UNIFIED_GENRES.filter((genre) => {
    const hasValidMovieGenre = genre.movieIds.some((id) => movieGenreMap.has(id));
    const hasValidTvGenre = genre.tvIds.some((id) => tvGenreMap.has(id));
    return hasValidMovieGenre || hasValidTvGenre;
  });
}

/**
 * Convert unified genre IDs to TMDB genre IDs
 */
export function unifiedGenresToTMDBIds(
  unifiedGenreIds: string[],
  mediaType: 'movie' | 'tv'
): number[] {
  const tmdbIds = new Set<number>();

  unifiedGenreIds.forEach((unifiedId) => {
    const unifiedGenre = UNIFIED_GENRES.find((g) => g.id === unifiedId);
    if (unifiedGenre) {
      const ids = mediaType === 'movie' ? unifiedGenre.movieIds : unifiedGenre.tvIds;
      ids.forEach((id) => tmdbIds.add(id));
    }
  });

  return Array.from(tmdbIds);
}

/**
 * Check if a media item matches the selected unified genres
 */
export function matchesUnifiedGenres(
  itemGenreIds: number[],
  selectedUnifiedGenreIds: string[],
  mediaType: 'movie' | 'tv'
): boolean {
  if (selectedUnifiedGenreIds.length === 0) return true;

  const requiredTMDBIds = unifiedGenresToTMDBIds(selectedUnifiedGenreIds, mediaType);
  return requiredTMDBIds.some((id) => itemGenreIds.includes(id));
}
