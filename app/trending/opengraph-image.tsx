import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Trending Now - Watch Next Tonight';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
            fontSize: 120,
          }}
        >
          🔥
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            textShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          Trending Now
        </div>
        <div
          style={{
            fontSize: 32,
            opacity: 0.95,
            textAlign: 'center',
            maxWidth: '80%',
            lineHeight: 1.4,
          }}
        >
          What everyone is watching globally
        </div>
        <div
          style={{
            marginTop: 40,
            display: 'flex',
            gap: 30,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 24,
              opacity: 0.9,
            }}
          >
            <span style={{ fontSize: 28 }}>🎬</span>
            <span>Movies</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 24,
              opacity: 0.9,
            }}
          >
            <span style={{ fontSize: 28 }}>📺</span>
            <span>TV Shows</span>
          </div>
        </div>
        <div
          style={{
            fontSize: 20,
            opacity: 0.7,
            marginTop: 30,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Watch Next Tonight
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
