// One-off tool: generates public/favicon.svg and public/icons/*.png from a
// single hand-authored SVG design (issue #13 — replace placeholder PWA icons).
//
// The icon depicts a stylized geometric "ā" — the a-macron used throughout
// Sarnami romanization (see CLAUDE.md "Content authoring") — in the app's
// Suriname-flag-derived palette. It is built entirely from primitive shapes
// (no font dependency), so it renders identically everywhere.
//
// Usage: node scripts/generate-icons.mjs
// Requires the "sharp" devDependency (kept in package.json for future
// regeneration if the design ever needs to change).
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const COLORS = {
  forest: "#377E3F",
  cream: "#fdf6ec",
  gold: "#ECC81D",
  flame: "#B40A2D",
};

/**
 * Builds the "ā" glyph (bowl + stem + macron + accent dot) as a group of
 * primitives, centered on (256, 256) in a 512-unit design grid, then
 * scaled/translated by `scale` around the center. scale=1 gives a bold,
 * full-bleed treatment (used for icon-192 / icon-512 / favicon); a smaller
 * scale keeps everything inside the ~80% maskable safe-zone circle.
 */
function glyphGroup(scale) {
  return `
    <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">
      <!-- macron (the "ā" accent mark) -->
      <rect x="176" y="88" width="140" height="34" rx="17" fill="${COLORS.gold}" />
      <!-- bowl: closed ring -->
      <circle cx="234" cy="298" r="88" fill="none" stroke="${COLORS.cream}" stroke-width="46" />
      <!-- stem: flush with the bowl's top (no ascender) so it reads as a
           single-story "a", not a "d" -->
      <rect x="270" y="192" width="46" height="154" rx="23" fill="${COLORS.cream}" />
      <!-- accent dot: third flag color, echoes a spoken-word / chat dot -->
      <circle cx="352" cy="366" r="20" fill="${COLORS.flame}" />
    </g>
  `;
}

function iconSvg({ size, scale, rounded }) {
  const r = rounded ? size * 0.22 : 0;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
      <rect x="0" y="0" width="512" height="512" rx="${rounded ? 512 * 0.22 : 0}" fill="${COLORS.forest}" />
      ${glyphGroup(scale)}
    </svg>
  `;
}

async function main() {
  // favicon.svg: same design, full-bleed square, no forced rounding (browsers
  // handle the tab-icon shape themselves).
  const faviconSvg = iconSvg({ size: 64, scale: 1, rounded: false }).trim();
  writeFileSync(resolve(root, "public/favicon.svg"), faviconSvg + "\n");

  // icon-192 / icon-512 ("any" purpose): full-bleed square background, bold glyph.
  const icon192 = iconSvg({ size: 192, scale: 1, rounded: false });
  const icon512 = iconSvg({ size: 512, scale: 1, rounded: false });

  // icon-maskable-512: background must fill the entire canvas edge-to-edge,
  // but the glyph is scaled down (~0.85x) so its farthest point (the macron
  // corner, radius ~186 at scale 1) stays comfortably inside the 80% safe
  // zone circle (radius 204.8 of a 512 canvas) after OS masks crop the art.
  const iconMaskable512 = iconSvg({ size: 512, scale: 0.85, rounded: false });

  const targets = [
    ["public/icons/icon-192.png", icon192, 192],
    ["public/icons/icon-512.png", icon512, 512],
    ["public/icons/icon-maskable-512.png", iconMaskable512, 512],
  ];

  for (const [relPath, svg, size] of targets) {
    const outPath = resolve(root, relPath);
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
    console.log(`wrote ${relPath}`);
  }
  console.log(`wrote public/favicon.svg`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
