// One-off image optimization: resize oversized PNGs and encode as WebP.
// Originals are moved to ../image-originals-backup (outside the build).
// Run with: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdirSync, mkdirSync, renameSync, statSync, existsSync } from 'fs';
import { join } from 'path';

const PUBLIC = 'public';
const BACKUP = 'image-originals-backup';

// Files we want to convert to WebP (the large photographic assets).
const TARGETS = [
  'classic-1.png', 'classic-2.png', 'classic-nutri.png',
  'dark-1.png', 'dark-2.png', 'dark-3.png', 'dark-nutri.png',
  'milk-1.png', 'milk-2.png', 'milk-3.png', 'milk-nutri.png',
  'combo-1.png', 'combo-2.png', 'combo-3.png', 'combo-nutri.png',
  'hero-banner.png',
];

// Per-file treatment. Nutrition labels keep more resolution for legibility.
function plan(name) {
  if (name.includes('nutri')) return { box: 1400, quality: 82 };
  if (name.startsWith('hero')) return { box: 1920, quality: 80 };
  return { box: 1200, quality: 78 }; // product photos shown in cards/galleries
}

mkdirSync(BACKUP, { recursive: true });

let before = 0, after = 0;
for (const name of TARGETS) {
  const src = join(PUBLIC, name);
  if (!existsSync(src)) { console.log(`skip (missing): ${name}`); continue; }
  const { box, quality } = plan(name);
  const out = join(PUBLIC, name.replace(/\.png$/i, '.webp'));
  const inBytes = statSync(src).size;

  const meta = await sharp(src).metadata();
  await sharp(src)
    .resize(box, box, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(out);

  const outBytes = statSync(out).size;
  before += inBytes; after += outBytes;
  console.log(
    `${name.padEnd(18)} ${meta.width}x${meta.height} ${(inBytes/1048576).toFixed(2)}MB`.padEnd(48) +
    `-> ${(outBytes/1024).toFixed(0)}KB  (-${(100 - outBytes/inBytes*100).toFixed(1)}%)`
  );

  // Move the original PNG out of the build.
  renameSync(src, join(BACKUP, name));
}

console.log('\n' + '='.repeat(60));
console.log(`Total: ${(before/1048576).toFixed(2)} MB -> ${(after/1048576).toFixed(2)} MB ` +
            `(saved ${((before-after)/1048576).toFixed(2)} MB, -${(100 - after/before*100).toFixed(1)}%)`);
