import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getCountryCodeFromCoordinates } from '@/lib/country-codes';

import { DELETE, GET, PATCH, POST, PUT } from '../route';

// Mock the country-codes module
vi.mock('@/lib/country-codes', () => ({
  getCountryCodeFromCoordinates: vi.fn(),
}));

describe('/api/geocode', () => {
  const mockGetCountryCode = getCountryCodeFromCoordinates as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock console.error to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('should return country code for valid coordinates', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: 40.7128,
          longitude: -74.006,
        }),
      });

      mockGetCountryCode.mockResolvedValue('US');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ countryCode: 'US' });
      expect(mockGetCountryCode).toHaveBeenCalledWith(40.7128, -74.006);
    });

    it('should return GB for UK coordinates', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: 51.5074,
          longitude: -0.1278,
        }),
      });

      mockGetCountryCode.mockResolvedValue('GB');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ countryCode: 'GB' });
      expect(mockGetCountryCode).toHaveBeenCalledWith(51.5074, -0.1278);
    });

    it('should return 400 for missing latitude', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          longitude: -74.006,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid latitude: must be a number' });
      expect(mockGetCountryCode).not.toHaveBeenCalled();
    });

    it('should return 400 for missing longitude', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: 40.7128,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid longitude: must be a number' });
      expect(mockGetCountryCode).not.toHaveBeenCalled();
    });

    it('should return 400 for non-numeric latitude', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: 'invalid',
          longitude: -74.006,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid latitude: must be a number' });
    });

    it('should return 400 for non-numeric longitude', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: 40.7128,
          longitude: 'invalid',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid longitude: must be a number' });
    });

    it('should return 400 for latitude below -90', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: -91,
          longitude: 0,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid latitude: must be between -90 and 90' });
    });

    it('should return 400 for latitude above 90', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: 91,
          longitude: 0,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid latitude: must be between -90 and 90' });
    });

    it('should return 400 for longitude below -180', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: 0,
          longitude: -181,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid longitude: must be between -180 and 180' });
    });

    it('should return 400 for longitude above 180', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: 0,
          longitude: 181,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid longitude: must be between -180 and 180' });
    });

    it('should accept latitude at boundary -90', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: -90,
          longitude: 0,
        }),
      });

      mockGetCountryCode.mockResolvedValue('AQ');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ countryCode: 'AQ' });
    });

    it('should accept latitude at boundary 90', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: 90,
          longitude: 0,
        }),
      });

      mockGetCountryCode.mockResolvedValue('XX');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ countryCode: 'XX' });
    });

    it('should accept longitude at boundary -180', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: 0,
          longitude: -180,
        }),
      });

      mockGetCountryCode.mockResolvedValue('XX');

      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it('should accept longitude at boundary 180', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: 0,
          longitude: 180,
        }),
      });

      mockGetCountryCode.mockResolvedValue('XX');

      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it('should return 400 for invalid JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid JSON in request body' });
      expect(mockGetCountryCode).not.toHaveBeenCalled();
    });

    it('should return 500 when geocoding service fails', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: 0,
          longitude: 0,
        }),
      });

      mockGetCountryCode.mockRejectedValue(new Error('Service unavailable'));

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to determine country from coordinates' });
      expect(console.error).toHaveBeenCalledWith('Geocoding error:', expect.any(Error));
    });

    it('should handle NaN values for latitude', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: NaN,
          longitude: 0,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid latitude: must be a number' });
    });

    it('should handle NaN values for longitude', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: 0,
          longitude: NaN,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid longitude: must be a number' });
    });

    it('should handle zero coordinates (null island)', async () => {
      const request = new NextRequest('http://localhost:3000/api/geocode', {
        method: 'POST',
        body: JSON.stringify({
          latitude: 0,
          longitude: 0,
        }),
      });

      mockGetCountryCode.mockResolvedValue('');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ countryCode: '' });
    });
  });

  describe('GET', () => {
    it('should return 405 Method Not Allowed', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(405);
      expect(data).toEqual({ error: 'Method not allowed' });
    });
  });

  describe('PUT', () => {
    it('should return 405 Method Not Allowed', async () => {
      const response = await PUT();
      const data = await response.json();

      expect(response.status).toBe(405);
      expect(data).toEqual({ error: 'Method not allowed' });
    });
  });

  describe('DELETE', () => {
    it('should return 405 Method Not Allowed', async () => {
      const response = await DELETE();
      const data = await response.json();

      expect(response.status).toBe(405);
      expect(data).toEqual({ error: 'Method not allowed' });
    });
  });

  describe('PATCH', () => {
    it('should return 405 Method Not Allowed', async () => {
      const response = await PATCH();
      const data = await response.json();

      expect(response.status).toBe(405);
      expect(data).toEqual({ error: 'Method not allowed' });
    });
  });
});
