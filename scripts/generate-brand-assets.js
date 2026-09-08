// Phase 25 — generate brand assets (og-default.png + icon.png) from SVG
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// ============================================================
// BRAND COMPOSITION — OG IMAGE (1200x630)
// Dark earth background, editorial typography, restrained mark
// ============================================================
const ogImage = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a1410"/>
      <stop offset="60%" stop-color="#0e0b08"/>
      <stop offset="100%" stop-color="#0a0805"/>
    </linearGradient>
    <radialGradient id="warm" cx="78%" cy="42%" r="55%">
      <stop offset="0%" stop-color="#3a2418" stop-opacity="0.55"/>
      <stop offset="60%" stop-color="#1a1410" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#b08d57" stop-opacity="0"/>
      <stop offset="50%" stop-color="#b08d57" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#b08d57" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#warm)"/>

  <!-- Subtle texture: hand-drawn elevation lines suggesting terroir -->
  <g opacity="0.06" stroke="#ece3ce" stroke-width="1" fill="none">
    <path d="M 0 480 Q 200 440 400 460 T 800 470 T 1200 450"/>
    <path d="M 0 510 Q 220 480 440 495 T 860 500 T 1200 485"/>
    <path d="M 0 540 Q 240 520 480 530 T 900 525 T 1200 520"/>
    <path d="M 0 570 Q 260 555 520 560 T 940 555 T 1200 555"/>
  </g>

  <!-- Top eyebrow rule + label -->
  <line x1="80" y1="100" x2="180" y2="100" stroke="#b08d57" stroke-width="1.5"/>
  <text x="200" y="106" font-family="Georgia, 'Cormorant Garamond', serif" font-size="14" letter-spacing="6" fill="#b08d57" font-weight="500">TREADVILLE  ·  KENYA</text>

  <!-- Main wordmark (editorial serif, oversized) -->
  <text x="80" y="280" font-family="Georgia, 'Cormorant Garamond', serif" font-size="124" font-weight="500" fill="#f5f0e6" letter-spacing="-2">Treadville</text>

  <!-- Subtitle -->
  <text x="80" y="345" font-family="Georgia, 'Cormorant Garamond', serif" font-size="34" font-style="italic" font-weight="400" fill="#d9c39a" letter-spacing="0.5">From Kenyan soil to global markets.</text>

  <!-- Bronze rule -->
  <line x1="80" y1="430" x2="1120" y2="430" stroke="url(#rule)" stroke-width="1"/>

  <!-- Footer metadata line: provenance descriptor -->
  <text x="80" y="500" font-family="Georgia, 'Cormorant Garamond', serif" font-size="20" fill="#ece3ce" opacity="0.85">Specialty coffee  ·  Tea  ·  Horticulture  ·  Grains</text>
  <text x="80" y="540" font-family="Georgia, 'Cormorant Garamond', serif" font-size="18" fill="#b08d57" letter-spacing="2" font-style="italic">Traceable origins. Exceptional quality.</text>

  <!-- Domain mark (right side, restrained) -->
  <text x="1120" y="540" font-family="Georgia, 'Cormorant Garamond', serif" font-size="18" fill="#ece3ce" opacity="0.7" text-anchor="end">treadville.co.ke</text>
</svg>`;

// ============================================================
// FAVICON / ICON — minimal T monogram (192x192 for icon.png; browser will scale)
// Dark soil background, bronze serif T
// ============================================================
const icon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="iconbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a1410"/>
      <stop offset="100%" stop-color="#0a0805"/>
    </linearGradient>
  </defs>
  <rect width="192" height="192" fill="url(#iconbg)"/>
  <!-- Bronze rule top -->
  <line x1="40" y1="38" x2="152" y2="38" stroke="#b08d57" stroke-width="2" opacity="0.85"/>
  <!-- T monogram -->
  <text x="96" y="142" font-family="Georgia, 'Cormorant Garamond', serif" font-size="120" font-weight="500" fill="#f5f0e6" text-anchor="middle" letter-spacing="-2">T</text>
  <!-- Subtle bronze bar under monogram -->
  <line x1="80" y1="160" x2="112" y2="160" stroke="#b08d57" stroke-width="1.5" opacity="0.6"/>
</svg>`;

async function run() {
  const publicDir = path.join(__dirname, "..", "public");
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  // OG image 1200x630
  await sharp(Buffer.from(ogImage))
    .png({ quality: 95, compressionLevel: 9 })
    .toFile(path.join(publicDir, "og-default.png"));
  console.log("✓ /public/og-default.png written (1200x630)");

  // Icon 192x192 (browser will scale)
  await sharp(Buffer.from(icon))
    .png({ quality: 95, compressionLevel: 9 })
    .toFile(path.join(publicDir, "icon.png"));
  console.log("✓ /public/icon.png written (192x192)");

  // Apple touch icon (180x180) — bonus
  await sharp(Buffer.from(icon))
    .resize(180, 180)
    .png({ quality: 95, compressionLevel: 9 })
    .toFile(path.join(publicDir, "apple-touch-icon.png"));
  console.log("✓ /public/apple-touch-icon.png written (180x180)");

  // Verify
  for (const f of ["og-default.png", "icon.png", "apple-touch-icon.png"]) {
    const p = path.join(publicDir, f);
    if (fs.existsSync(p)) {
      const stats = fs.statSync(p);
      console.log(`  ${f}: ${(stats.size / 1024).toFixed(1)} KB`);
    } else {
      console.error(`✗ ${f} not created`);
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
