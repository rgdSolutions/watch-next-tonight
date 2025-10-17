import { NextRequest, NextResponse } from 'next/server';

import { getCountryCodeFromCoordinates } from '@/lib/country-codes';

/**
 * POST /api/geocode
 * Accepts latitude and longitude, performs server-side reverse geocoding,
 * and returns only the country code (privacy-preserving).
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { latitude, longitude } = body;

    // Validate latitude
    if (typeof latitude !== 'number' || isNaN(latitude)) {
      return NextResponse.json({ error: 'Invalid latitude: must be a number' }, { status: 400 });
    }

    if (latitude < -90 || latitude > 90) {
      return NextResponse.json(
        { error: 'Invalid latitude: must be between -90 and 90' },
        { status: 400 }
      );
    }

    // Validate longitude
    if (typeof longitude !== 'number' || isNaN(longitude)) {
      return NextResponse.json({ error: 'Invalid longitude: must be a number' }, { status: 400 });
    }

    if (longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Invalid longitude: must be between -180 and 180' },
        { status: 400 }
      );
    }

    // Perform reverse geocoding server-side with proper User-Agent
    const countryCode = await getCountryCodeFromCoordinates(latitude, longitude);

    // Return only the country code (not the raw coordinates)
    return NextResponse.json({ countryCode }, { status: 200 });
  } catch (error) {
    // Log error for debugging (server-side only)
    console.error('Geocoding error:', error);

    // Check if it's a parsing error
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    // Return generic error to client (don't expose internal details)
    return NextResponse.json(
      { error: 'Failed to determine country from coordinates' },
      { status: 500 }
    );
  }
}

// Only allow POST method
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
