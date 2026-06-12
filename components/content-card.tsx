'use client';

import { EyeOff, Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGenreLookup } from '@/hooks/use-genre-lookup';
import { getTMDBImageUrl, getYearFromDate } from '@/lib/tmdb-utils';
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
      className="group relative overflow-hidden glass-panel border-keyline transition-all duration-300 hover:-translate-y-1 hover:border-keyline-bright hover:shadow-[0_22px_50px_-18px_rgba(0,0,0,0.6),0_0_30px_-10px_var(--glow)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hide Button */}
      {isHovered && (
        <button
          onClick={handleHide}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm border border-keyline
                    flex items-center justify-center text-foreground hover:bg-background/90 hover:border-keyline-bright transition-all duration-200
                    disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Hide this content"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      )}

      <div className="flex gap-4 p-4">
        {/* Cover Art */}
        <div className="flex-shrink-0 cursor-pointer" onClick={handleOpenModal}>
          <div className="relative w-24 h-36 rounded-md overflow-hidden bg-muted ring-1 ring-keyline">
            <Image
              src={getTMDBImageUrl(item.posterPath, 'w500')}
              alt={`${item.title} poster - ${item.type === 'movie' ? 'Movie' : 'TV Show'} released in ${getYearFromDate(item.releaseDate)}`}
              fill
              sizes="(max-width: 768px) 96px, 96px"
              className="object-cover"
              loading="lazy"
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
            <div className="flex items-center gap-2">
              <div
                className="grid h-11 w-11 flex-none place-items-center rounded-full shadow-[0_0_16px_-4px_var(--glow)]"
                style={{
                  background: `conic-gradient(from -90deg, hsl(var(--primary)) 0%, hsl(var(--accent)) ${item.rating * 10}%, hsl(var(--muted)) ${item.rating * 10}% 100%)`,
                }}
              >
                <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-card text-xs font-bold text-card-foreground">
                  {item.rating.toFixed(1)}
                </span>
              </div>
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
          <Button
            onClick={handleOpenModal}
            size="sm"
            className="gap-2 w-full mt-2 rounded-full aurora-bg border-0 font-semibold shadow-[0_8px_22px_-6px_var(--glow)] transition-all hover:opacity-90 hover:shadow-[0_10px_26px_-4px_var(--glow)]"
          >
            <Play className="w-4 h-4" />
            Watch Trailer
          </Button>
        </div>
      </div>
    </div>
  );
}
