import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SOURCE_LOGO = './client/public/images/brand/logo-full-teal.png';
const OUTPUT_DIR = './client/public';

async function generateFavicons() {
  console.log('Generating favicons from:', SOURCE_LOGO);
  
  // Read source image
  const sourceBuffer = fs.readFileSync(SOURCE_LOGO);
  
  // Generate different sizes
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
  ];
  
  for (const { name, size } of sizes) {
    await sharp(sourceBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 245, g: 242, b: 237, alpha: 0 } })
      .png()
      .toFile(path.join(OUTPUT_DIR, name));
    console.log(`Generated: ${name} (${size}x${size})`);
  }
  
  // Generate ICO file (using 32x32 PNG as base)
  await sharp(sourceBuffer)
    .resize(32, 32, { fit: 'contain', background: { r: 245, g: 242, b: 237, alpha: 0 } })
    .png()
    .toFile(path.join(OUTPUT_DIR, 'favicon.png'));
  
  // Copy as favicon.ico (browsers accept PNG with .ico extension)
  fs.copyFileSync(
    path.join(OUTPUT_DIR, 'favicon-32x32.png'),
    path.join(OUTPUT_DIR, 'favicon.ico')
  );
  console.log('Generated: favicon.ico');
  
  console.log('\\nFavicon generation complete!');
}

generateFavicons().catch(console.error);
