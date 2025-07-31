// TMDB image URL utilities

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/';

export function getTMDBImageUrl(
  path: string | null,
  size: 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'original' = 'w500'
): string {
  if (!path) return '/placeholder-image.jpg'; // You should add a placeholder image
  return `${TMDB_IMAGE_BASE}${size}${path}`;
}

export function getYearFromDate(dateString: string): number {
  if (!dateString) return 0;
  return parseInt(dateString.split('-')[0] || '0');
}
