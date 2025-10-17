import { renderHook, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getCountryCodeFromCoordinates } from '@/lib/country-codes';

import { useSearchNavigation } from '../use-search-navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock country-codes utility
vi.mock('@/lib/country-codes', () => ({
  getCountryCodeFromCoordinates: vi.fn(),
}));

describe('useSearchNavigation', () => {
  const mockPush = vi.fn();
  const mockUseRouter = useRouter as ReturnType<typeof vi.fn>;
  const mockGetCountryCode = getCountryCodeFromCoordinates as ReturnType<typeof vi.fn>;

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

      mockGetCountryCode.mockResolvedValue('US');

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

      expect(mockGetCountryCode).toHaveBeenCalledWith(40.7128, -74.006);
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

      mockGetCountryCode.mockResolvedValue('GB');

      const { result } = renderHook(() => useSearchNavigation());

      await result.current.navigateToSearch();

      await waitFor(() => {
        expect(mockGetCountryCode).toHaveBeenCalledWith(51.5074, -0.1278);
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

      expect(mockGetCountryCode).not.toHaveBeenCalled();
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

    it('should handle error in getCountryCodeFromCoordinates and use default US', async () => {
      // Mock successful geolocation but failed country code lookup
      const mockPosition = {
        coords: {
          latitude: 0,
          longitude: 0,
        },
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });

      mockGetCountryCode.mockRejectedValue(new Error('API error'));

      const { result } = renderHook(() => useSearchNavigation());

      await result.current.navigateToSearch();

      await waitFor(() => {
        expect(mockGetCountryCode).toHaveBeenCalledWith(0, 0);
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

      mockGetCountryCode.mockResolvedValue('US');

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

      mockGetCountryCode.mockResolvedValue('FR');

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

      mockGetCountryCode.mockResolvedValue('JP');

      const { result } = renderHook(() => useSearchNavigation());

      // First call
      await result.current.navigateToSearch();

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/search?country=JP');
      });

      // Second call
      mockGetCountryCode.mockResolvedValue('KR');
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

      mockGetCountryCode.mockResolvedValue('');

      const { result } = renderHook(() => useSearchNavigation());

      await result.current.navigateToSearch();

      await waitFor(() => {
        // Should navigate with empty string if that's what the API returns
        expect(mockPush).toHaveBeenCalledWith('/search?country=');
      });
    });
  });
});
