import { describe, expect, it } from 'vitest';

import { TMDBGenre } from '@/types/tmdb';

import { getUnifiedGenres } from '../unified-genres';

describe('Unified Genres Mapping', () => {
  const movieGenres: TMDBGenre[] = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
  ];

  const tvGenres: TMDBGenre[] = [
    { id: 10759, name: 'Action & Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 10762, name: 'Kids' },
    { id: 9648, name: 'Mystery' },
    { id: 10763, name: 'News' },
    { id: 10764, name: 'Reality' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 10766, name: 'Soap' },
    { id: 10767, name: 'Talk' },
    { id: 10768, name: 'War & Politics' },
    { id: 37, name: 'Western' },
  ];

  it('should ensure all genres have both movie and TV IDs', () => {
    const unifiedGenres = getUnifiedGenres(movieGenres, tvGenres);

    unifiedGenres.forEach((genre) => {
      expect(genre.movieIds.length).toBeGreaterThan(0);
      expect(genre.tvIds.length).toBeGreaterThan(0);

      console.log(`Genre: ${genre.name} (${genre.id})`);
      console.log(`  Movie IDs: ${genre.movieIds.join(', ')}`);
      console.log(`  TV IDs: ${genre.tvIds.join(', ')}`);
    });
  });

  it('should map movie-only genres to appropriate TV genres', () => {
    const unifiedGenres = getUnifiedGenres(movieGenres, tvGenres);

    // Check History -> War & Politics
    const history = unifiedGenres.find((g) => g.name === 'History');
    expect(history).toBeDefined();
    expect(history!.movieIds).toContain(36);
    expect(history!.tvIds).toContain(10768); // War & Politics

    // Check Horror -> Mystery
    const horror = unifiedGenres.find((g) => g.name === 'Horror');
    expect(horror).toBeDefined();
    expect(horror!.movieIds).toContain(27);
    expect(horror!.tvIds).toContain(9648); // Mystery

    // Check Romance -> Soap
    const romance = unifiedGenres.find((g) => g.name === 'Romance');
    expect(romance).toBeDefined();
    expect(romance!.movieIds).toContain(10749);
    expect(romance!.tvIds).toContain(10766); // Soap
  });

  it('should map TV-only genres to appropriate movie genres', () => {
    const unifiedGenres = getUnifiedGenres(movieGenres, tvGenres);

    // Check Kids -> Animation
    const kids = unifiedGenres.find((g) => g.name === 'Kids');
    expect(kids).toBeDefined();
    expect(kids!.movieIds).toContain(16); // Animation
    expect(kids!.tvIds).toContain(10762);

    // Check News -> Documentary
    const news = unifiedGenres.find((g) => g.name === 'News');
    expect(news).toBeDefined();
    expect(news!.movieIds).toContain(99); // Documentary
    expect(news!.tvIds).toContain(10763);

    // Check Reality -> Documentary
    const reality = unifiedGenres.find((g) => g.name === 'Reality');
    expect(reality).toBeDefined();
    expect(reality!.movieIds).toContain(99); // Documentary
    expect(reality!.tvIds).toContain(10764);
  });

  it('should properly unify Science Fiction and Sci-Fi & Fantasy', () => {
    const unifiedGenres = getUnifiedGenres(movieGenres, tvGenres);

    const sciFi = unifiedGenres.find((g) => g.id === 'sciencefi');
    expect(sciFi).toBeDefined();
    expect(sciFi!.movieIds).toContain(878); // Science Fiction
    expect(sciFi!.tvIds).toContain(10765); // Sci-Fi & Fantasy
  });
});
