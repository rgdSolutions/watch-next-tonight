import { NextRequest, NextResponse } from 'next/server';

import { MediaType } from '@/types/tmdb';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

if (!TMDB_TOKEN) {
  console.error('TMDB_READ_ACCESS_TOKEN is not set in environment variables');
}

// Transform TMDB movie/TV response to our format
function transformMediaItem(item: any, mediaType: 'movie' | 'tv') {
  return {
    id: `tmdb-${mediaType}-${item.id}`,
    tmdbId: item.id,
    title: mediaType === 'movie' ? item.title : item.name,
    type: mediaType === 'movie' ? MediaType.MOVIE : MediaType.TV,
    overview: item.overview,
    releaseDate: mediaType === 'movie' ? item.release_date : item.first_air_date,
    posterPath: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
    backdropPath: item.backdrop_path
      ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
      : null,
    rating: item.vote_average,
    voteCount: item.vote_count,
    popularity: item.popularity,
    genreIds: item.genre_ids || [],
    originalLanguage: item.original_language,
    adult: mediaType === 'movie' ? item.adult : undefined,
    runtime: mediaType === 'movie' ? item.runtime : undefined,
    episodeRunTime: mediaType === 'tv' ? item.episode_run_time : undefined,
    numberOfEpisodes: mediaType === 'tv' ? item.number_of_episodes : undefined,
    numberOfSeasons: mediaType === 'tv' ? item.number_of_seasons : undefined,
  };
}

// Transform search results
function transformSearchResults(data: any) {
  const movies = (data.results || [])
    .filter((item: any) => item.media_type === 'movie')
    .map((item: any) => transformMediaItem(item, 'movie'));

  const tvShows = (data.results || [])
    .filter((item: any) => item.media_type === 'tv')
    .map((item: any) => transformMediaItem(item, 'tv'));

  return {
    results: [...movies, ...tvShows],
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

// Transform discover results
function transformDiscoverResults(data: any, mediaType: 'movie' | 'tv') {
  return {
    results: (data.results || []).map((item: any) => transformMediaItem(item, mediaType)),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

// Transform genre list
function transformGenres(data: any) {
  return {
    genres: data.genres || [],
  };
}

// Transform trending results
function transformTrendingResults(data: any) {
  const results = (data.results || []).map((item: any) => {
    const mediaType = item.media_type === 'movie' ? 'movie' : 'tv';
    return transformMediaItem(item, mediaType);
  });

  return {
    results,
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

// Determine response transformation based on path
function transformResponse(path: string, data: any): any {
  // Multi-search endpoint
  if (path.includes('search/multi')) {
    return transformSearchResults(data);
  }

  // Trending endpoints
  if (path.includes('trending/')) {
    return transformTrendingResults(data);
  }

  // Discover endpoints
  if (path.includes('discover/movie')) {
    return transformDiscoverResults(data, 'movie');
  }
  if (path.includes('discover/tv')) {
    return transformDiscoverResults(data, 'tv');
  }

  // Genre endpoints
  if (path.includes('genre/')) {
    return transformGenres(data);
  }

  // Movie details (exact match only)
  if (path.match(/^movie\/\d+$/)) {
    return transformMediaItem(data, 'movie');
  }

  // TV details (exact match only)
  if (path.match(/^tv\/\d+$/)) {
    return transformMediaItem(data, 'tv');
  }

  // Default: return data as-is
  return data;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!TMDB_TOKEN) {
    return NextResponse.json({ error: 'TMDB API configuration error' }, { status: 500 });
  }

  // Await params before accessing its properties
  const resolvedParams = await params;

  // Reconstruct the TMDB API path
  const tmdbPath = resolvedParams.path.join('/');
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();

  // Build the full TMDB URL
  const tmdbUrl = `${TMDB_BASE_URL}/${tmdbPath}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(tmdbUrl, {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    });

    if (!response.ok) {
      // Handle different error status codes
      if (response.status === 404) {
        // For 404 errors, return empty results instead of error
        // This is common for movies/shows without videos or providers
        if (tmdbPath.includes('/videos') || tmdbPath.includes('/watch/providers')) {
          return NextResponse.json({
            id: parseInt(tmdbPath.match(/\d+/)?.[0] || '0'),
            results: tmdbPath.includes('/watch/providers') ? {} : [],
          });
        }
        // For other 404s, return a user-friendly error
        return NextResponse.json(
          {
            error: 'Content not found',
            message: 'The requested content is not available.',
            status: 404,
          },
          { status: 404 }
        );
      }

      // Handle rate limiting
      if (response.status === 429) {
        return NextResponse.json(
          {
            error: 'Too many requests',
            message: 'Please try again in a few moments.',
            status: 429,
          },
          { status: 429 }
        );
      }

      // Handle server errors
      if (response.status >= 500) {
        console.error(`TMDB API server error: ${response.status}`);
        return NextResponse.json(
          {
            error: 'Service temporarily unavailable',
            message: 'The movie database is experiencing issues. Please try again later.',
            status: response.status,
          },
          { status: 503 } // Return 503 for all 5xx errors
        );
      }

      // Default error response
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: 'TMDB API error',
          message: 'An error occurred while fetching data.',
          details: errorText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform the response based on the endpoint
    const transformedData = transformResponse(tmdbPath, data);

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('TMDB API proxy error:', error);
    // Network or other errors
    return NextResponse.json(
      {
        error: 'Network error',
        message:
          'Unable to connect to the movie database. Please check your connection and try again.',
        status: 500,
      },
      { status: 503 }
    );
  }
}

// Also support POST for endpoints that require it
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!TMDB_TOKEN) {
    return NextResponse.json({ error: 'TMDB API configuration error' }, { status: 500 });
  }

  // Await params before accessing its properties
  const resolvedParams = await params;
  const tmdbPath = resolvedParams.path.join('/');
  const body = await request.json();

  const tmdbUrl = `${TMDB_BASE_URL}/${tmdbPath}`;

  try {
    const response = await fetch(tmdbUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handle rate limiting
      if (response.status === 429) {
        return NextResponse.json(
          {
            error: 'Too many requests',
            message: 'Please try again in a few moments.',
            status: 429,
          },
          { status: 429 }
        );
      }

      // Handle server errors
      if (response.status >= 500) {
        console.error(`TMDB API server error: ${response.status}`);
        return NextResponse.json(
          {
            error: 'Service temporarily unavailable',
            message: 'The movie database is experiencing issues. Please try again later.',
            status: response.status,
          },
          { status: 503 }
        );
      }

      const errorText = await response.text();
      return NextResponse.json(
        {
          error: 'TMDB API error',
          message: 'An error occurred while processing your request.',
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('TMDB API proxy error:', error);
    return NextResponse.json(
      {
        error: 'Network error',
        message:
          'Unable to connect to the movie database. Please check your connection and try again.',
        status: 500,
      },
      { status: 503 }
    );
  }
}
