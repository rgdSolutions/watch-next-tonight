'use client';

import { Calendar, Clock } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VideoPlayer } from '@/components/video-player';
import { WatchProviders } from '@/components/watch-providers';
import { useGenreLookup } from '@/hooks/use-genre-lookup';
import { useMovieDetails, useTVShowDetails } from '@/hooks/use-tmdb';
import { getTMDBImageUrl, getYearFromDate } from '@/lib/tmdb-utils';
import { MediaItem, MediaType } from '@/types/tmdb';

interface TrailerModalProps {
  item: MediaItem;
  isOpen: boolean;
  onClose: () => void;
  country?: string;
}

export function TrailerModal({ item, isOpen, onClose, country = 'US' }: TrailerModalProps) {
  const { getGenreWithEmoji } = useGenreLookup(item.type);

  // Fetch detailed info for runtime
  const { data: movieDetails } = useMovieDetails(item.type === MediaType.MOVIE ? item.tmdbId : 0);
  const { data: tvDetails } = useTVShowDetails(item.type === MediaType.TV ? item.tmdbId : 0);

  const detailedItem = item.type === MediaType.MOVIE ? movieDetails : tvDetails;
  const runtime = detailedItem?.runtime || item.runtime;

  // Format runtime display
  const formatRuntime = (minutes?: number) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Format TV show info
  const getTVShowInfo = () => {
    if (!detailedItem || item.type !== MediaType.TV) return 'Series';
    const seasons = detailedItem.numberOfSeasons;
    const episodes = detailedItem.numberOfEpisodes;

    if (seasons && episodes) {
      return `${seasons} Season${seasons > 1 ? 's' : ''} • ${episodes} Episodes`;
    } else if (seasons) {
      return `${seasons} Season${seasons > 1 ? 's' : ''}`;
    }
    return 'Series';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border border-keyline bg-background/80 backdrop-blur-xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">{item.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Watch trailer and details for {item.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Player */}
          <VideoPlayer mediaId={item.tmdbId} mediaType={item.type} title={item.title} />

          {/* Content Details */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left Column - Cover and Basic Info */}
            <div className="space-y-4">
              <div className="w-48 h-72 mx-auto rounded-lg overflow-hidden bg-muted relative ring-1 ring-keyline">
                <Image
                  src={getTMDBImageUrl(item.backdropPath || item.posterPath, 'original')}
                  alt={item.title}
                  fill
                  sizes="192px"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="text-center space-y-2">
                {typeof item.rating === 'number' && (
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="grid h-12 w-12 flex-none place-items-center rounded-full shadow-[0_0_16px_-4px_var(--glow)]"
                      style={{
                        background: `conic-gradient(from -90deg, hsl(var(--primary)) 0%, hsl(var(--accent)) ${item.rating * 10}%, hsl(var(--muted)) ${item.rating * 10}% 100%)`,
                      }}
                    >
                      <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-card text-sm font-bold text-card-foreground">
                        {item.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-muted-foreground">/10</span>
                  </div>
                )}

                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {getYearFromDate(item.releaseDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {item.type === 'movie'
                      ? formatRuntime(runtime) || 'Runtime N/A'
                      : getTVShowInfo()}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Type</h3>
                <Badge variant="outline">{item.type === 'movie' ? '🎬 Movie' : '📺 TV Show'}</Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {item.genreIds?.map((genreId) => {
                    const genre = getGenreWithEmoji(genreId);
                    return genre ? (
                      <Badge variant="secondary" key={genreId}>
                        {genre.displayName}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{item.overview}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Available On</h3>
                <WatchProviders mediaId={item.tmdbId} mediaType={item.type} country={country} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
