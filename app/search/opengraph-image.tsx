import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Search Movies & TV Shows - Watch Next Tonight';
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
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
          Find Your Perfect Watch
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
          Personalized movie & TV recommendations
        </div>
        <div
          style={{
            fontSize: 24,
            opacity: 0.8,
            marginTop: 30,
            display: 'flex',
            gap: 20,
          }}
        >
          <span>Netflix</span>
          <span>•</span>
          <span>Prime Video</span>
          <span>•</span>
          <span>Disney+</span>
          <span>•</span>
          <span>MAX</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
