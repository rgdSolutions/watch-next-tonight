import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCountryCodeFromCoordinates } from '../country-codes';

// Mock fetch
global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getCountryCodeFromCoordinates', () => {
  it('should return correct country code for valid coordinates', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        address: {
          country: 'United States',
        },
      }),
    } as Response);

    const result = await getCountryCodeFromCoordinates(40.7128, -74.006);
    expect(result).toBe('US');
    expect(fetch).toHaveBeenCalledWith(
      'https://nominatim.openstreetmap.org/reverse?format=json&lat=40.7128&lon=-74.006&zoom=3&addressdetails=1',
      {
        headers: {
          'User-Agent': 'WatchNextTonight/1.0',
        },
      }
    );
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const result = await getCountryCodeFromCoordinates(40.7128, -74.006);
    expect(result).toBe('US');
  });

  it('should handle network errors gracefully', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    const result = await getCountryCodeFromCoordinates(40.7128, -74.006);
    expect(result).toBe('US');
  });

  it('should handle missing country in response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        address: {
          city: 'New York',
          state: 'New York',
          // No country field
        },
      }),
    } as Response);

    const result = await getCountryCodeFromCoordinates(40.7128, -74.006);
    expect(result).toBe('US');
  });
});
