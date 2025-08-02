'use client';

import { Switch } from '@radix-ui/react-switch';
import { ArrowLeft, Filter } from 'lucide-react';
import { useState } from 'react';

import { ContentCard } from '@/components/content-card';
import { TrailerModal } from '@/components/trailer-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useDiscoverMovies,
  useDiscoverTVShows,
  useMovieGenres,
  useTrending,
  useTVGenres,
} from '@/hooks/use-tmdb';
import { useUnifiedGenres } from '@/hooks/use-unified-genres';
import { FLAG_EMOJIS } from '@/lib/country-codes';
import { getProviderIdsForPlatform } from '@/lib/streaming-providers';
import { unifiedGenresToTMDBIds } from '@/lib/unified-genres';
import { capitalizeFirstLetter } from '@/lib/utils';
import { MediaItem } from '@/types/tmdb';

type ContentType = 'all' | 'movie' | 'tv';

interface ContentDisplayWithQueryProps {
  preferences: {
    country: string;
    genres: string[];
    recency: string;
  };
  onBackToPreferences: () => void;
}

export const chooseInitialContentType = (preferences: {
  country: string;
  genres: string[];
  recency: string;
}): ContentType => {
  // massively popular show-only genres
  if (preferences.genres.includes('kids') || preferences.genres.includes('reality')) {
    return 'tv';
  }

  // highly popular movie-only genres
  if (
    preferences.genres.includes('horror') ||
    preferences.genres.includes('romance') ||
    preferences.genres.includes('thriller')
  ) {
    return 'movie';
  }

  // show-only genres
  if (
    preferences.genres.includes('news') ||
    preferences.genres.includes('soap') ||
    preferences.genres.includes('talk')
  ) {
    return 'tv';
  }

  // movie-only genres
  if (
    preferences.genres.includes('history') ||
    preferences.genres.includes('music') ||
    preferences.genres.includes('tvmovie')
  ) {
    return 'movie';
  }

  return 'all';
};

export function ContentDisplayWithQuery({
  preferences,
  onBackToPreferences,
}: ContentDisplayWithQueryProps) {
  const isSurpriseMe = preferences.genres.length === 0;
  const [tab, setTab] = useState<'search' | 'trending'>('search');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [contentType, setContentType] = useState<ContentType>(
    chooseInitialContentType(preferences)
  );
  const [selectedTrailer, setSelectedTrailer] = useState<MediaItem | null>(null);
  const [hiddenItems, setHiddenItems] = useState<string[]>([]);

  const handleHide = (itemId: string) => setHiddenItems((prev) => [...prev, itemId]);

  const { data: trendingData } = useTrending('all', 'week', {
    enabled: isSurpriseMe,
    queryKey: ['trending', 'all', 'week'],
  });

  // Get unified genres
  const { genres: unifiedGenres } = useUnifiedGenres();
  // Get genre mappings (still needed for display)
  const { data: movieGenres } = useMovieGenres();
  const { data: tvGenres } = useTVGenres();

  // Calculate date range based on recency preference
  const getDateRange = () => {
    const now = new Date();
    const startDate = new Date();

    switch (preferences.recency) {
      case 'brand-new':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'very-recent':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'recent':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'contemporary':
        startDate.setFullYear(now.getFullYear() - 2);
        break;
      default:
        startDate.setFullYear(1900);
    }

    return {
      gte: startDate.toISOString().split('T')[0],
      lte: now.toISOString().split('T')[0],
    };
  };

  const dateRange = getDateRange();
  // Convert unified genre IDs to TMDB IDs
  const movieGenreIds =
    preferences.genres.length === 0
      ? []
      : unifiedGenresToTMDBIds(preferences.genres, unifiedGenres, 'movie');
  const tvGenreIds =
    preferences.genres.length === 0
      ? []
      : unifiedGenresToTMDBIds(preferences.genres, unifiedGenres, 'tv');

  // Get provider IDs for filtering
  const watchProviderIds =
    selectedPlatform !== 'all' ? getProviderIdsForPlatform(selectedPlatform) : undefined;

  // Fetch movies and TV shows
  const { data: moviesData, isLoading: moviesLoading } = useDiscoverMovies(
    {
      with_genres: movieGenreIds.join('|'),
      'primary_release_date.gte': dateRange.gte,
      'primary_release_date.lte': dateRange.lte,
      sort_by: 'popularity.desc',
      watch_region: preferences.country,
      ...(watchProviderIds && {
        with_watch_providers: watchProviderIds,
        with_watch_monetization_types: 'flatrate|rent|buy',
      }),
    },
    {
      enabled: contentType !== 'tv' && (movieGenres?.genres.length ?? 0) > 0,
    } as any
  );

  const { data: tvData, isLoading: tvLoading } = useDiscoverTVShows(
    {
      with_genres: tvGenreIds.join('|'),
      'first_air_date.gte': dateRange.gte,
      'first_air_date.lte': dateRange.lte,
      sort_by: 'popularity.desc',
      watch_region: preferences.country,
      ...(watchProviderIds && {
        with_watch_providers: watchProviderIds,
        with_watch_monetization_types: 'flatrate|rent|buy',
      }),
    },
    {
      enabled: contentType !== 'movie' && (tvGenres?.genres.length ?? 0) > 0,
    } as any
  );

  // Combine results based on content type filter
  const allContent: MediaItem[] = [
    ...(contentType !== 'movie' ? tvData?.results || [] : []),
    ...(contentType !== 'tv' ? moviesData?.results || [] : []),
  ];

  const isLoading = moviesLoading || tvLoading;

  let platforms = [
    { id: 'all', name: 'All Platforms' },
    { id: 'netflix', name: 'Netflix' },
    { id: 'prime', name: 'Prime Video' },
    { id: 'disney', name: 'Disney+' },
    { id: 'max', name: 'MAX' },
    { id: 'paramount', name: 'Paramount+' },
    { id: 'appletv', name: 'Apple TV+' },
    { id: 'crunchyroll', name: 'Crunchyroll' },
  ];

  if (preferences.country === 'US') {
    platforms = [
      ...platforms,
      { id: 'hulu', name: 'Hulu' },
      { id: 'peacock', name: 'Peacock' },
      { id: 'starz', name: 'Starz' },
      { id: 'fubotv', name: 'FuboTV' },
      { id: 'epix', name: 'Epix' },
      { id: 'plutotv', name: 'Pluto TV' },
    ];
  }

  return (
    <div data-testid="content-display" className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBackToPreferences} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Change Preferences
          </Button>
          {/* TODO: If isSurpriseMe, display a switch to toggle between search and trending results */}
          {isSurpriseMe && (
            <div className="flex items-center gap-2">
              <Switch />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
            <SelectTrigger className="w-[156px]">
              <SelectValue placeholder="Content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content</SelectItem>
              <SelectItem value="tv">TV Shows Only</SelectItem>
              <SelectItem value="movie">Movies Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-[160px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by platform" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((platform) => (
                <SelectItem key={platform.id} value={platform.id}>
                  {platform.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {tab === 'search' ? 'Your Search Results' : 'Globally Trending Results'}
          </CardTitle>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">Country: {FLAG_EMOJIS[preferences.country] ?? '🇺🇸'}</Badge>
            <Badge variant="secondary">
              Genres:{' '}
              {preferences.genres.length
                ? preferences.genres.map(capitalizeFirstLetter).join(', ')
                : 'All'}
            </Badge>
            <Badge variant="secondary">Recency: {capitalizeFirstLetter(preferences.recency)}</Badge>
            <Badge variant="outline">{allContent.length} results found</Badge>
          </div>
          {selectedPlatform === 'all' && (
            <p className="text-sm text-muted-foreground mt-2">
              * Includes some content that is only available for rent or purchase
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {hiddenItems.length > 0 && (
          <Card
            className="flex justify-center items-center cursor-pointer select-none transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            onClick={() => setHiddenItems([])}
          >
            {`Show ${hiddenItems.length} hidden item${hiddenItems.length === 1 ? '' : 's'}`}
          </Card>
        )}
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-[300px] w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))
        ) : allContent.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <p className="text-muted-foreground">
                  No content found matching your preferences in your region.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={onBackToPreferences}>
                    Change Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          allContent
            .filter((item) => !hiddenItems.includes(item.id))
            .map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                onTrailerClick={() => setSelectedTrailer(item)}
                onHide={handleHide}
              />
            ))
        )}
      </div>

      {/* Trailer Modal */}
      {selectedTrailer && (
        <TrailerModal
          item={selectedTrailer}
          isOpen={!!selectedTrailer}
          onClose={() => setSelectedTrailer(null)}
          country={preferences.country}
        />
      )}
    </div>
  );
}
