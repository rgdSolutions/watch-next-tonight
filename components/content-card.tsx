'use client';

import { EyeOff, Play, Star } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGenreLookup } from '@/hooks/use-genre-lookup';
import { getTMDBImageUrl, getYearFromDate } from '@/lib/tmdb-utils';
import { cn } from '@/lib/utils';
import { MediaItem } from '@/types/tmdb';

interface ContentCardProps {
  item: MediaItem;
  onTrailerClick: (item: MediaItem) => void;
  onHide: (itemId: string) => void;
}

export function ContentCard({ item, onTrailerClick, onHide }: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { getGenreWithEmoji } = useGenreLookup(item.type);

  const handleHide = () => {
    onHide(item.id);
  };

  const handleOpenModal = () => {
    onTrailerClick(item);
  };

  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-card border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hide Button */}
      {isHovered && (
        <button
          onClick={handleHide}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm 
                    flex items-center justify-center text-white hover:bg-black/80 transition-all duration-200
                    disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Hide this content"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      )}

      <div className="flex gap-4 p-4">
        {/* Cover Art */}
        <div className="flex-shrink-0 cursor-pointer" onClick={handleOpenModal}>
          <div className="w-24 h-36 rounded-md overflow-hidden bg-muted">
            <img
              src={getTMDBImageUrl(item.posterPath, 'w500')}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Info */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Title and Type */}
          <div>
            <h4 className="font-semibold text-lg leading-tight mb-1 truncate">{item.title}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {item.type === 'movie' ? '🎬 Movie' : '📺 TV Show'}
              </Badge>
              <span>•</span>
              <span>{getYearFromDate(item.releaseDate)}</span>
            </div>
          </div>

          {/* Rating */}
          {typeof item.rating === 'number' && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{item.rating.toFixed(1)}</span>
              <span className="text-muted-foreground text-sm">/10</span>
            </div>
          )}

          {/* Genres */}
          <div className="flex flex-wrap gap-1">
            {item.genreIds?.slice(0, 3).map((genreId) => {
              const genre = getGenreWithEmoji(genreId);
              return genre ? (
                <Badge variant="secondary" className="text-xs" key={genreId}>
                  {genre.emoji}
                </Badge>
              ) : null;
            })}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">{item.overview}</p>

          {/* Watch Trailer Button */}
          <Button onClick={handleOpenModal} size="sm" className="gap-2 w-full mt-2">
            <Play className="w-4 h-4" />
            Watch Trailer
          </Button>
        </div>
      </div>
    </div>
  );
}
