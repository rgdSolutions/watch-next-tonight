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
  soap: '💔',
  tvmovie: '🎬',
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

  // Special cases BEFORE substring matching
  const specialMappings: Record<string, string[]> = {
    scifi: ['sciencefiction'],
    sciencefiction: ['scifi'],
    sciencefi: ['fifantasy'], // "Science Fiction" -> "Sci-Fi & Fantasy"
    fifantasy: ['sciencefi'], // "Sci-Fi & Fantasy" -> "Science Fiction"
    actionadventure: ['action', 'adventure'],
    warmilitary: ['war'],
    sciencefantasy: ['scifi', 'fantasy'],
    war: ['warpolitics'], // "War" -> "War & Politics"
    warpolitics: ['war'], // "War & Politics" -> "War"
  };

  const mappings1 = specialMappings[norm1] || [];
  const mappings2 = specialMappings[norm2] || [];

  if (mappings1.includes(norm2) || mappings2.includes(norm1)) {
    return true;
  }

  // Don't do substring matching for certain genres that would cause false positives
  const noSubstringMatch = ['fantasy', 'action', 'adventure', 'war'];
  if (noSubstringMatch.includes(norm1) || noSubstringMatch.includes(norm2)) {
    return false;
  }

  // Check if one contains the other (for other cases)
  return norm1.includes(norm2) || norm2.includes(norm1);
}

// Manual mappings for genres that don't have direct equivalents
const GENRE_FALLBACK_MAPPINGS: Record<string, { movie?: number; tv?: number }> = {
  // Movie-only genres and their closest TV equivalents
  adventure: { tv: 10759 }, // Adventure -> Action & Adventure
  fantasy: { tv: 10765 }, // Fantasy -> Sci-Fi & Fantasy
  history: { tv: 10768 }, // History -> War & Politics
  horror: { tv: 9648 }, // Horror -> Mystery (closest match)
  music: { tv: 10767 }, // Music -> Talk (for music-related shows)
  romance: { tv: 10766 }, // Romance -> Soap
  tvmovie: { tv: 10759 }, // TV Movie -> Action & Adventure
  // TV-only genres and their closest movie equivalents
  kids: { movie: 16 }, // Kids -> Animation
  news: { movie: 99 }, // News -> Documentary
  reality: { movie: 99 }, // Reality -> Documentary
  soap: { movie: 10749 }, // Soap -> Romance
  talk: { movie: 99 }, // Talk -> Documentary
};

// Dynamically create unified genres from TMDB movie and TV genres
export function getUnifiedGenres(movieGenres: TMDBGenre[], tvGenres: TMDBGenre[]): UnifiedGenre[] {
  const unifiedMap = new Map<string, UnifiedGenre>();

  // Create lookup maps for easy access
  const movieGenreMap = new Map(movieGenres.map((g) => [g.id, g]));
  const tvGenreMap = new Map(tvGenres.map((g) => [g.id, g]));

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
      // Update name if the TV version is preferred (e.g., "Sci-Fi & Fantasy" over "Fantasy")
      if (tvGenre.name.includes('&') && !existing.name.includes('&')) {
        existing.name = tvGenre.name;
      }
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

  // Fill in missing IDs using fallback mappings
  unifiedMap.forEach((genre, key) => {
    const fallback =
      GENRE_FALLBACK_MAPPINGS[key] || GENRE_FALLBACK_MAPPINGS[genre.name.toLowerCase()];

    if (genre.movieIds.length === 0 && fallback?.movie) {
      genre.movieIds.push(fallback.movie);
    }

    if (genre.tvIds.length === 0 && fallback?.tv) {
      genre.tvIds.push(fallback.tv);
    }

    // For genres still missing IDs, use the most general fallback
    if (genre.movieIds.length === 0) {
      // Default to Drama (18) for movies
      genre.movieIds.push(18);
    }

    if (genre.tvIds.length === 0) {
      // Default to Drama (18) for TV
      genre.tvIds.push(18);
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
