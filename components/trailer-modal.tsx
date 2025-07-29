'use client';

import { Calendar, Clock, Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getTMDBImageUrl, getYearFromDate } from '@/lib/tmdb-utils';
import { MediaItem } from '@/types/tmdb';

interface TrailerModalProps {
  item: MediaItem;
  isOpen: boolean;
  onClose: () => void;
}

export function TrailerModal({ item, isOpen, onClose }: TrailerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Player Placeholder */}
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">🎬</span>
              </div>
              <p className="text-muted-foreground">Trailer would play here</p>
              <p className="text-sm text-muted-foreground">
                In a real app, this would embed the actual trailer video
              </p>
            </div>
          </div>

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
                <div className="flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">{item.rating}</span>
                  <span className="text-muted-foreground">/10</span>
                </div>

                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {getYearFromDate(item.releaseDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {item.type === 'movie' ? '120 min' : 'Series'}
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
                  {/* TODO: Add genre names from genreIds */}
                  <Badge variant="secondary">{item.type === 'movie' ? 'Movie' : 'TV Show'}</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{item.overview}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Available On</h3>
                <Badge variant="outline" className="capitalize">
                  TMDB
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
