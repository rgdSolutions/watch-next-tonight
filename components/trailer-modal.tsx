'use client';

import { Calendar, Clock, Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Player */}
          <VideoPlayer mediaId={item.tmdbId} mediaType={item.type} title={item.title} />

          {/* Content Details */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left Column - Cover and Basic Info */}
            <div className="space-y-4">
              <div className="w-48 h-72 mx-auto rounded-lg overflow-hidden bg-muted">
                <img
                  src={getTMDBImageUrl(item.backdropPath || item.posterPath, 'original')}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center space-y-2">
                {typeof item.rating === 'number' && (
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{item.rating.toFixed(1)}</span>
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
                  {item.genreIds.map((genreId) => {
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
