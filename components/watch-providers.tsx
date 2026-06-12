'use client';

import Image from 'next/image';

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
        return (
          <Badge
            key={provider.provider_id}
            variant="secondary"
            className="rounded-full border border-keyline bg-card/60 text-foreground transition-colors hover:border-keyline-bright hover:bg-primary/10"
          >
            {provider.logo_path && (
              <Image
                src={getTMDBImageUrl(provider.logo_path, 'w92')}
                alt={provider.provider_name}
                width={16}
                height={16}
                className="mr-1 inline-block rounded"
              />
            )}
            {provider.provider_name}
          </Badge>
        );
      })}
      {countryProviders?.rent && countryProviders.rent.length > 0 && (
        <Badge
          variant="outline"
          className="text-xs rounded-full border-keyline text-muted-foreground"
        >
          + Rent/Buy available
        </Badge>
      )}
    </div>
  );
}
