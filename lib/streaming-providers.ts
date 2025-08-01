// Common streaming provider IDs from TMDB
// These are the providers that offer subscription-based streaming (flatrate)
export const STREAMING_PROVIDER_IDS = {
  NETFLIX: 8,
  AMAZON_PRIME: 9,
  AMAZON_PRIME_VIDEO: 119, // Alternative ID for Prime Video
  DISNEY_PLUS: 337,
  HULU: 15,
  HBO_MAX: 384, // Old HBO Max ID
  MAX: 1899, // New Max ID after rebrand
  PARAMOUNT_PLUS: 531,
  APPLE_TV_PLUS: 350,
  PEACOCK: 386,
  CRUNCHYROLL: 283,
  SHOWTIME: 37,
  STARZ: 43,
  EPIX: 34,
  YOUTUBE_PREMIUM: 188,
  FUBO_TV: 257,
  // Free streaming services
  TUBI: 273,
  PLUTO_TV: 300,
  CRACKLE: 12,
  VUDU_FREE: 332,
} as const;

// Get provider IDs for streaming services (excludes rent/buy only services)
export function getStreamingProviderIds(): string {
  return Object.values(STREAMING_PROVIDER_IDS).join('|');
}

// Provider ID to name mapping
export const PROVIDER_NAMES: Record<number, string> = {
  [STREAMING_PROVIDER_IDS.NETFLIX]: 'Netflix',
  [STREAMING_PROVIDER_IDS.AMAZON_PRIME]: 'Amazon Prime Video',
  [STREAMING_PROVIDER_IDS.AMAZON_PRIME_VIDEO]: 'Prime Video',
  [STREAMING_PROVIDER_IDS.DISNEY_PLUS]: 'Disney Plus',
  [STREAMING_PROVIDER_IDS.HULU]: 'Hulu',
  [STREAMING_PROVIDER_IDS.HBO_MAX]: 'HBO Max',
  [STREAMING_PROVIDER_IDS.MAX]: 'Max',
  [STREAMING_PROVIDER_IDS.PARAMOUNT_PLUS]: 'Paramount Plus',
  [STREAMING_PROVIDER_IDS.APPLE_TV_PLUS]: 'Apple TV Plus',
  [STREAMING_PROVIDER_IDS.PEACOCK]: 'Peacock',
  [STREAMING_PROVIDER_IDS.CRUNCHYROLL]: 'Crunchyroll',
  [STREAMING_PROVIDER_IDS.SHOWTIME]: 'Showtime',
  [STREAMING_PROVIDER_IDS.STARZ]: 'Starz',
  [STREAMING_PROVIDER_IDS.EPIX]: 'Epix',
  [STREAMING_PROVIDER_IDS.YOUTUBE_PREMIUM]: 'YouTube Premium',
  [STREAMING_PROVIDER_IDS.FUBO_TV]: 'FuboTV',
  [STREAMING_PROVIDER_IDS.TUBI]: 'Tubi',
  [STREAMING_PROVIDER_IDS.PLUTO_TV]: 'Pluto TV',
  [STREAMING_PROVIDER_IDS.CRACKLE]: 'Crackle',
  [STREAMING_PROVIDER_IDS.VUDU_FREE]: 'Vudu (Free)',
};

// Filter provider IDs by platform
export function getProviderIdsForPlatform(platform: string): string {
  switch (platform.toLowerCase()) {
    case 'netflix':
      return STREAMING_PROVIDER_IDS.NETFLIX.toString();
    case 'prime':
      // Use both Prime Video IDs with pipe separator
      return `${STREAMING_PROVIDER_IDS.AMAZON_PRIME}|${STREAMING_PROVIDER_IDS.AMAZON_PRIME_VIDEO}`;
    case 'disney':
      return STREAMING_PROVIDER_IDS.DISNEY_PLUS.toString();
    case 'appletv':
      return STREAMING_PROVIDER_IDS.APPLE_TV_PLUS.toString();
    case 'max':
      // Use both HBO Max and Max IDs to cover content from both
      return `${STREAMING_PROVIDER_IDS.HBO_MAX}|${STREAMING_PROVIDER_IDS.MAX}`;
    case 'all':
    default:
      return getStreamingProviderIds();
  }
}
