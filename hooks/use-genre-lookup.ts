import { useMovieGenres, useTVGenres } from '@/hooks/use-tmdb';
import { useUnifiedGenres } from '@/hooks/use-unified-genres';
import { GENRE_EMOJIS } from '@/lib/unified-genres';
import { MediaType } from '@/types/tmdb';

export function useGenreLookup(mediaType: MediaType) {
  const { data: movieGenres } = useMovieGenres();
  const { data: tvGenres } = useTVGenres();
  const { genres: unifiedGenres } = useUnifiedGenres();

  // Get the appropriate genre list based on media type
  const genreList = mediaType === MediaType.MOVIE ? movieGenres?.genres : tvGenres?.genres;

  // Helper function to get genre name from ID
  const getGenreName = (genreId: number) => {
    const genre = genreList?.find((g) => g.id === genreId);
    return genre?.name || '';
  };

  // Helper function to get unified genre ID for emoji
  const getUnifiedGenreId = (genreName: string) => {
    const unified = unifiedGenres.find((g) => g.name.toLowerCase() === genreName.toLowerCase());
    return unified?.id;
  };

  // Get genre with emoji
  const getGenreWithEmoji = (genreId: number) => {
    const genreName = getGenreName(genreId);
    if (!genreName) return null;

    const unifiedId = getUnifiedGenreId(genreName) || getUnifiedGenreId(genreName.split(' ')[0]);
    const emoji = genreName.includes('Sci-Fi') ? '🚀' : unifiedId ? GENRE_EMOJIS[unifiedId] : '';

    return {
      id: genreId,
      name: genreName,
      emoji,
      displayName: emoji ? `${emoji} ${genreName}` : genreName,
    };
  };

  return {
    getGenreName,
    getGenreWithEmoji,
    genreList,
  };
}
