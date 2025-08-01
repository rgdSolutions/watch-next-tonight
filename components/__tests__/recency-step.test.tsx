import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RecencyOption } from '@/app/page';

import { RECENCY_OPTIONS, RecencyStep } from '../recency-step';

describe('RecencyStep', () => {
  const mockOnComplete = vi.fn();
  const mockOnBackToGenres = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all recency options', () => {
    render(<RecencyStep onComplete={mockOnComplete} onBackToGenres={mockOnBackToGenres} />);

    // Check title
    expect(screen.getByText('How recent should the content be?')).toBeInTheDocument();
    expect(
      screen.getByText('Choose your preferred time period for movies and TV shows')
    ).toBeInTheDocument();

    // Check all options are rendered
    RECENCY_OPTIONS.forEach((option) => {
      expect(screen.getByText(option.name)).toBeInTheDocument();
      expect(screen.getByText(option.description)).toBeInTheDocument();
      expect(screen.getByText(option.emoji)).toBeInTheDocument();
      expect(screen.getByText(option.timeframe)).toBeInTheDocument();
    });
  });

  it('renders back button', () => {
    render(<RecencyStep onComplete={mockOnComplete} onBackToGenres={mockOnBackToGenres} />);

    const backButton = screen.getByText('Back');
    expect(backButton).toBeInTheDocument();
  });

  it('calls onBackToGenres when back button is clicked', () => {
    render(<RecencyStep onComplete={mockOnComplete} onBackToGenres={mockOnBackToGenres} />);

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    expect(mockOnBackToGenres).toHaveBeenCalledTimes(1);
  });

  it('selects option and calls onComplete', async () => {
    render(<RecencyStep onComplete={mockOnComplete} onBackToGenres={mockOnBackToGenres} />);

    // Click on "Brand New" option
    const brandNewButton = screen.getByText('Brand New').closest('button');
    fireEvent.click(brandNewButton!);

    // Wait for the async operation
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith('brand-new');
    });
  });

  it('disables other options after selection', async () => {
    render(<RecencyStep onComplete={mockOnComplete} onBackToGenres={mockOnBackToGenres} />);

    // Click on "Recent" option
    const recentButton = screen.getByText('Recent').closest('button');
    fireEvent.click(recentButton!);

    // Check that all buttons are disabled
    const allButtons = screen
      .getAllByRole('button')
      .filter((btn) => !btn.textContent?.includes('Back'));

    allButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('applies selected styles to clicked option', async () => {
    render(<RecencyStep onComplete={mockOnComplete} onBackToGenres={mockOnBackToGenres} />);

    const veryRecentButton = screen.getByText('Very Recent').closest('button');
    fireEvent.click(veryRecentButton!);

    // Check that the button has selected styles
    expect(veryRecentButton).toHaveClass('border-primary', 'bg-primary', 'text-primary-foreground');
  });

  it('handles all recency options correctly', async () => {
    const testCases: RecencyOption[] = [
      'brand-new',
      'very-recent',
      'recent',
      'contemporary',
      'any',
    ];

    for (const recencyOption of testCases) {
      mockOnComplete.mockClear();

      const { unmount } = render(
        <RecencyStep onComplete={mockOnComplete} onBackToGenres={mockOnBackToGenres} />
      );

      const option = RECENCY_OPTIONS.find((opt) => opt.id === recencyOption);
      const button = screen.getByText(option!.name).closest('button');
      fireEvent.click(button!);

      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledWith(recencyOption);
      });

      unmount();
    }
  });

  it('shows clock icon in header', () => {
    render(<RecencyStep onComplete={mockOnComplete} onBackToGenres={mockOnBackToGenres} />);

    // The Clock icon is rendered in the header
    const header = screen.getByText('How recent should the content be?').parentElement
      ?.parentElement;
    expect(header).toBeInTheDocument();
  });

  it('shows calendar icon for each option', () => {
    render(<RecencyStep onComplete={mockOnComplete} onBackToGenres={mockOnBackToGenres} />);

    // Each option should have a calendar icon
    const calendarIcons = document.querySelectorAll('.w-4.h-4.opacity-60');
    expect(calendarIcons.length).toBe(RECENCY_OPTIONS.length);
  });

  it('maintains disabled state during submission', async () => {
    render(<RecencyStep onComplete={mockOnComplete} onBackToGenres={mockOnBackToGenres} />);

    const anyTimeButton = screen.getByText('Any Time Period').closest('button');
    fireEvent.click(anyTimeButton!);

    // Immediately after click, buttons should be disabled
    const allButtons = screen
      .getAllByRole('button')
      .filter((btn) => !btn.textContent?.includes('Back'));

    allButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });

    // Wait for completion
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it('applies hover styles', () => {
    render(<RecencyStep onComplete={mockOnComplete} onBackToGenres={mockOnBackToGenres} />);

    const contemporaryButton = screen.getByText('Contemporary').closest('button');
    expect(contemporaryButton).toHaveClass('hover:scale-[1.02]', 'hover:shadow-md');
  });

  it('shows correct descriptions for time periods', () => {
    render(<RecencyStep onComplete={mockOnComplete} onBackToGenres={mockOnBackToGenres} />);

    expect(screen.getByText('Published in the last 3 months')).toBeInTheDocument();
    expect(screen.getByText('Published in the last 18 months')).toBeInTheDocument();
    expect(screen.getByText('Published in the last 5 years')).toBeInTheDocument();
    expect(screen.getByText('Published in the last 10 years')).toBeInTheDocument();
    expect(screen.getByText('No restriction on publish date')).toBeInTheDocument();
  });
});
