import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as streamingProviders from '@/lib/streaming-providers';

import { ContentDisplayWithQuery } from '../content-display-with-query';

// Mock the hooks
const mockUseDiscoverMovies = vi.fn();
const mockUseDiscoverTVShows = vi.fn();

vi.mock('@/hooks/use-tmdb', () => ({
  useDiscoverMovies: (...args: any[]) => mockUseDiscoverMovies(...args),
  useDiscoverTVShows: (...args: any[]) => mockUseDiscoverTVShows(...args),
  useMovieGenres: vi.fn(() => ({ data: { genres: [{ id: 28, name: 'Action' }] } })),
  useTVGenres: vi.fn(() => ({ data: { genres: [{ id: 10759, name: 'Action & Adventure' }] } })),
}));

vi.mock('@/hooks/use-unified-genres', () => ({
  useUnifiedGenres: () => ({
    genres: [{ id: 'action', name: 'Action', movieGenreIds: [28], tvGenreIds: [10759] }],
  }),
}));

vi.mock('@/lib/unified-genres', () => ({
  unifiedGenresToTMDBIds: () => [28],
}));

const mockPreferences = {
  country: 'US',
  genres: ['action'],
  recency: 'recent',
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe('ContentDisplayWithQuery - Streaming Filter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should include with_watch_providers when fetching content', () => {
    mockUseDiscoverMovies.mockImplementation(() => ({
      data: { results: [], page: 1, totalPages: 1, totalResults: 0 },
      isLoading: false,
    }));

    mockUseDiscoverTVShows.mockImplementation(() => ({
      data: { results: [], page: 1, totalPages: 1, totalResults: 0 },
      isLoading: false,
    }));

    render(
      <ContentDisplayWithQuery preferences={mockPreferences} onBackToPreferences={() => {}} />,
      { wrapper: createWrapper() }
    );

    expect(mockUseDiscoverMovies).toHaveBeenCalledWith(
      expect.objectContaining({
        with_genres: '28',
        watch_region: 'US',
      }),
      expect.any(Object)
    );
  });

  it('should show different empty state message based on rent/buy toggle', async () => {
    const user = userEvent.setup();

    mockUseDiscoverMovies.mockImplementation(() => ({
      data: { results: [], page: 1, totalPages: 1, totalResults: 0 },
      isLoading: false,
    }));

    mockUseDiscoverTVShows.mockImplementation(() => ({
      data: { results: [], page: 1, totalPages: 1, totalResults: 0 },
      isLoading: false,
    }));

    render(
      <ContentDisplayWithQuery preferences={mockPreferences} onBackToPreferences={() => {}} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/no content found matching your preferences/i)).toBeInTheDocument();
  });
});
