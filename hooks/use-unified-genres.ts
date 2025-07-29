import { useMovieGenres, useTVGenres } from '@/hooks/use-tmdb';
import { getUnifiedGenres, UnifiedGenre } from '@/lib/unified-genres';

export function useUnifiedGenres() {
  const { data: movieGenres, isLoading: isLoadingMovies, error: movieError } = useMovieGenres();
  const { data: tvGenres, isLoading: isLoadingTV, error: tvError } = useTVGenres();

  const isLoading = isLoadingMovies || isLoadingTV;
  const error = movieError || tvError;

  let unifiedGenres: UnifiedGenre[] = [];

  if (movieGenres?.genres && tvGenres?.genres) {
    unifiedGenres = getUnifiedGenres(movieGenres.genres, tvGenres.genres);
  }

  return {
    genres: unifiedGenres,
    isLoading,
    error,
  };
}
