import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MediaItem, MediaType } from '@/types/tmdb';

import { ContentCard } from '../content-card';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Mock the hooks and utilities
vi.mock('@/hooks/use-genre-lookup', () => ({
  useGenreLookup: () => ({
    getGenreWithEmoji: (id: number) => {
      const genres: Record<number, { emoji: string; name: string }> = {
        28: { emoji: '💥', name: 'Action' },
        35: { emoji: '😂', name: 'Comedy' },
        18: { emoji: '🎭', name: 'Drama' },
      };
      return genres[id] || null;
    },
  }),
}));

vi.mock('@/lib/tmdb-utils', () => ({
  getTMDBImageUrl: (path: string) => `https://image.tmdb.org/t/p/w500${path}`,
  getYearFromDate: (date: string) => new Date(date).getFullYear().toString(),
}));

const mockItem: MediaItem = {
  id: '123',
  tmdbId: 123,
  title: 'Test Movie',
  type: MediaType.MOVIE,
  posterPath: '/test-poster.jpg',
  backdropPath: '/test-backdrop.jpg',
  releaseDate: '2023-05-15',
  rating: 8.5,
  genreIds: [28, 35, 18],
  overview: 'This is a test movie overview that is quite long and should be truncated in the UI.',
  popularity: 100,
  voteCount: 1000,
  originalLanguage: 'en',
};

const mockTVItem: MediaItem = {
  ...mockItem,
  id: '456',
  tmdbId: 456,
  title: 'Test TV Show',
  type: MediaType.TV,
};

describe('ContentCard', () => {
  const mockOnTrailerClick = vi.fn();
  const mockOnHide = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders movie content correctly', () => {
    render(<ContentCard item={mockItem} onTrailerClick={mockOnTrailerClick} onHide={mockOnHide} />);

    // Check title
    expect(screen.getByText('Test Movie')).toBeInTheDocument();

    // Check type badge
    expect(screen.getByText('🎬 Movie')).toBeInTheDocument();

    // Check year
    expect(screen.getByText('2023')).toBeInTheDocument();

    // Check rating
    expect(screen.getByText('8.5')).toBeInTheDocument();
    expect(screen.getByText('/10')).toBeInTheDocument();

    // Check overview
    expect(screen.getByText(/This is a test movie overview/)).toBeInTheDocument();

    // Check poster image
    const img = screen.getByAltText(/Test Movie poster/) as HTMLImageElement;
    expect(img.src).toBe('https://image.tmdb.org/t/p/w500/test-poster.jpg');

    // Check Watch Trailer button
    expect(screen.getByText('Watch Trailer')).toBeInTheDocument();
  });

  it('renders TV show content correctly', () => {
    render(
      <ContentCard item={mockTVItem} onTrailerClick={mockOnTrailerClick} onHide={mockOnHide} />
    );

    expect(screen.getByText('Test TV Show')).toBeInTheDocument();
    expect(screen.getByText('📺 TV Show')).toBeInTheDocument();
  });

  it('shows hide button on hover', () => {
    render(<ContentCard item={mockItem} onTrailerClick={mockOnTrailerClick} onHide={mockOnHide} />);

    // Initially, hide button should not be visible
    expect(screen.queryByLabelText('Hide this content')).not.toBeInTheDocument();

    // Hover over the card
    const card = screen.getByText('Test Movie').closest('.group');
    fireEvent.mouseEnter(card!);

    // Hide button should now be visible
    expect(screen.getByLabelText('Hide this content')).toBeInTheDocument();

    // Mouse leave
    fireEvent.mouseLeave(card!);

    // Hide button should be hidden again
    expect(screen.queryByLabelText('Hide this content')).not.toBeInTheDocument();
  });

  it('calls onHide when hide button is clicked', () => {
    render(<ContentCard item={mockItem} onTrailerClick={mockOnTrailerClick} onHide={mockOnHide} />);

    // Hover to show the hide button
    const card = screen.getByText('Test Movie').closest('.group');
    fireEvent.mouseEnter(card!);

    // Click the hide button
    const hideButton = screen.getByLabelText('Hide this content');
    fireEvent.click(hideButton);

    expect(mockOnHide).toHaveBeenCalledWith('123');
    expect(mockOnHide).toHaveBeenCalledTimes(1);
  });

  it('calls onTrailerClick when Watch Trailer button is clicked', () => {
    render(<ContentCard item={mockItem} onTrailerClick={mockOnTrailerClick} onHide={mockOnHide} />);

    const trailerButton = screen.getByText('Watch Trailer');
    fireEvent.click(trailerButton);

    expect(mockOnTrailerClick).toHaveBeenCalledWith(mockItem);
    expect(mockOnTrailerClick).toHaveBeenCalledTimes(1);
  });

  it('displays genre emojis correctly', () => {
    render(<ContentCard item={mockItem} onTrailerClick={mockOnTrailerClick} onHide={mockOnHide} />);

    // Should show up to 3 genre emojis
    expect(screen.getByText('💥')).toBeInTheDocument();
    expect(screen.getByText('😂')).toBeInTheDocument();
    expect(screen.getByText('🎭')).toBeInTheDocument();
  });

  it('handles items without rating', () => {
    const itemWithoutRating = { ...mockItem, rating: null };
    render(
      <ContentCard
        item={itemWithoutRating}
        onTrailerClick={mockOnTrailerClick}
        onHide={mockOnHide}
      />
    );

    // Rating section should not be rendered when rating is 0
    expect(screen.queryByText('/10')).not.toBeInTheDocument();
  });

  it('handles items with only a few genres', () => {
    const itemWithFewGenres = { ...mockItem, genreIds: [28] };
    render(
      <ContentCard
        item={itemWithFewGenres}
        onTrailerClick={mockOnTrailerClick}
        onHide={mockOnHide}
      />
    );

    expect(screen.getByText('💥')).toBeInTheDocument();
    expect(screen.queryByText('😂')).not.toBeInTheDocument();
  });

  it('handles items with no genres', () => {
    const itemWithNoGenres = { ...mockItem, genreIds: [] };
    render(
      <ContentCard
        item={itemWithNoGenres}
        onTrailerClick={mockOnTrailerClick}
        onHide={mockOnHide}
      />
    );

    // No genre badges should be rendered
    expect(screen.queryByText('💥')).not.toBeInTheDocument();
    expect(screen.queryByText('😂')).not.toBeInTheDocument();
    expect(screen.queryByText('🎭')).not.toBeInTheDocument();
  });

  it('handles unknown genre IDs gracefully', () => {
    const itemWithUnknownGenres = { ...mockItem, genreIds: [999, 28] };
    render(
      <ContentCard
        item={itemWithUnknownGenres}
        onTrailerClick={mockOnTrailerClick}
        onHide={mockOnHide}
      />
    );

    // Should only show the known genre
    expect(screen.getByText('💥')).toBeInTheDocument();
  });
});
