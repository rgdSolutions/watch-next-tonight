'use client';

import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';

import { RecencyOption } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RecencyStepProps {
  onComplete: (recency: RecencyOption) => void;
  onBackToGenres: () => void;
}

const RECENCY_OPTIONS = [
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
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center relative">
          {/* Back Button */}
          <div className="absolute left-6">
            <Button variant="ghost" onClick={onBackToGenres} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl mb-2 pt-4">How recent should the content be?</CardTitle>
          <p className="text-muted-foreground">
            Choose your preferred time period for movies and TV shows
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {RECENCY_OPTIONS.map((option) => {
            const isSelected = selectedRecency === option.id;
            const isDisabled = isSubmitting && !isSelected;

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={isSubmitting}
                className={cn(
                  'w-full p-4 rounded-lg border-2 transition-all duration-200 text-left',
                  'hover:scale-[1.02] hover:shadow-md',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  'disabled:cursor-not-allowed',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground shadow-lg scale-[1.02]'
                    : 'border-border bg-background hover:border-primary/50',
                  isDisabled && 'opacity-50'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{option.emoji}</div>
                    <div>
                      <div className="font-semibold text-base mb-1">{option.name}</div>
                      <div
                        className={cn(
                          'text-sm',
                          isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
                        )}
                      >
                        {option.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 opacity-60" />
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
                      )}
                    >
                      {option.timeframe}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
