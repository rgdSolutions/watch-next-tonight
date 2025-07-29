'use client';

import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ContentDisplayWithQuery } from '@/components/content-display-with-query';
import { GenreStep } from '@/components/genre-step';
import { LoadingScreen } from '@/components/loading-screen';
import { LocationStep } from '@/components/location-step';
import { RecencyStep } from '@/components/recency-step';
import { Button } from '@/components/ui/button';
import { tmdbPrefetch } from '@/hooks/use-tmdb';

export type RecencyOption =
  | 'brand-new'
  | 'very-recent'
  | 'recent'
  | 'contemporary'
  | 'classic'
  | 'any';

interface UserPreferences {
  country: string;
  genres: string[];
  recency: RecencyOption;
}

type Step = 'location' | 'genres' | 'recency' | 'results';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('location');
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({});
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Prefetch genre data on mount
  useEffect(() => {
    tmdbPrefetch.movieGenres(queryClient);
    tmdbPrefetch.tvGenres(queryClient);
  }, [queryClient]);

  const handleLocationComplete = (country: string) => {
    console.log('\n~~~country', country);
    setPreferences((prev) => ({ ...prev, country }));
    setCurrentStep('genres');
  };

  const handleGenresComplete = (genres: string[]) => {
    setPreferences((prev) => ({ ...prev, genres }));
    setCurrentStep('recency');
  };

  const handleRecencyComplete = async (recency: RecencyOption) => {
    setPreferences((prev) => ({ ...prev, recency }));
    setIsLoading(true);

    // Optional: Prefetch trending content while showing loading screen
    await tmdbPrefetch.trending(queryClient);

    // Short delay for smooth transition
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setCurrentStep('results');
  };

  const handleBackToGenres = () => {
    setCurrentStep('genres');
  };

  const handleBackToRecency = () => {
    setCurrentStep('recency');
  };

  if (isLoading) {
    return <LoadingScreen preferences={preferences as UserPreferences} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold tracking-tight mb-2
                        md:text-5xl
                        lg:text-6xl"
          >
            Watch Next Tonight
          </h1>
          <p
            className="text-muted-foreground text-lg
                       md:text-xl"
          >
            Find your perfect movie or show in just a few clicks
          </p>
        </div>

        {/* Back Button */}
        {(currentStep === 'recency' || currentStep === 'results') && (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={currentStep === 'recency' ? handleBackToGenres : handleBackToRecency}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        )}

        {/* Step Components */}
        {currentStep === 'location' && <LocationStep onComplete={handleLocationComplete} />}

        {currentStep === 'genres' && <GenreStep onComplete={handleGenresComplete} />}

        {currentStep === 'recency' && <RecencyStep onComplete={handleRecencyComplete} />}

        {currentStep === 'results' && (
          <ContentDisplayWithQuery
            preferences={preferences as UserPreferences}
            onBackToPreferences={handleBackToRecency}
          />
        )}
      </div>
    </div>
  );
}
