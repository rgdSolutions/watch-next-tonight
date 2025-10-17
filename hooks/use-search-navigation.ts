import { useRouter } from 'next/navigation';

export function useSearchNavigation() {
  const router = useRouter();

  const navigateToSearch = async () => {
    let countryCode = 'US'; // Default fallback

    try {
      // Request geolocation permission
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      const { latitude, longitude } = position.coords;

      // Call internal API route (privacy-preserving, doesn't expose coordinates to third parties)
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (response.ok) {
        const data = await response.json();
        countryCode = data.countryCode;
      } else {
        // Log error details for debugging
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Geocoding API error:', response.status, errorData);
        // Fall back to default US
      }
    } catch (error) {
      console.error('Location detection error:', error);
      // Permission denied, network error, or API error - use default US
    }

    // Store in localStorage for fallback (best effort)
    try {
      localStorage.setItem('userCountry', countryCode);
    } catch (error) {
      // localStorage may be unavailable (private browsing, quota exceeded, etc.)
      // This is non-critical, so we just log and continue
      console.warn('Failed to save country preference to localStorage:', error);
    }

    // Navigate with query param
    router.push(`/search?country=${countryCode}`);
  };

  return { navigateToSearch };
}
