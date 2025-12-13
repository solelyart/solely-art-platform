import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import * as schema from "./drizzle/schema.js";
import { readFileSync } from "fs";
import { storagePut } from "./server/storage.js";

const db = drizzle(process.env.DATABASE_URL);

// Map artists to their portfolio images
const artistPortfolios = {
  1: ["KhLlRWAxlfa6.jpg", "xkb7whQBHctR.jpg", "VdQDq9hhcxLL.jpg"], // Elena Martinez - Painter
  2: ["GvkcoUEMERWf.webp", "RKWS2X5Gb9RC.jpeg", "htlu2o7o6hLR.jpg"], // Marcus Chen - Photographer
  3: ["FQRsm3ULLViz.png", "sDaP3VCWlyL1.jpg", "VdQDq9hhcxLL.jpg"], // Sophia Anderson - Digital Artist
  4: ["sDaP3VCWlyL1.jpg", "htlu2o7o6hLR.jpg", "RKWS2X5Gb9RC.jpeg"], // James Rodriguez - Sculptor
  5: ["GvkcoUEMERWf.webp", "KhLlRWAxlfa6.jpg", "xkb7whQBHctR.jpg"], // Aria Thompson - Multi-disciplinary
  6: ["FQRsm3ULLViz.png", "xkb7whQBHctR.jpg", "VdQDq9hhcxLL.jpg"], // Oliver Kim - Calligrapher
};

async function uploadPortfolioImages() {
  console.log("🎨 Uploading portfolio images to sample artists...\n");

  for (const [artistIdStr, imageFiles] of Object.entries(artistPortfolios)) {
    const artistId = parseInt(artistIdStr);
    
    try {
      // Get artist info
      const artist = await db.select().from(schema.artistProfiles).where(eq(schema.artistProfiles.id, artistId)).limit(1);
      
      if (!artist || artist.length === 0) {
        console.log(`⚠️  Artist ${artistId} not found, skipping...`);
        continue;
      }

      console.log(`📸 Uploading images for ${artist[0].displayName}...`);
      
      const portfolioUrls = [];

      for (const imageFile of imageFiles) {
        try {
          // Read image file
          const imagePath = `/home/ubuntu/solely-art-platform/sample-images/${imageFile}`;
          const imageBuffer = readFileSync(imagePath);
          
          // Determine MIME type
          const ext = imageFile.split('.').pop().toLowerCase();
          const mimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'webp': 'image/webp',
          };
          const mimeType = mimeTypes[ext] || 'image/jpeg';

          // Upload to S3
          const fileKey = `artist-${artistId}/portfolio/${Date.now()}-${imageFile}`;
          const { url } = await storagePut(fileKey, imageBuffer, mimeType);
          
          portfolioUrls.push(url);
          console.log(`   ✓ Uploaded ${imageFile}`);
          
        } catch (error) {
          console.error(`   ✗ Failed to upload ${imageFile}:`, error.message);
        }
      }

      // Update artist profile with portfolio URLs
      if (portfolioUrls.length > 0) {
        await db.update(schema.artistProfiles)
          .set({ portfolioImages: JSON.stringify(portfolioUrls) })
          .where(eq(schema.artistProfiles.id, artistId));
        
        console.log(`✅ ${artist[0].displayName}: ${portfolioUrls.length} images uploaded\n`);
      }

    } catch (error) {
      console.error(`❌ Error processing artist ${artistId}:`, error.message);
    }
  }

  console.log("🎉 Portfolio images uploaded successfully!");
  console.log("\n📝 Next steps:");
  console.log("1. Visit /browse to see artist cards with portfolio images");
  console.log("2. Click on an artist to view their full portfolio");
  
  process.exit(0);
}

uploadPortfolioImages().catch(console.error);
