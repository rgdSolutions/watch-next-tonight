import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GenreStep } from '../genre-step';

// Mock the unified genres hook
const mockUseUnifiedGenres = vi.fn();

vi.mock('@/hooks/use-unified-genres', () => ({
  useUnifiedGenres: () => mockUseUnifiedGenres(),
}));

describe('GenreStep', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
    // Default mock implementation
    mockUseUnifiedGenres.mockReturnValue({
      genres: [
        { id: 'action', name: 'Action', emoji: '🎬', movieIds: [28], tvIds: [10759] },
        { id: 'comedy', name: 'Comedy', emoji: '😂', movieIds: [35], tvIds: [35] },
        { id: 'drama', name: 'Drama', emoji: '🎭', movieIds: [18], tvIds: [18] },
        { id: 'horror', name: 'Horror', emoji: '👻', movieIds: [27], tvIds: [] },
      ],
      isLoading: false,
      error: null,
    });
  });

  it('renders genre options', () => {
    render(<GenreStep onComplete={mockOnComplete} />);

    // Check if some genre buttons are rendered
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Comedy')).toBeInTheDocument();
    expect(screen.getByText('Drama')).toBeInTheDocument();
    expect(screen.getByText('Horror')).toBeInTheDocument();
  });

  it('displays the correct title and subtitle', () => {
    render(<GenreStep onComplete={mockOnComplete} />);

    expect(screen.getByText('What genres are you in the mood for?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Select one or more genres, or choose "Any Genre" for surprise recommendations'
      )
    ).toBeInTheDocument();
  });

  it('allows selecting multiple genres', async () => {
    const user = userEvent.setup();
    render(<GenreStep onComplete={mockOnComplete} />);

    // Find genre buttons by their text content
    const actionButton = screen.getByText('Action').closest('button');
    const comedyButton = screen.getByText('Comedy').closest('button');

    await user.click(actionButton!);
    await user.click(comedyButton!);

    // Check if buttons have the selected style (border-primary class)
    expect(actionButton).toHaveClass('border-primary');
    expect(comedyButton).toHaveClass('border-primary');
  });

  it('enables continue button when at least one genre is selected', async () => {
    const user = userEvent.setup();
    render(<GenreStep onComplete={mockOnComplete} />);

    const continueButton = screen.getByRole('button', { name: /continue/i });
    const actionButton = screen.getByText('Action').closest('button');

    // Initially disabled
    expect(continueButton).toBeDisabled();

    // Select a genre
    await user.click(actionButton!);

    // Now enabled
    expect(continueButton).not.toBeDisabled();
  });

  it('calls onComplete with selected genres when continue is clicked', async () => {
    const user = userEvent.setup();
    render(<GenreStep onComplete={mockOnComplete} />);

    const actionButton = screen.getByText('Action').closest('button');
    const comedyButton = screen.getByText('Comedy').closest('button');
    const continueButton = screen.getByRole('button', { name: /continue/i });

    await user.click(actionButton!);
    await user.click(comedyButton!);
    await user.click(continueButton);

    expect(mockOnComplete).toHaveBeenCalledWith(['action', 'comedy']);
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('handles "Any Genre" selection', async () => {
    const user = userEvent.setup();
    render(<GenreStep onComplete={mockOnComplete} />);

    const anyGenreButton = screen.getByText('🎲 Any Genre - Surprise Me!');
    const continueButton = screen.getByRole('button', { name: /continue/i });

    await user.click(anyGenreButton);
    await user.click(continueButton);

    expect(mockOnComplete).toHaveBeenCalledWith([]);
  });
});

describe('GenreStep - Loading State', () => {
  it('shows loading state when genres are being fetched', () => {
    mockUseUnifiedGenres.mockReturnValue({
      genres: [],
      isLoading: true,
      error: null,
    });

    render(<GenreStep onComplete={vi.fn()} />);

    expect(screen.getByText('Loading genres...')).toBeInTheDocument();
  });
});

describe('GenreStep - Error State', () => {
  it('shows error state when genre fetch fails', () => {
    mockUseUnifiedGenres.mockReturnValue({
      genres: [],
      isLoading: false,
      error: new Error('Failed to fetch'),
    });

    render(<GenreStep onComplete={vi.fn()} />);

    expect(screen.getByText('Failed to load genres.')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });
});
