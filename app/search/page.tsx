'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ContentDisplayWithQuery } from '@/components/content-display-with-query';
import { GenreStep } from '@/components/genre-step';
import { Header } from '@/components/header';
import { LoadingScreen } from '@/components/loading-screen';
import { RecencyStep } from '@/components/recency-step';
import { useIsMobileScreenWidth } from '@/hooks/use-is-mobile-screen-width';
import { tmdbPrefetch } from '@/hooks/use-tmdb';

export type RecencyOption = 'brand-new' | 'very-recent' | 'recent' | 'contemporary' | 'any';

interface UserPreferences {
  country: string;
  genres: string[];
  recency: RecencyOption;
}

type Step = 'genres' | 'recency' | 'results';

export default function SearchPage() {
  const isMobile = useIsMobileScreenWidth();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<Step>('genres');
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({});
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Prefetch genre data on mount
  useEffect(() => {
    tmdbPrefetch.movieGenres(queryClient);
    tmdbPrefetch.tvGenres(queryClient);
  }, [queryClient]);

  // Get country from query param, localStorage, or default to US
  useEffect(() => {
    const countryFromParam = searchParams.get('country');
    const countryFromStorage =
      typeof window !== 'undefined' ? localStorage.getItem('userCountry') : null;
    const country = countryFromParam || countryFromStorage || 'US';

    setPreferences((prev) => ({ ...prev, country }));
  }, [searchParams]);

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

  if (isLoading) {
    return <LoadingScreen preferences={preferences as UserPreferences} />;
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-8xl">
        {/* Header */}
        <Header />

        {/* Step Components */}
        {currentStep === 'genres' && <GenreStep onComplete={handleGenresComplete} />}

        {currentStep === 'recency' && (
          <RecencyStep onComplete={handleRecencyComplete} onBackToGenres={handleBackToGenres} />
        )}

        {currentStep === 'results' && (
          <ContentDisplayWithQuery
            preferences={preferences as UserPreferences}
            onBackToPreferences={handleBackToGenres}
          />
        )}
      </div>
    </div>
  );
}
