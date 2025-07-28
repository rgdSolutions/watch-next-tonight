import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GenreStep } from '../genre-step';

describe('GenreStep', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
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

    expect(mockOnComplete).toHaveBeenCalledWith(['any']);
  });
});
