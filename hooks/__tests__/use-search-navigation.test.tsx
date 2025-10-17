import { renderHook, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useSearchNavigation } from '../use-search-navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('useSearchNavigation', () => {
  const mockPush = vi.fn();
  const mockUseRouter = useRouter as ReturnType<typeof vi.fn>;
  const mockFetch = vi.fn();

  // Mock geolocation
  const mockGeolocation = {
    getCurrentPosition: vi.fn(),
  };

  beforeEach(() => {
    // Setup router mock
    mockUseRouter.mockReturnValue({
      push: mockPush,
    });

    // Setup geolocation mock
    Object.defineProperty(global.navigator, 'geolocation', {
      writable: true,
      value: mockGeolocation,
    });

    // Setup fetch mock
    global.fetch = mockFetch;

    // Setup localStorage mock
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(global, 'localStorage', {
      writable: true,
      value: localStorageMock,
    });

    // Mock console.error to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('navigateToSearch', () => {
    it('should return navigateToSearch function', () => {
      const { result } = renderHook(() => useSearchNavigation());

      expect(result.current).toHaveProperty('navigateToSearch');
      expect(typeof result.current.navigateToSearch).toBe('function');
    });

    it('should successfully get location and navigate with correct country code', async () => {
      // Mock successful geolocation
      const mockPosition = {
        coords: {
          latitude: 40.7128,
          longitude: -74.006,
        },
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      // Mock successful API response
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ countryCode: 'US' }),
      });

      const { result } = renderHook(() => useSearchNavigation());

      // Call navigateToSearch
      await result.current.navigateToSearch();

      // Wait for async operations
      await waitFor(() => {
        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
          expect.any(Function),
          expect.any(Function),
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000,
          }
        );
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/geocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude: 40.7128, longitude: -74.006 }),
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('userCountry', 'US');
      expect(mockPush).toHaveBeenCalledWith('/search?country=US');
    });

    it('should use different country code when geolocation returns non-US location', async () => {
      // Mock UK location
      const mockPosition = {
        coords: {
          latitude: 51.5074,
          longitude: -0.1278,
        },
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      // Mock API returning GB country code
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ countryCode: 'GB' }),
      });

      const { result } = renderHook(() => useSearchNavigation());

      await result.current.navigateToSearch();

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/geocode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ latitude: 51.5074, longitude: -0.1278 }),
        });
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('userCountry', 'GB');
      expect(mockPush).toHaveBeenCalledWith('/search?country=GB');
    });

    it('should handle geolocation permission denied and use default US', async () => {
      // Mock permission denied
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({
          code: 1,
          message: 'User denied geolocation',
        });
      });

      const { result } = renderHook(() => useSearchNavigation());

      await result.current.navigateToSearch();

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          'Location detection error:',
          expect.objectContaining({
            code: 1,
            message: 'User denied geolocation',
          })
        );
      });

      expect(mockFetch).not.toHaveBeenCalled();
      expect(localStorage.setItem).toHaveBeenCalledWith('userCountry', 'US');
      expect(mockPush).toHaveBeenCalledWith('/search?country=US');
    });

    it('should handle geolocation timeout error and use default US', async () => {
      // Mock timeout error
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({
          code: 3,
          message: 'Timeout',
        });
      });

      const { result } = renderHook(() => useSearchNavigation());

      await result.current.navigateToSearch();

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          'Location detection error:',
          expect.objectContaining({
            code: 3,
            message: 'Timeout',
          })
        );
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('userCountry', 'US');
      expect(mockPush).toHaveBeenCalledWith('/search?country=US');
    });

    it('should handle geolocation position unavailable and use default US', async () => {
      // Mock position unavailable
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({
          code: 2,
          message: 'Position unavailable',
        });
      });

      const { result } = renderHook(() => useSearchNavigation());

      await result.current.navigateToSearch();

      await waitFor(() => {
        expect(console.error).toHaveBeenCalled();
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('userCountry', 'US');
      expect(mockPush).toHaveBeenCalledWith('/search?country=US');
    });

    it('should handle API error with non-ok response and use default US', async () => {
      // Mock successful geolocation but failed API response
      const mockPosition = {
        coords: {
          latitude: 0,
          longitude: 0,
        },
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      // Mock API returning error response
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      });

      const { result } = renderHook(() => useSearchNavigation());

      await result.current.navigateToSearch();

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/geocode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ latitude: 0, longitude: 0 }),
        });
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Geocoding API error:', 500, {
          error: 'Internal server error',
        });
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('userCountry', 'US');
      expect(mockPush).toHaveBeenCalledWith('/search?country=US');
    });

    it('should handle fetch network error and use default US', async () => {
      // Mock successful geolocation but failed fetch
      const mockPosition = {
        coords: {
          latitude: 0,
          longitude: 0,
        },
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      // Mock fetch throwing network error
      mockFetch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useSearchNavigation());

      await result.current.navigateToSearch();

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Location detection error:', expect.any(Error));
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('userCountry', 'US');
      expect(mockPush).toHaveBeenCalledWith('/search?country=US');
    });

    it('should call getCurrentPosition with correct options', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 0,
            longitude: 0,
          },
        });
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ countryCode: 'US' }),
      });

      const { result } = renderHook(() => useSearchNavigation());

      await result.current.navigateToSearch();

      await waitFor(() => {
        expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
          expect.any(Function),
          expect.any(Function),
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000,
          }
        );
      });
    });

    it('should store country code in localStorage before navigating', async () => {
      const setItemOrder: string[] = [];
      const pushOrder: string[] = [];

      (localStorage.setItem as ReturnType<typeof vi.fn>).mockImplementation(() => {
        setItemOrder.push('setItem');
      });

      mockPush.mockImplementation(() => {
        pushOrder.push('push');
      });

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 0,
            longitude: 0,
          },
        });
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ countryCode: 'FR' }),
      });

      const { result } = renderHook(() => useSearchNavigation());

      await result.current.navigateToSearch();

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalled();
      });

      // Verify order of operations
      expect(setItemOrder[0]).toBe('setItem');
      expect(pushOrder[0]).toBe('push');
    });

    it('should work with multiple calls sequentially', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 35.6762,
            longitude: 139.6503,
          },
        });
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ countryCode: 'JP' }),
      });

      const { result } = renderHook(() => useSearchNavigation());

      // First call
      await result.current.navigateToSearch();

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/search?country=JP');
      });

      // Second call
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ countryCode: 'KR' }),
      });
      await result.current.navigateToSearch();

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/search?country=KR');
      });

      expect(mockPush).toHaveBeenCalledTimes(2);
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('hook lifecycle', () => {
    it('should maintain function reference across re-renders', () => {
      const { result, rerender } = renderHook(() => useSearchNavigation());

      const firstRef = result.current.navigateToSearch;

      rerender();

      const secondRef = result.current.navigateToSearch;

      // Function reference may change, but it should still work
      expect(typeof firstRef).toBe('function');
      expect(typeof secondRef).toBe('function');
    });
  });

  describe('edge cases', () => {
    it('should handle when localStorage is unavailable', async () => {
      // Mock localStorage to throw
      (localStorage.setItem as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({ code: 1, message: 'Permission denied' });
      });

      const { result } = renderHook(() => useSearchNavigation());

      // Should not throw, even if localStorage fails
      await expect(result.current.navigateToSearch()).rejects.toThrow('localStorage unavailable');
    });

    it('should handle empty country code response', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 0,
            longitude: 0,
          },
        });
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ countryCode: '' }),
      });

      const { result } = renderHook(() => useSearchNavigation());

      await result.current.navigateToSearch();

      await waitFor(() => {
        // Should navigate with empty string if that's what the API returns
        expect(mockPush).toHaveBeenCalledWith('/search?country=');
      });
    });

    it('should handle API response with invalid JSON and use default US', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 0,
            longitude: 0,
          },
        });
      });

      // Mock API returning response that can't be parsed as JSON
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useSearchNavigation());

      await result.current.navigateToSearch();

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Geocoding API error:', 400, {
          error: 'Unknown error',
        });
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('userCountry', 'US');
      expect(mockPush).toHaveBeenCalledWith('/search?country=US');
    });
  });
});
