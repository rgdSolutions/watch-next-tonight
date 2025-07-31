import { describe, expect, it } from 'vitest';

import {
  getProviderIdsForPlatform,
  getStreamingProviderIds,
  PROVIDER_NAMES,
  STREAMING_PROVIDER_IDS,
} from '../streaming-providers';

describe('streaming-providers', () => {
  describe('getStreamingProviderIds', () => {
    it('should return all provider IDs joined by pipe', () => {
      const ids = getStreamingProviderIds();
      expect(ids).toContain('8'); // Netflix
      expect(ids).toContain('9'); // Amazon Prime
      expect(ids).toContain('337'); // Disney Plus
      expect(ids).toContain('|'); // Should be pipe-separated
    });

    it('should include all defined providers', () => {
      const ids = getStreamingProviderIds();
      const idArray = ids.split('|');
      const providerValues = Object.values(STREAMING_PROVIDER_IDS).map(String);

      expect(idArray).toHaveLength(providerValues.length);
      providerValues.forEach((id) => {
        expect(idArray).toContain(id);
      });
    });
  });

  describe('getProviderIdsForPlatform', () => {
    it('should return Netflix ID for netflix platform', () => {
      expect(getProviderIdsForPlatform('netflix')).toBe('8');
    });

    it('should return Amazon Prime ID for prime platform', () => {
      expect(getProviderIdsForPlatform('prime')).toBe('9');
    });

    it('should return Disney Plus ID for disney platform', () => {
      expect(getProviderIdsForPlatform('disney')).toBe('337');
    });

    it('should return Apple TV Plus ID for appletv platform', () => {
      expect(getProviderIdsForPlatform('appletv')).toBe('350');
    });

    it('should return HBO Max ID for max platform', () => {
      expect(getProviderIdsForPlatform('max')).toBe('384');
    });

    it('should return all providers for all platform', () => {
      const result = getProviderIdsForPlatform('all');
      expect(result).toBe(getStreamingProviderIds());
    });

    it('should return all providers for unknown platform', () => {
      const result = getProviderIdsForPlatform('unknown');
      expect(result).toBe(getStreamingProviderIds());
    });

    it('should be case insensitive', () => {
      expect(getProviderIdsForPlatform('NETFLIX')).toBe('8');
      expect(getProviderIdsForPlatform('Prime')).toBe('9');
    });
  });

  describe('PROVIDER_NAMES', () => {
    it('should have names for all provider IDs', () => {
      Object.values(STREAMING_PROVIDER_IDS).forEach((id) => {
        expect(PROVIDER_NAMES[id]).toBeDefined();
        expect(typeof PROVIDER_NAMES[id]).toBe('string');
      });
    });

    it('should have correct provider names', () => {
      expect(PROVIDER_NAMES[8]).toBe('Netflix');
      expect(PROVIDER_NAMES[9]).toBe('Amazon Prime Video');
      expect(PROVIDER_NAMES[337]).toBe('Disney Plus');
    });
  });
});
