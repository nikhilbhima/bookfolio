import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Bookfolio - Your Bookshelf, Beautifully Online';
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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <svg
            width="180"
            height="180"
            viewBox="0 0 32 32"
            fill="none"
          >
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" />
                <stop offset="0.5" stopColor="#2563eb" />
                <stop offset="1" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="7" fill="url(#logo-grad)" />
            <rect x="6" y="10" width="11" height="15" rx="3.5" fill="white" opacity="0.95" />
            <rect x="18" y="7" width="8" height="8" rx="2.5" fill="#ff8a80" opacity="0.9" />
            <rect x="18" y="17" width="8" height="8" rx="2.5" fill="#69f0ae" opacity="0.85" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}
        >
          Bookfolio
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: '#94a3b8',
            fontWeight: 400,
          }}
        >
          Your Bookshelf, Beautifully Online
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
