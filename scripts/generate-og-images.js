const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const width = 1200;
const height = 630;

// Create the OG image as SVG then convert to PNG
const svgImage = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e293b"/>
    </linearGradient>
    <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="50%" style="stop-color:#2563eb"/>
      <stop offset="100%" style="stop-color:#1d4ed8"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg-gradient)"/>

  <!-- Logo centered -->
  <g transform="translate(510, 140)">
    <rect width="180" height="180" rx="40" fill="url(#logo-gradient)"/>
    <rect x="34" y="56" width="62" height="84" rx="20" fill="white" opacity="0.95"/>
    <rect x="101" y="39" width="45" height="45" rx="14" fill="#ff8a80" opacity="0.9"/>
    <rect x="101" y="96" width="45" height="45" rx="14" fill="#69f0ae" opacity="0.85"/>
  </g>

  <!-- Title -->
  <text x="600" y="400" font-family="system-ui, -apple-system, sans-serif" font-size="72" font-weight="700" fill="white" text-anchor="middle" letter-spacing="-1">
    Bookfolio
  </text>

  <!-- Tagline -->
  <text x="600" y="460" font-family="system-ui, -apple-system, sans-serif" font-size="32" fill="#94a3b8" text-anchor="middle">
    Your Bookshelf, Beautifully Online
  </text>
</svg>
`;

async function generateImages() {
  const publicDir = path.join(__dirname, '..', 'public');

  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Generate OG image
  await sharp(Buffer.from(svgImage))
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log('Generated: public/og-image.png');

  // Generate Twitter image (same as OG for consistency)
  await sharp(Buffer.from(svgImage))
    .png()
    .toFile(path.join(publicDir, 'twitter-image.png'));

  console.log('Generated: public/twitter-image.png');

  console.log('Done! OG and Twitter images generated successfully.');
}

generateImages().catch(console.error);
