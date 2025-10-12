import { describe, expect, it } from 'vitest';

import {
  getProviderIdsForPlatform,
  getStreamingProviderIds,
  PROVIDER_NAMES,
  STREAMING_PROVIDER_IDS,
} from '../lib/streaming-providers';

describe('streaming-providers', () => {
  it('contains all expected provider IDs', () => {
    expect(STREAMING_PROVIDER_IDS.NETFLIX).toBe(8);
    expect(STREAMING_PROVIDER_IDS.AMAZON_PRIME).toBe(9);
    expect(STREAMING_PROVIDER_IDS.DISNEY_PLUS).toBe(337);
  });

  it('returns pipe-separated string of all provider IDs', () => {
    const result = getStreamingProviderIds();
    expect(result).toContain('8');
    expect(result.includes('|')).toBe(true);
  });

  it('maps provider IDs to names correctly', () => {
    expect(PROVIDER_NAMES[8]).toBe('Netflix');
    expect(PROVIDER_NAMES[9]).toBe('Amazon Prime Video');
    expect(PROVIDER_NAMES[337]).toBe('Disney Plus');
  });

  describe('getProviderIdsForPlatform', () => {
    const cases: [string, string][] = [
      ['netflix', '8'],
      ['prime', '9|119'],
      ['disney', '337'],
      ['appletv', '350'],
      ['max', '384|1899'],
      ['hulu', '15'],
      ['paramount', '531'],
      ['peacock', '386'],
      ['crunchyroll', '283'],
      ['showtime', '37'],
      ['starz', '43'],
      ['epix', '34'],
      ['fubotv', '257'],
      ['tubi', '273'],
      ['plutotv', '300'],
      ['crackle', '12'],
      ['vudu', '332'],
    ];

    cases.forEach(([platform, expected]) => {
      it(`returns ${expected} for ${platform}`, () => {
        expect(getProviderIdsForPlatform(platform)).toBe(expected);
      });
    });

    it('returns all IDs for "all" platform', () => {
      const result = getProviderIdsForPlatform('all');
      expect(result).toContain('8');
      expect(result.includes('|')).toBe(true);
    });

    it('returns all IDs for unknown platform (default)', () => {
      const result = getProviderIdsForPlatform('unknown');
      expect(result).toContain('8');
      expect(result.includes('|')).toBe(true);
    });
  });
});
