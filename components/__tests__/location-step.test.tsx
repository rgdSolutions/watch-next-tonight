import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LocationStep } from '../location-step';

// Mock the geolocation API
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
};

// Mock fetch
global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  // Setup geolocation mock
  Object.defineProperty(global.navigator, 'geolocation', {
    value: mockGeolocation,
    configurable: true,
  });
});

describe('LocationStep', () => {
  const mockOnComplete = vi.fn();

  it('should render location detection UI', async () => {
    // Mock geolocation to prevent immediate auto-detection
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      // Simulate a delay
      setTimeout(() => error(new Error('Permission denied')), 100);
    });

    render(<LocationStep onComplete={mockOnComplete} />);

    expect(screen.getByText('Where are you watching from?')).toBeInTheDocument();
    expect(
      screen.getByText('We need your location to show available content in your region')
    ).toBeInTheDocument();

    // Initially it will show "Detecting your location..."
    expect(screen.getByText('Detecting your location...')).toBeInTheDocument();
    expect(screen.getByText('Continue with USA')).toBeInTheDocument();

    // Wait for the auto-detection to complete and button text to change
    await waitFor(() => {
      expect(screen.getByText('Auto-detect my location')).toBeInTheDocument();
    });
  });

  it('should auto-detect location on mount', async () => {
    const mockPosition = {
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    };

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        address: {
          country: 'United States',
        },
      }),
    } as Response);

    render(<LocationStep onComplete={mockOnComplete} />);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith('US');
    });
  });

  it('should handle manual location detection', async () => {
    // First mock the initial auto-detect to fail quickly
    mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) => {
      error(new Error('Initial detection failed'));
    });

    render(<LocationStep onComplete={mockOnComplete} />);

    // Wait for initial auto-detect to complete
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith('US');
    });

    // Clear the mock for manual detection
    mockOnComplete.mockClear();
    vi.mocked(fetch).mockClear();

    // Now set up the successful manual detection
    const mockPosition = {
      coords: {
        latitude: 51.5074,
        longitude: -0.1278,
      },
    };

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        address: {
          country: 'United Kingdom',
        },
      }),
    } as Response);

    // Click the detect button
    const detectButton = screen.getByText('Auto-detect my location');
    fireEvent.click(detectButton);

    await waitFor(() => {
      expect(screen.getByText('Detecting your location...')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith('US');
    });
  });

  it('should handle geolocation permission denied', async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(new Error('Permission denied'));
    });

    render(<LocationStep onComplete={mockOnComplete} />);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith('US');
    });
  });

  it('should handle geocoding API failure', async () => {
    const mockPosition = {
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    };

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    render(<LocationStep onComplete={mockOnComplete} />);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith('US');
    });
  });

  it('should handle continue with USA button', async () => {
    // Mock the initial auto-detect to prevent it from interfering
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(new Error('Permission denied'));
    });

    render(<LocationStep onComplete={mockOnComplete} />);

    // Wait for initial auto-detect to complete
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith('US');
    });

    // Clear the mock
    mockOnComplete.mockClear();

    const usaButton = screen.getByText('Continue with USA');
    fireEvent.click(usaButton);

    expect(mockOnComplete).toHaveBeenCalledWith('US');
  });

  it('should make correct API call to Nominatim', async () => {
    const mockPosition = {
      coords: {
        latitude: 48.8566,
        longitude: 2.3522,
      },
    };

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        address: {
          country: 'France',
        },
      }),
    } as Response);

    render(<LocationStep onComplete={mockOnComplete} />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://nominatim.openstreetmap.org/reverse?format=json&lat=48.8566&lon=2.3522&zoom=3&addressdetails=1',
        {
          headers: {
            'User-Agent': 'WatchNextTonight/1.0',
          },
        }
      );
    });
  });
});
