'use client';

import { Filter, Loader2, Search, Star } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { useUnifiedGenres } from '@/hooks/use-unified-genres';
import { FLAG_EMOJIS } from '@/lib/country-codes';
import { GENRE_EMOJIS } from '@/lib/unified-genres';

import { RECENCY_OPTIONS } from './recency-step';

interface UserPreferences {
  country: string;
  genres: string[];
  recency: string;
}

interface LoadingScreenProps {
  preferences: UserPreferences;
}

export function LoadingScreen({ preferences }: LoadingScreenProps) {
  const { genres } = useUnifiedGenres();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* Loading Animation */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>

            {/* Loading Text */}
            <h2 className="text-2xl font-bold mb-2">Finding Your Perfect Match</h2>
            <p className="text-muted-foreground mb-6">
              Searching through thousands of movies and TV shows...
            </p>

            {/* Loading Steps */}
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Search className="w-4 h-4 text-primary" />
                <span className="text-sm">Searching streaming platforms</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Filter className="w-4 h-4 text-primary" />
                <span className="text-sm">Applying your preferences</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm">Sorting by ratings</span>
              </div>
            </div>

            {/* Preferences Summary */}
            <div className="mt-6 p-4 rounded-lg bg-muted/30 text-sm text-left">
              <div className="font-medium mb-2">Your Preferences:</div>
              <div className="space-y-1 text-muted-foreground">
                <div>📍 Country: {FLAG_EMOJIS[preferences.country]}</div>
                <div>
                  🎭 Genres: {preferences.genres.map((genre) => GENRE_EMOJIS[genre]).join(' ')}
                </div>
                <div>
                  📅 Recency:{' '}
                  {RECENCY_OPTIONS.find((option) => option.id === preferences.recency)?.emoji}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
