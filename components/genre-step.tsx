'use client';

import { Check, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobileScreenWidth } from '@/hooks/use-is-mobile-screen-width';
import { useUnifiedGenres } from '@/hooks/use-unified-genres';
import { cn } from '@/lib/utils';

interface GenreStepProps {
  onComplete: (genres: string[]) => void;
}

export function GenreStep({ onComplete }: GenreStepProps) {
  const isMobile = useIsMobileScreenWidth();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isAnyGenre, setIsAnyGenre] = useState(false);
  const { genres, isLoading, error } = useUnifiedGenres();

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
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleContinue = () => {
    if (isAnyGenre) {
      onComplete([]);
    } else {
      onComplete(selectedGenres);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canContinue = isAnyGenre || selectedGenres.length > 0;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="glass-panel rounded-2xl border-keyline shadow-xl bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading genres...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || genres.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="glass-panel rounded-2xl border-keyline shadow-xl bg-card/50 backdrop-blur-sm">
          <CardContent className="text-center py-16">
            <p className="text-destructive mb-4">Failed to load genres.</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="rounded-full border-keyline-bright bg-secondary/30 hover:bg-secondary/60"
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="glass-panel rounded-2xl border-keyline shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          {!isMobile && (
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 glow-ring flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          )}
          <CardTitle className="text-2xl mb-2 font-display tracking-tight">
            What genres are you in the mood for?
          </CardTitle>
          {!isMobile && (
            <p className="text-muted-foreground font-light">
              Select one or more genres, or choose &quot;Any Genre&quot; for surprise
              recommendations
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-6 px-2 sm:px-6">
          {/* Any Genre Option */}
          <div className="flex flex-row justify-center items-center">
            <Button
              variant={isAnyGenre ? 'default' : 'outline'}
              onClick={selectAnyGenre}
              className={cn(
                'h-12 px-8 text-lg font-medium rounded-full transition-all duration-300',
                isAnyGenre
                  ? 'aurora-bg border-0 glow-ring shadow-lg scale-105 font-semibold'
                  : 'border-keyline-bright bg-secondary/30 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-secondary/60 hover:text-primary'
              )}
            >
              {isAnyGenre && <Check className="w-5 h-5 mr-2" />}
              🎲 Any Genre - Surprise Me!
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-keyline-bright" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="rounded-full bg-secondary/70 backdrop-blur px-3 py-0.5 tracking-widest text-muted-foreground">
                Or select specific genres
              </span>
            </div>
          </div>

          {/* Genre Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {genres
              .filter((genre) => genre.id !== 'actionadventure') // Hide "Action & Adventure" since we show Action and Adventure separately
              .map((genre) => {
                const isSelected = selectedGenres.includes(genre.id);
                return (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={cn(
                      'flex w-full items-center justify-center gap-2 min-h-[48px] rounded-full border backdrop-blur-sm',
                      'transition-all duration-300',
                      'hover:-translate-y-0.5 hover:shadow-md hover:border-keyline-bright hover:bg-secondary/70',
                      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
                      isMobile ? 'px-2 py-1.5' : 'px-3 py-2',
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary glow-ring shadow-lg'
                        : 'border-keyline bg-secondary/50 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="text-lg leading-none">{genre.emoji}</div>
                      <div className="text-xs sm:text-sm font-medium">{genre.name}</div>
                      {isSelected && !isAnyGenre && <Check className="w-4 h-4 flex-shrink-0" />}
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Continue Button */}
          <div className="text-center pt-4">
            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              size="lg"
              className={cn(
                'px-8 h-12 text-lg rounded-full transition-all duration-300',
                canContinue &&
                  'aurora-bg border-0 font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl'
              )}
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
