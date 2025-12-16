import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Portfolio images mapping for each artist
const artistPortfolios = {
  // Elena Martinez (ID 150007) - Portrait & Fine Art Painter
  150007: [
    { file: 'd982w3xa1oPj.jpeg', title: 'Portrait Study', description: 'Fine art portrait capturing emotion and light' },
    { file: 'jKxNxdUPZWOS.jpg', title: 'Contemporary Portrait', description: 'Modern portrait with artistic styling' },
    { file: '2R0CeN4qTjOB.jpg', title: 'Studio Portrait', description: 'Professional studio portrait photography' },
    { file: 'LXdML9odlXda.jpg', title: 'Abstract Expression', description: 'Abstract painting with bold colors' },
  ],
  // Marcus Chen (ID 150008) - Digital Artist & Illustrator
  150008: [
    { file: 'alhWGBTg6oDz.jpg', title: 'Fantasy Landscape', description: 'Digital illustration of a mystical world' },
    { file: 'WfxKUgohv7I1.jpg', title: 'Fantasy Character', description: 'Digital character illustration' },
    { file: 'B3UECrfEnd1i.jpg', title: 'Digital Art Collection', description: 'Various digital art pieces' },
    { file: 'WNZwdUDSBKpv.jpg', title: 'Colorful Abstract', description: 'Vibrant abstract digital painting' },
  ],
  // Sophia Anderson (ID 150009) - Landscape & Nature Photographer
  150009: [
    { file: 'WAVo6IkILEtL.jpg', title: 'Mountain Reflection', description: 'Serene mountain landscape with perfect reflection' },
    { file: 'vXoUsURqCzS0.jpg', title: 'Forest Morning', description: 'Misty forest at dawn' },
    { file: 'YCkeGgUWzHdZ.jpg', title: 'Tropical Paradise', description: 'Stunning tropical landscape photography' },
    { file: '3CCEyPQVLY6s.jpg', title: 'Photography Portfolio', description: 'Collection of landscape photographs' },
  ],
  // James Rodriguez (ID 150010) - Watercolor & Traditional Artist
  150010: [
    { file: 'xAPXq2X43HTb.jpg', title: 'Rose Watercolor', description: 'Delicate watercolor painting of a pink rose' },
    { file: 'SAZqUDo5LeM8.jpg', title: 'Wildflowers', description: 'Watercolor painting of spring wildflowers' },
    { file: 'tQvYBGdgmyVK.jpg', title: 'Floral Study', description: 'Watercolor tutorial piece - roses' },
    { file: 'KXbaHdK9cyqL.jpg', title: 'Abstract Colors', description: 'Colorful abstract wall art' },
  ],
  // Aria Thompson (ID 150011) - Contemporary & Mixed Media
  150011: [
    { file: 'DuWvQAYQTTQo.jpg', title: 'Portfolio Showcase', description: 'Mixed media art collection' },
    { file: '0jnvvFgbIGZ4.jpg', title: 'Gallery Exhibition', description: 'Contemporary art pieces' },
    { file: 'qZ2i0HgFnIe2.jpg', title: 'Sculpture Installation', description: 'Contemporary sculpture work' },
    { file: 'MGpwI9MvkVWY.jpg', title: 'Art Portfolio', description: 'Various art pieces from exhibitions' },
  ],
  // Oliver Kim (ID 150012) - Photography & Visual Arts
  150012: [
    { file: '99bnYTWfkPuj.jpg', title: 'Fine Art Photography', description: 'Artistic photography collection' },
    { file: '5Hi6YyL81rQ9.jpg', title: 'Photography Series', description: 'Fine art photography portfolio' },
    { file: 'kIB6IdGFpMbS.jpg', title: 'Artist at Work', description: 'Behind the scenes photography' },
    { file: 'fU0Wz06OiHd2.webp', title: 'Sculptural Forms', description: 'Contemporary sculpture photography' },
  ],
};

// S3 upload function using the built-in storage helper
async function uploadToS3(filePath, fileName) {
  const { storagePut } = await import('../server/storage.ts');
  
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(fileName).toLowerCase();
  const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 
                      ext === '.png' ? 'image/png' : 
                      ext === '.webp' ? 'image/webp' : 'image/jpeg';
  
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const fileKey = `portfolio/${Date.now()}-${randomSuffix}${ext}`;
  
  const result = await storagePut(fileKey, fileBuffer, contentType);
  return result;
}

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  console.log('=== Seeding Portfolio Images ===\n');

  const imagesDir = '/home/ubuntu/solely-art-platform/portfolio-images';

  for (const [artistId, images] of Object.entries(artistPortfolios)) {
    console.log(`\nProcessing artist ID ${artistId}...`);
    
    const portfolioUrls = [];
    
    for (const img of images) {
      const filePath = path.join(imagesDir, img.file);
      
      if (!fs.existsSync(filePath)) {
        console.log(`  ⚠️  File not found: ${img.file}`);
        continue;
      }
      
      try {
        console.log(`  Uploading ${img.file}...`);
        const result = await uploadToS3(filePath, img.file);
        portfolioUrls.push(result.url);
        console.log(`  ✅ Uploaded: ${img.title}`);
      } catch (error) {
        console.log(`  ❌ Failed to upload ${img.file}: ${error.message}`);
      }
    }
    
    if (portfolioUrls.length > 0) {
      // Update the artistProfiles table with portfolio images
      const portfolioJson = JSON.stringify(portfolioUrls);
      await connection.execute(
        `UPDATE artistProfiles SET portfolioImages = ? WHERE userId = ?`,
        [portfolioJson, artistId]
      );
      console.log(`  ✅ Updated artist profile with ${portfolioUrls.length} images`);
    }
  }

  // Verify the updates
  const [profiles] = await connection.execute(`
    SELECT userId, displayName, portfolioImages 
    FROM artistProfiles 
    WHERE userId IN (150007, 150008, 150009, 150010, 150011, 150012)
  `);
  
  console.log('\n=== Portfolio Summary ===');
  profiles.forEach(p => {
    const images = p.portfolioImages ? JSON.parse(p.portfolioImages) : [];
    console.log(`${p.displayName}: ${images.length} images`);
  });

  await connection.end();
  console.log('\n=== Portfolio seeding complete ===');
}

main().catch(console.error);
