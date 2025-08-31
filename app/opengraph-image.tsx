import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Watch Next Tonight - Movie & TV Show Recommendations';
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
          fontSize: 128,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 180, marginBottom: 20 }}>📺</div>
        <div style={{ fontSize: 60, fontWeight: 'bold', marginBottom: 10 }}>Watch Next Tonight</div>
        <div style={{ fontSize: 28, opacity: 0.9 }}>Find Your Perfect Movie or TV Show</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
