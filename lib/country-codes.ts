export async function getCountryCodeFromCoordinates(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    // Use Nominatim API for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'WatchNextTonight/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();

    // Extract country code from the response
    const countryCode = data.address?.country_code;

    // Fallback to US if country not found
    return countryCode?.toUpperCase() ?? 'US';
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Return US as fallback on any error
    return 'US';
  }
}
