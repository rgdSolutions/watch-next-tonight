import { TMDBGenre } from '@/types/tmdb';

export interface UnifiedGenre {
  id: string;
  name: string;
  emoji: string;
  movieIds: number[];
  tvIds: number[];
}

// Emoji mapping for common genre keywords
export const GENRE_EMOJIS: Record<string, string> = {
  action: '💥',
  adventure: '🗺️',
  animation: '🎨',
  comedy: '😂',
  crime: '🕵️',
  documentary: '📹',
  drama: '🎭',
  family: '👨‍👩‍👧‍👦',
  fantasy: '🧙',
  history: '📜',
  horror: '👻',
  music: '🎵',
  mystery: '🔍',
  romance: '💕',
  science: '🚀',
  thriller: '😱',
  war: '⚔️',
  western: '🤠',
  reality: '📺',
  news: '📰',
  talk: '🎤',
  politics: '🏛️',
  kids: '👶',
};

// Get emoji for a genre based on keywords in the name
function getGenreEmoji(genreName: string): string {
  const lowerName = genreName.toLowerCase();

  // Check for exact matches first
  if (GENRE_EMOJIS[lowerName]) {
    return GENRE_EMOJIS[lowerName];
  }

  // Check for partial matches
  for (const [keyword, emoji] of Object.entries(GENRE_EMOJIS)) {
    if (lowerName.includes(keyword)) {
      return emoji;
    }
  }

  // Default emoji for unknown genres
  return '🎬';
}

// Normalize genre names for comparison
function normalizeGenreName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[&\s-]+/g, '') // Remove spaces, hyphens, and ampersands
    .replace(/fiction/g, 'fi') // Normalize "Science Fiction" vs "Sci-Fi"
    .replace(/scifi/g, 'fi');
}

// Check if two genre names are similar enough to be considered the same
function areGenresSimilar(name1: string, name2: string): boolean {
  const norm1 = normalizeGenreName(name1);
  const norm2 = normalizeGenreName(name2);

  // Exact match after normalization
  if (norm1 === norm2) return true;

  // Check if one contains the other (for cases like "Action" vs "Action & Adventure")
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true;

  // Special cases
  const specialMappings: Record<string, string[]> = {
    scifi: ['sciencefiction'],
    sciencefiction: ['scifi'],
    actionadventure: ['action', 'adventure'],
    warmilitary: ['war'],
    sciencefantasy: ['scifi', 'fantasy'],
  };

  const mappings1 = specialMappings[norm1] || [];
  const mappings2 = specialMappings[norm2] || [];

  return mappings1.includes(norm2) || mappings2.includes(norm1);
}

// Dynamically create unified genres from TMDB movie and TV genres
export function getUnifiedGenres(movieGenres: TMDBGenre[], tvGenres: TMDBGenre[]): UnifiedGenre[] {
  const unifiedMap = new Map<string, UnifiedGenre>();

  // Process movie genres
  movieGenres.forEach((movieGenre) => {
    const baseId = normalizeGenreName(movieGenre.name);

    // Check if we already have a similar genre
    let existingKey: string | undefined;
    for (const [key, value] of Array.from(unifiedMap.entries())) {
      if (areGenresSimilar(movieGenre.name, value.name)) {
        existingKey = key;
        break;
      }
    }

    if (existingKey) {
      // Add movie ID to existing unified genre
      const existing = unifiedMap.get(existingKey)!;
      existing.movieIds.push(movieGenre.id);
    } else {
      // Create new unified genre
      unifiedMap.set(baseId, {
        id: baseId,
        name: movieGenre.name,
        emoji: getGenreEmoji(movieGenre.name),
        movieIds: [movieGenre.id],
        tvIds: [],
      });
    }
  });

  // Process TV genres
  tvGenres.forEach((tvGenre) => {
    const baseId = normalizeGenreName(tvGenre.name);

    // Check if we already have a similar genre
    let existingKey: string | undefined;
    for (const [key, value] of Array.from(unifiedMap.entries())) {
      if (areGenresSimilar(tvGenre.name, value.name)) {
        existingKey = key;
        break;
      }
    }

    if (existingKey) {
      // Add TV ID to existing unified genre
      const existing = unifiedMap.get(existingKey)!;
      existing.tvIds.push(tvGenre.id);
    } else {
      // Create new unified genre
      unifiedMap.set(baseId, {
        id: baseId,
        name: tvGenre.name,
        emoji: getGenreEmoji(tvGenre.name),
        movieIds: [],
        tvIds: [tvGenre.id],
      });
    }
  });

  // Convert map to array and sort by name
  return Array.from(unifiedMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// Convert unified genre IDs to TMDB genre IDs
export function unifiedGenresToTMDBIds(
  unifiedGenreIds: string[],
  unifiedGenres: UnifiedGenre[],
  mediaType: 'movie' | 'tv'
): number[] {
  const tmdbIds = new Set<number>();

  unifiedGenreIds.forEach((unifiedId) => {
    const unifiedGenre = unifiedGenres.find((g) => g.id === unifiedId);
    if (unifiedGenre) {
      const ids = mediaType === 'movie' ? unifiedGenre.movieIds : unifiedGenre.tvIds;
      ids.forEach((id) => tmdbIds.add(id));
    }
  });

  return Array.from(tmdbIds);
}
