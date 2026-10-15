/**
 * Rebuild public/og.jpg (1200×630) — real hero photograph + brand wordmark.
 * Run: bun scripts/make-og.mjs
 */
import sharp from "sharp";

const HERO =
  // Same crop the on-site hero uses (w=1920&h=1280) so the share card
  // matches what visitors see; resized/cropped locally to 1200×630.
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&h=1280&fit=crop&q=82&auto=format";

const CHARCOAL = "#121212";
const CREAM = "#F2EDE4";
const GOLD = "#C9A24B";

/* Cedar-of-Lebanon mark — same paths as CedarLeaf (viewBox 0 0 24 24). */
const cedar = (tx, ty, scale, color) => `
  <g transform="translate(${tx} ${ty}) scale(${scale})" fill="${color}">
    <path d="M12 1.5 16.2 7.5 H7.8 Z" />
    <path d="M12 5.5 18.4 13.5 H5.6 Z" />
    <path d="M12 10.5 20.8 19.5 H3.2 Z" />
    <path d="M10.7 19.5 h2.6 V23 h-2.6 Z" />
  </g>`;

const svg = Buffer.from(`
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0"    stop-color="${CHARCOAL}" stop-opacity="0.94"/>
      <stop offset="0.42" stop-color="${CHARCOAL}" stop-opacity="0.72"/>
      <stop offset="0.75" stop-color="${CHARCOAL}" stop-opacity="0.28"/>
      <stop offset="1"    stop-color="${CHARCOAL}" stop-opacity="0.16"/>
    </linearGradient>
    <linearGradient id="base" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.55" stop-color="${CHARCOAL}" stop-opacity="0"/>
      <stop offset="1"    stop-color="${CHARCOAL}" stop-opacity="0.85"/>
    </linearGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${GOLD}"/>
      <stop offset="1" stop-color="${GOLD}" stop-opacity="0.25"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#wash)"/>
  <rect width="1200" height="630" fill="url(#base)"/>
  <!-- match the on-site hero treatment (45% photo under charcoal washes) -->
  <rect width="1200" height="630" fill="${CHARCOAL}" opacity="0.42"/>

  ${cedar(78, 268, 2.4, GOLD)}

  <text x="76" y="428" font-family="DejaVu Serif, Liberation Serif, Georgia, serif"
        font-size="88" font-weight="bold" fill="${CREAM}">Blade &amp; Cedar</text>

  <rect x="78" y="466" width="96" height="3" fill="url(#rule)"/>

  <text x="78" y="516" font-family="DejaVu Sans, Liberation Sans, Arial, sans-serif"
        font-size="21" font-weight="bold" letter-spacing="7" fill="${GOLD}">HAMRA · BEIRUT — EST. 2016</text>

  <text x="78" y="556" font-family="DejaVu Sans, Liberation Sans, Arial, sans-serif"
        font-size="19" letter-spacing="2.5" fill="${CREAM}" fill-opacity="0.72">Premium barbering — book on WhatsApp</text>
</svg>`);

const hero = await fetch(HERO);
if (!hero.ok) throw new Error(`hero fetch failed: ${hero.status}`);
const heroBuf = Buffer.from(await hero.arrayBuffer());

await sharp(heroBuf)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .modulate({ saturation: 0.72, brightness: 0.9 })
  .composite([{ input: svg, top: 0, left: 0 }])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile("public/og.jpg");

const meta = await sharp("public/og.jpg").metadata();
console.log(`og.jpg rebuilt: ${meta.width}x${meta.height}`);
