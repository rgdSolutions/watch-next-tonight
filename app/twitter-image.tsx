import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Watch Next Tonight';
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
          background: 'linear-gradient(135deg, #06141b 0%, #0e2a38 100%)',
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
        <div
          style={{
            width: 96,
            height: 8,
            borderRadius: 999,
            background: 'linear-gradient(100deg, #7df9c2, #3ad0ff)',
            marginBottom: 28,
          }}
        />
        <div
          style={{
            display: 'flex',
            gap: 18,
            fontSize: 60,
            fontWeight: 'bold',
            marginBottom: 10,
            color: '#eef4f2',
          }}
        >
          <span>Watch</span>
          <span style={{ color: '#7df9c2' }}>Next</span>
          <span>Tonight</span>
        </div>
        <div style={{ fontSize: 28, color: '#a8bec4' }}>Personalized Streaming Recommendations</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
