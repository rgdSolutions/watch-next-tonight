import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { GenreStep } from '../genre-step';

// Mock the useUnifiedGenres hook
vi.mock('@/hooks/use-unified-genres', () => ({
  useUnifiedGenres: () => ({
    genres: [
      { id: 'action', name: 'Action', emoji: '🎬' },
      { id: 'adventure', name: 'Adventure', emoji: '🗺️' },
      { id: 'actionadventure', name: 'Action & Adventure', emoji: '🎬' },
      { id: 'comedy', name: 'Comedy', emoji: '😄' },
      { id: 'drama', name: 'Drama', emoji: '🎭' },
    ],
    isLoading: false,
    error: null,
  }),
}));

describe('GenreStep - Action & Adventure filtering', () => {
  it('should not display "Action & Adventure" genre', () => {
    render(<GenreStep onComplete={vi.fn()} />);

    // Should show Action and Adventure separately
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Adventure')).toBeInTheDocument();

    // Should NOT show Action & Adventure
    expect(screen.queryByText('Action & Adventure')).not.toBeInTheDocument();

    // Should show other genres
    expect(screen.getByText('Comedy')).toBeInTheDocument();
    expect(screen.getByText('Drama')).toBeInTheDocument();
  });

  it('should display correct number of genres (excluding Action & Adventure)', () => {
    render(<GenreStep onComplete={vi.fn()} />);

    // Get all genre buttons (excluding the "Any Genre" button)
    const genreButtons = screen.getAllByRole('button').filter((button) => {
      const text = button.textContent || '';
      return !text.includes('Any Genre') && !text.includes('Continue');
    });

    // Should have 4 genres (Action, Adventure, Comedy, Drama - not Action & Adventure)
    expect(genreButtons).toHaveLength(4);
  });
});
