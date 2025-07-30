import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LoadingScreen } from '../loading-screen';

// Mock the hooks and constants
vi.mock('@/hooks/use-unified-genres', () => ({
  useUnifiedGenres: () => ({
    genres: [
      { id: 'action', name: 'Action' },
      { id: 'comedy', name: 'Comedy' },
      { id: 'drama', name: 'Drama' },
    ],
  }),
}));

vi.mock('@/lib/country-codes', () => ({
  FLAG_EMOJIS: {
    US: '🇺🇸',
    GB: '🇬🇧',
    CA: '🇨🇦',
    AU: '🇦🇺',
    JP: '🇯🇵',
    FR: '🇫🇷',
    DE: '🇩🇪',
    ES: '🇪🇸',
    IT: '🇮🇹',
    BR: '🇧🇷',
  },
}));

vi.mock('@/lib/unified-genres', () => ({
  GENRE_EMOJIS: {
    action: '💥',
    comedy: '😂',
    drama: '🎭',
    horror: '😱',
    romance: '💕',
    'sci-fi': '🚀',
    thriller: '😰',
    animation: '🎨',
  },
}));

vi.mock('../recency-step', () => ({
  RECENCY_OPTIONS: [
    { id: 'brand-new', emoji: '🆕', label: 'Brand New', description: 'Released in the last month' },
    {
      id: 'very-recent',
      emoji: '🌟',
      label: 'Very Recent',
      description: 'Released in the last 3 months',
    },
    { id: 'recent', emoji: '📅', label: 'Recent', description: 'Released in the last 6 months' },
    {
      id: 'contemporary',
      emoji: '🎬',
      label: 'Contemporary',
      description: 'Released in the last 2 years',
    },
    { id: 'any', emoji: '∞', label: 'Any Time', description: 'No time restrictions' },
  ],
}));

describe('LoadingScreen', () => {
  const defaultPreferences = {
    country: 'US',
    genres: ['action', 'comedy'],
    recency: 'recent',
  };

  it('should render loading animation and text', () => {
    render(<LoadingScreen preferences={defaultPreferences} />);

    // Check for loading text
    expect(screen.getByText('Finding Your Perfect Match')).toBeInTheDocument();
    expect(
      screen.getByText('Searching through thousands of movies and TV shows...')
    ).toBeInTheDocument();
  });

  it('should display loading steps', () => {
    render(<LoadingScreen preferences={defaultPreferences} />);

    // Check for loading steps
    expect(screen.getByText('Searching streaming platforms')).toBeInTheDocument();
    expect(screen.getByText('Applying your preferences')).toBeInTheDocument();
    expect(screen.getByText('Sorting by ratings')).toBeInTheDocument();
  });

  it('should display user preferences with correct flag emoji', () => {
    render(<LoadingScreen preferences={defaultPreferences} />);

    // Check preferences header
    expect(screen.getByText('Your Preferences:')).toBeInTheDocument();

    // Check country with flag
    expect(screen.getByText(/Country:/)).toBeInTheDocument();
    expect(screen.getByText(/🇺🇸/)).toBeInTheDocument();
  });

  it('should display genres with correct emojis', () => {
    render(<LoadingScreen preferences={defaultPreferences} />);

    // Check genres with emojis
    expect(screen.getByText(/Genres:/)).toBeInTheDocument();
    expect(screen.getByText(/💥 😂/)).toBeInTheDocument();
  });

  it('should display recency with correct emoji', () => {
    render(<LoadingScreen preferences={defaultPreferences} />);

    // Check recency with emoji
    expect(screen.getByText(/Recency:/)).toBeInTheDocument();
    expect(screen.getByText(/📅/)).toBeInTheDocument();
  });

  it('should handle different country codes', () => {
    const ukPreferences = {
      ...defaultPreferences,
      country: 'GB',
    };

    render(<LoadingScreen preferences={ukPreferences} />);
    expect(screen.getByText(/🇬🇧/)).toBeInTheDocument();
  });

  it('should handle single genre', () => {
    const singleGenrePreferences = {
      ...defaultPreferences,
      genres: ['drama'],
    };

    render(<LoadingScreen preferences={singleGenrePreferences} />);
    expect(screen.getByText(/🎭/)).toBeInTheDocument();
  });

  it('should handle multiple genres', () => {
    const multiGenrePreferences = {
      ...defaultPreferences,
      genres: ['action', 'comedy', 'drama'],
    };

    render(<LoadingScreen preferences={multiGenrePreferences} />);
    expect(screen.getByText(/💥 😂 🎭/)).toBeInTheDocument();
  });

  it('should handle different recency options', () => {
    const brandNewPreferences = {
      ...defaultPreferences,
      recency: 'brand-new',
    };

    render(<LoadingScreen preferences={brandNewPreferences} />);
    expect(screen.getByText(/🆕/)).toBeInTheDocument();
  });

  it('should handle unknown country gracefully', () => {
    const unknownCountryPreferences = {
      ...defaultPreferences,
      country: 'XX', // Unknown country code
    };

    render(<LoadingScreen preferences={unknownCountryPreferences} />);
    // Should still render without crashing
    expect(screen.getByText(/Country:/)).toBeInTheDocument();
  });

  it('should handle unknown genre gracefully', () => {
    const unknownGenrePreferences = {
      ...defaultPreferences,
      genres: ['unknown-genre'],
    };

    render(<LoadingScreen preferences={unknownGenrePreferences} />);
    // Should still render without crashing
    expect(screen.getByText(/Genres:/)).toBeInTheDocument();
  });

  it('should handle empty genres array', () => {
    const noGenrePreferences = {
      ...defaultPreferences,
      genres: [],
    };

    render(<LoadingScreen preferences={noGenrePreferences} />);
    expect(screen.getByText(/Genres:/)).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    const { container } = render(<LoadingScreen preferences={defaultPreferences} />);

    // Check for main container styling
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('min-h-screen');
    expect(mainDiv).toHaveClass('bg-gradient-to-br');
    expect(mainDiv).toHaveClass('flex');
    expect(mainDiv).toHaveClass('items-center');
    expect(mainDiv).toHaveClass('justify-center');
  });

  it('should render loading spinner with animation', () => {
    render(<LoadingScreen preferences={defaultPreferences} />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('should render card with proper backdrop blur', () => {
    render(<LoadingScreen preferences={defaultPreferences} />);

    const card = screen.getByTestId('loading-card');
    expect(card).toHaveClass('backdrop-blur-sm');
    expect(card).toHaveClass('bg-card/50');
  });

  it('should handle all recency options', () => {
    const recencyOptions = ['brand-new', 'very-recent', 'recent', 'contemporary', 'any'];
    const expectedEmojis = ['🆕', '🌟', '📅', '🎬', '∞'];

    recencyOptions.forEach((recency, index) => {
      const { unmount } = render(
        <LoadingScreen preferences={{ ...defaultPreferences, recency }} />
      );
      expect(screen.getByText(new RegExp(expectedEmojis[index]))).toBeInTheDocument();
      unmount();
    });
  });

  it('should handle preferences from different continents', () => {
    const continentTests = [
      { country: 'JP', emoji: '🇯🇵' }, // Asia
      { country: 'FR', emoji: '🇫🇷' }, // Europe
      { country: 'BR', emoji: '🇧🇷' }, // South America
      { country: 'AU', emoji: '🇦🇺' }, // Oceania
      { country: 'CA', emoji: '🇨🇦' }, // North America
    ];

    continentTests.forEach(({ country, emoji }) => {
      const { unmount } = render(
        <LoadingScreen preferences={{ ...defaultPreferences, country }} />
      );
      expect(screen.getByText(new RegExp(emoji))).toBeInTheDocument();
      unmount();
    });
  });
});
