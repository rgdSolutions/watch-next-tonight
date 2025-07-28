'use client';

import { Check, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GenreStepProps {
  onComplete: (genres: string[]) => void;
}

const POPULAR_GENRES = [
  { id: 'action', name: 'Action', emoji: '🎬' },
  { id: 'comedy', name: 'Comedy', emoji: '😂' },
  { id: 'drama', name: 'Drama', emoji: '🎭' },
  { id: 'horror', name: 'Horror', emoji: '👻' },
  { id: 'thriller', name: 'Thriller', emoji: '🔪' },
  { id: 'romance', name: 'Romance', emoji: '💕' },
  { id: 'sci-fi', name: 'Sci-Fi', emoji: '🚀' },
  { id: 'fantasy', name: 'Fantasy', emoji: '🧙‍♂️' },
  { id: 'documentary', name: 'Documentary', emoji: '📹' },
  { id: 'animation', name: 'Animation', emoji: '🎨' },
  { id: 'mystery', name: 'Mystery', emoji: '🔍' },
  { id: 'crime', name: 'Crime', emoji: '🕵️' },
  { id: 'family', name: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { id: 'adventure', name: 'Adventure', emoji: '🗺️' },
  { id: 'music', name: 'Music', emoji: '🎵' },
  { id: 'war', name: 'War', emoji: '⚔️' },
];

export function GenreStep({ onComplete }: GenreStepProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isAnyGenre, setIsAnyGenre] = useState(false);

  const toggleGenre = (genreId: string) => {
    if (isAnyGenre) {
      setIsAnyGenre(false);
    }

    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const selectAnyGenre = () => {
    setIsAnyGenre(true);
    setSelectedGenres([]);
  };

  const handleContinue = () => {
    if (isAnyGenre) {
      onComplete(['any']);
    } else {
      onComplete(selectedGenres);
    }
  };

  const canContinue = isAnyGenre || selectedGenres.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl mb-2">What genres are you in the mood for?</CardTitle>
          <p className="text-muted-foreground">
            Select one or more genres, or choose &quot;Any Genre&quot; for surprise recommendations
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Any Genre Option */}
          <div className="text-center">
            <Button
              variant={isAnyGenre ? 'default' : 'outline'}
              onClick={selectAnyGenre}
              className={cn(
                'h-12 px-8 text-lg font-medium transition-all duration-200',
                isAnyGenre && 'shadow-lg scale-105'
              )}
            >
              {isAnyGenre && <Check className="w-5 h-5 mr-2" />}
              🎲 Any Genre - Surprise Me!
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or select specific genres
              </span>
            </div>
          </div>

          {/* Genre Grid */}
          <div
            className="grid grid-cols-2 gap-3
                         sm:grid-cols-3
                         md:grid-cols-4
                         lg:grid-cols-5"
          >
            {POPULAR_GENRES.map((genre) => {
              const isSelected = selectedGenres.includes(genre.id);
              return (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={cn(
                    'p-3 rounded-lg border-2 transition-all duration-200 text-left',
                    'hover:scale-105 hover:shadow-md',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground shadow-lg scale-105'
                      : 'border-border bg-background hover:border-primary/50',
                    isAnyGenre && 'opacity-50 cursor-not-allowed'
                  )}
                  disabled={isAnyGenre}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg mb-1">{genre.emoji}</div>
                      <div className="text-sm font-medium">{genre.name}</div>
                    </div>
                    {isSelected && !isAnyGenre && <Check className="w-4 h-4 flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Count */}
          {selectedGenres.length > 0 && !isAnyGenre && (
            <div className="text-center">
              <Badge variant="secondary" className="px-4 py-2">
                {selectedGenres.length} genre{selectedGenres.length === 1 ? '' : 's'} selected
              </Badge>
            </div>
          )}

          {/* Continue Button */}
          <div className="text-center pt-4">
            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              size="lg"
              className="px-8 h-12 text-lg"
            >
              Continue
              {canContinue && (
                <span className="ml-2">{isAnyGenre ? '🎲' : `(${selectedGenres.length})`}</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
