'use client';

import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

import { RecencyOption } from '@/app/search/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobileScreenWidth } from '@/hooks/use-is-mobile-screen-width';
import { cn } from '@/lib/utils';

interface RecencyStepProps {
  onComplete: (recency: RecencyOption) => void;
  onBackToGenres: () => void;
}

export const RECENCY_OPTIONS = [
  {
    id: 'brand-new' as RecencyOption,
    name: 'Brand New',
    description: 'Published in the last 3 months',
    emoji: '🔥',
    timeframe: '3 months',
  },
  {
    id: 'very-recent' as RecencyOption,
    name: 'Very Recent',
    description: 'Published in the last 18 months',
    emoji: '✨',
    timeframe: '18 months',
  },
  {
    id: 'recent' as RecencyOption,
    name: 'Recent',
    description: 'Published in the last 5 years',
    emoji: '📅',
    timeframe: '5 years',
  },
  {
    id: 'contemporary' as RecencyOption,
    name: 'Contemporary',
    description: 'Published in the last 10 years',
    emoji: '🎬',
    timeframe: '10 years',
  },
  {
    id: 'any' as RecencyOption,
    name: 'Any Time Period',
    description: 'No restriction on publish date',
    emoji: '🌟',
    timeframe: 'All time',
  },
];

export function RecencyStep({ onComplete, onBackToGenres }: RecencyStepProps) {
  const isMobile = useIsMobileScreenWidth();
  const [selectedRecency, setSelectedRecency] = useState<RecencyOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = async (recency: RecencyOption) => {
    setSelectedRecency(recency);
    setIsSubmitting(true);

    // Small delay for visual feedback
    await new Promise((resolve) => setTimeout(resolve, 300));

    onComplete(recency);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="glass-panel rounded-2xl border-keyline shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center relative">
          {/* Back Button */}
          <div className="absolute left-6">
            <Button
              variant="ghost"
              onClick={onBackToGenres}
              className="gap-2 rounded-full text-muted-foreground hover:text-primary hover:bg-secondary/60"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          <div
            className={cn(
              'w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 glow-ring flex items-center justify-center',
              isMobile && 'w-6 h-6'
            )}
          >
            <Clock className={cn('w-8 h-8 text-primary', isMobile && 'w-6 h-6')} />
          </div>
          <CardTitle className="text-2xl mb-2 pt-4 font-display tracking-tight">
            How recent should the content be?
          </CardTitle>
          <p className="text-muted-foreground font-light">
            Choose your preferred time period for movies and TV shows
          </p>
        </CardHeader>

        <CardContent>
          <div className="relative space-y-3">
            {/* Luminous timeline rail */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[1.35rem] top-3 bottom-3 w-px bg-gradient-to-b from-transparent via-keyline-bright to-transparent"
            />
            {RECENCY_OPTIONS.map((option) => {
              const isSelected = selectedRecency === option.id;
              const isDisabled = isSubmitting && !isSelected;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  disabled={isSubmitting}
                  className={cn(
                    'relative w-full p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 text-left',
                    'hover:scale-[1.02] hover:shadow-md',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
                    'disabled:cursor-not-allowed',
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary glow-ring shadow-lg scale-[1.02]'
                      : 'border-keyline bg-secondary/30 hover:border-keyline-bright hover:bg-secondary/60',
                    isDisabled && 'opacity-50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={cn(
                          'w-3 h-3 rounded-full flex-shrink-0 border transition-all duration-300',
                          isSelected
                            ? 'aurora-bg border-transparent glow-ring'
                            : 'border-keyline-bright bg-background'
                        )}
                      />
                      <div className="text-2xl">{option.emoji}</div>
                      <div>
                        <div
                          className={cn(
                            'font-semibold text-base mb-1',
                            isSelected ? 'text-primary' : 'text-foreground'
                          )}
                        >
                          {option.name}
                        </div>
                        {!isMobile && (
                          <div
                            className={cn(
                              'text-sm',
                              isSelected ? 'text-primary/80' : 'text-muted-foreground'
                            )}
                          >
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 opacity-60" />
                      <span
                        className={cn(
                          'text-sm font-medium',
                          isSelected ? 'text-primary/80' : 'text-muted-foreground'
                        )}
                      >
                        {option.timeframe}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
