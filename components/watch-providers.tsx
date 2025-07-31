'use client';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useMovieWatchProviders, useTVWatchProviders } from '@/hooks/use-tmdb';
import { getTMDBImageUrl } from '@/lib/tmdb-utils';
import { MediaType, TMDBProvider } from '@/types/tmdb';

interface WatchProvidersProps {
  mediaId: number;
  mediaType: MediaType;
  country: string;
}

// Map of known streaming services to their brand colors
const PROVIDER_COLORS: Record<string, string> = {
  Netflix: 'bg-red-600 hover:bg-red-700',
  'Disney Plus': 'bg-blue-600 hover:bg-blue-700',
  'Apple TV+': 'bg-gray-800 hover:bg-gray-900',
  'Amazon Prime Video': 'bg-blue-500 hover:bg-blue-600',
  Hulu: 'bg-green-500 hover:bg-green-600',
  'HBO Max': 'bg-purple-600 hover:bg-purple-700',
  'Paramount Plus': 'bg-blue-700 hover:bg-blue-800',
  Peacock: 'bg-yellow-600 hover:bg-yellow-700',
  Crunchyroll: 'bg-orange-500 hover:bg-orange-600',
  Showtime: 'bg-red-800 hover:bg-red-900',
  Starz: 'bg-gray-700 hover:bg-gray-800',
  Epix: 'bg-yellow-500 hover:bg-yellow-600',
  'YouTube Premium': 'bg-red-500 hover:bg-red-600',
  FuboTV: 'bg-orange-600 hover:bg-orange-700',
  Tubi: 'bg-orange-400 hover:bg-orange-500',
  'Pluto TV': 'bg-cyan-600 hover:bg-cyan-700',
  Crackle: 'bg-black hover:bg-gray-900',
  'Vudu (Free)': 'bg-blue-800 hover:bg-blue-900',
};

export function WatchProviders({ mediaId, mediaType, country }: WatchProvidersProps) {
  // Fetch watch providers based on media type
  const {
    data: movieProviders,
    isLoading: movieLoading,
    isError: movieError,
  } = useMovieWatchProviders(mediaType === MediaType.MOVIE ? mediaId : 0);

  const {
    data: tvProviders,
    isLoading: tvLoading,
    isError: tvError,
  } = useTVWatchProviders(mediaType === MediaType.TV ? mediaId : 0);

  const providersData = mediaType === MediaType.MOVIE ? movieProviders : tvProviders;
  const isLoading = mediaType === MediaType.MOVIE ? movieLoading : tvLoading;
  const isError = mediaType === MediaType.MOVIE ? movieError : tvError;

  // Get providers for the user's country
  const countryProviders = providersData?.results?.[country] || providersData?.results?.['US'];

  // Combine all available providers
  const allProviders: TMDBProvider[] = [];

  if (countryProviders) {
    // Prioritize subscription services (flatrate)
    if (countryProviders.flatrate) {
      allProviders.push(...countryProviders.flatrate);
    }
    // Then free options
    if (countryProviders.free) {
      allProviders.push(...countryProviders.free);
    }
  }

  // Remove duplicates based on provider_id
  const uniqueProviders = allProviders.filter(
    (provider, index, self) =>
      index === self.findIndex((p) => p.provider_id === provider.provider_id)
  );

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-28" />
      </div>
    );
  }

  // Handle errors gracefully
  if (isError) {
    return (
      <div className="text-sm text-muted-foreground">Unable to load streaming information</div>
    );
  }

  if (uniqueProviders.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Not available on streaming platforms in your region, but may be available for rent or
        purchase.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {uniqueProviders.map((provider) => {
        const colorClass =
          PROVIDER_COLORS[provider.provider_name] || 'bg-secondary hover:bg-secondary/80';

        return (
          <Badge
            key={provider.provider_id}
            variant="secondary"
            className={`${colorClass} text-white border-0 transition-colors`}
          >
            {provider.logo_path && (
              <img
                src={getTMDBImageUrl(provider.logo_path, 'w92')}
                alt={provider.provider_name}
                className="w-4 h-4 mr-1 inline-block rounded"
              />
            )}
            {provider.provider_name}
          </Badge>
        );
      })}
      {countryProviders?.rent && countryProviders.rent.length > 0 && (
        <Badge variant="outline" className="text-xs">
          + Rent/Buy available
        </Badge>
      )}
    </div>
  );
}
