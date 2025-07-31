import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
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
        with_watch_providers: expect.any(String),
        watch_region: 'US',
      }),
      expect.any(Object)
    );
  });

  it('should toggle include rent/buy checkbox', async () => {
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

    const checkbox = screen.getByRole('checkbox', {
      name: /include content available for rent or purchase/i,
    });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    // When checked, should not include with_watch_providers
    await waitFor(() => {
      const lastCall =
        mockUseDiscoverMovies.mock.calls[mockUseDiscoverMovies.mock.calls.length - 1];
      expect(lastCall?.[0]).not.toHaveProperty('with_watch_providers');
    });
  });

  it('should use provider filtering from streaming providers', () => {
    const getProviderSpy = vi.spyOn(streamingProviders, 'getProviderIdsForPlatform');

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

    // Should call getProviderIdsForPlatform with default 'all'
    expect(getProviderSpy).toHaveBeenCalledWith('all');
  });

  it('should show streaming-only message when rent/buy is disabled', () => {
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

    expect(
      screen.getByText(/showing only content available on streaming platforms in US/i)
    ).toBeInTheDocument();
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

    // With streaming only
    expect(
      screen.getByText(/no content found that's available on streaming platforms/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/try enabling "include content available for rent or purchase"/i)
    ).toBeInTheDocument();

    // Toggle rent/buy
    const checkbox = screen.getByRole('checkbox', {
      name: /include content available for rent or purchase/i,
    });
    await user.click(checkbox);

    // Message should change
    await waitFor(() => {
      expect(screen.getByText(/no content found matching your preferences/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/try enabling "include content available for rent or purchase"/i)
      ).not.toBeInTheDocument();
    });
  });

  it('should show Include Rent/Buy button in empty state', async () => {
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

    const includeRentBuyButton = screen.getByRole('button', { name: /include rent\/buy/i });
    expect(includeRentBuyButton).toBeInTheDocument();

    await user.click(includeRentBuyButton);

    // Checkbox should be checked
    const checkbox = screen.getByRole('checkbox', {
      name: /include content available for rent or purchase/i,
    });
    expect(checkbox).toBeChecked();

    // Button should disappear
    expect(screen.queryByRole('button', { name: /include rent\/buy/i })).not.toBeInTheDocument();
  });
});
