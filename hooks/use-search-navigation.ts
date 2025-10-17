import { useRouter } from 'next/navigation';

import { getCountryCodeFromCoordinates } from '@/lib/country-codes';

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
      countryCode = await getCountryCodeFromCoordinates(latitude, longitude);
    } catch (error) {
      console.error('Location detection error:', error);
      // Permission denied or error - use default US
    }

    // Store in localStorage for fallback
    localStorage.setItem('userCountry', countryCode);

    // Navigate with query param
    router.push(`/search?country=${countryCode}`);
  };

  return { navigateToSearch };
}
