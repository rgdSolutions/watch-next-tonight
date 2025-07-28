import { ContentItem } from '@/components/content-display';

export const mockContentData: ContentItem[] = [
  // Netflix
  {
    id: 'netflix-movie-1',
    title: 'The Midnight Heist',
    type: 'movie',
    platform: 'netflix',
    coverArt: 'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop',
    rating: 8.2,
    year: 2024,
    genre: ['Action', 'Thriller'],
    description: 'A skilled thief assembles a team for the ultimate heist during a city-wide blackout.',
    trailerUrl: 'https://example.com/trailer1'
  },
  {
    id: 'netflix-tv-1',
    title: 'Silicon Dreams',
    type: 'tv',
    platform: 'netflix',
    coverArt: 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop',
    rating: 9.1,
    year: 2023,
    genre: ['Drama', 'Sci-Fi'],
    description: 'A tech startup\'s journey through the highs and lows of Silicon Valley\'s competitive landscape.',
    trailerUrl: 'https://example.com/trailer2'
  },

  // Prime Video
  {
    id: 'prime-movie-1',
    title: 'Desert Storm',
    type: 'movie',
    platform: 'prime',
    coverArt: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop',
    rating: 7.8,
    year: 2024,
    genre: ['Action', 'Adventure'],
    description: 'A group of survivors must navigate through a post-apocalyptic desert landscape.',
    trailerUrl: 'https://example.com/trailer3'
  },
  {
    id: 'prime-tv-1',
    title: 'Crown of Thorns',
    type: 'tv',
    platform: 'prime',
    coverArt: 'https://images.pexels.com/photos/1366930/pexels-photo-1366930.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop',
    rating: 8.7,
    year: 2023,
    genre: ['Drama', 'History'],
    description: 'A gripping historical drama following the rise and fall of medieval kingdoms.',
    trailerUrl: 'https://example.com/trailer4'
  },

  // Disney+
  {
    id: 'disney-movie-1',
    title: 'Enchanted Forest',
    type: 'movie',
    platform: 'disney',
    coverArt: 'https://images.pexels.com/photos/1647121/pexels-photo-1647121.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop',
    rating: 8.5,
    year: 2024,
    genre: ['Family', 'Fantasy'],
    description: 'A magical adventure where a young girl discovers a hidden world in her backyard.',
    trailerUrl: 'https://example.com/trailer5'
  },
  {
    id: 'disney-tv-1',
    title: 'Galactic Academy',
    type: 'tv',
    platform: 'disney',
    coverArt: 'https://images.pexels.com/photos/1730877/pexels-photo-1730877.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop',
    rating: 8.3,
    year: 2024,
    genre: ['Sci-Fi', 'Adventure'],
    description: 'Young cadets train at an elite space academy to become the next generation of heroes.',
    trailerUrl: 'https://example.com/trailer6'
  },

  // Apple TV+
  {
    id: 'appletv-movie-1',
    title: 'The Last Symphony',
    type: 'movie',
    platform: 'appletv',
    coverArt: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop',
    rating: 9.0,
    year: 2024,
    genre: ['Drama', 'Music'],
    description: 'A renowned composer faces his greatest challenge in creating his final masterpiece.',
    trailerUrl: 'https://example.com/trailer7'
  },
  {
    id: 'appletv-tv-1',
    title: 'Ocean Deep',
    type: 'tv',
    platform: 'appletv',
    coverArt: 'https://images.pexels.com/photos/1076758/pexels-photo-1076758.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop',
    rating: 8.9,
    year: 2023,
    genre: ['Documentary', 'Nature'],
    description: 'An unprecedented look into the mysteries of the deep ocean and its incredible creatures.',
    trailerUrl: 'https://example.com/trailer8'
  },

  // MAX
  {
    id: 'max-movie-1',
    title: 'Neon Nights',
    type: 'movie',
    platform: 'max',
    coverArt: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop',
    rating: 8.1,
    year: 2024,
    genre: ['Crime', 'Thriller'],
    description: 'A detective investigates a series of crimes in the neon-lit streets of a cyberpunk city.',
    trailerUrl: 'https://example.com/trailer9'
  },
  {
    id: 'max-tv-1',
    title: 'Power Play',
    type: 'tv',
    platform: 'max',
    coverArt: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=300&h=450&fit=crop',
    rating: 8.6,
    year: 2023,
    genre: ['Drama', 'Political'],
    description: 'Behind-the-scenes drama of political maneuvering in the highest levels of government.',
    trailerUrl: 'https://example.com/trailer10'
  }
];