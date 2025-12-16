import mysql from 'mysql2/promise';

// Portfolio data for each artist with collections and items
const portfolioData = {
  // Elena Martinez (artistId 1) - Portrait & Fine Art Painter
  1: {
    collections: [
      { title: 'Portrait Collection', description: 'Fine art portraits capturing emotion and light', isFeatured: true },
      { title: 'Abstract Works', description: 'Abstract expressionism pieces', isFeatured: false },
    ],
    items: [
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/LfVBzlvWdmqoMKkX.jpeg', title: 'Portrait Study', description: 'Fine art portrait capturing emotion and light', isFeatured: true },
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/wngUhsZEWsbJkNcw.jpg', title: 'Contemporary Portrait', description: 'Modern portrait with artistic styling', isFeatured: true },
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/iYXZxDoSRJvWIgiz.jpg', title: 'Studio Portrait', description: 'Professional studio portrait photography', isFeatured: false },
      { collectionIndex: 1, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/FBSIyPRfUxKOAoPH.jpg', title: 'Abstract Expression', description: 'Abstract painting with bold colors', isFeatured: true },
    ],
  },
  // Marcus Chen (artistId 2) - Digital Artist & Illustrator
  2: {
    collections: [
      { title: 'Fantasy Illustrations', description: 'Digital fantasy art and character designs', isFeatured: true },
      { title: 'Abstract Digital', description: 'Abstract digital paintings', isFeatured: false },
    ],
    items: [
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/SyvmqVoiIhEgYWHt.jpg', title: 'Fantasy Landscape', description: 'Digital illustration of a mystical world', isFeatured: true },
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/vntjqlfzKvcKmeii.jpg', title: 'Fantasy Character', description: 'Digital character illustration', isFeatured: true },
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/YxZMSHzgMSnsmpjs.jpg', title: 'Digital Art Collection', description: 'Various digital art pieces', isFeatured: false },
      { collectionIndex: 1, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/aQLcqxUkACEubSqM.jpg', title: 'Colorful Abstract', description: 'Vibrant abstract digital painting', isFeatured: true },
    ],
  },
  // Sophia Anderson (artistId 3) - Landscape & Nature Photographer
  3: {
    collections: [
      { title: 'Landscape Photography', description: 'Breathtaking landscape and nature photography', isFeatured: true },
    ],
    items: [
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/hOeSDsfqtpgxVaFB.jpg', title: 'Mountain Reflection', description: 'Serene mountain landscape with perfect reflection', isFeatured: true },
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/LCgUcPUDZgaMNjGb.jpg', title: 'Forest Morning', description: 'Misty forest at dawn', isFeatured: true },
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/bvCwfYZRMYfXuIHa.jpg', title: 'Tropical Paradise', description: 'Stunning tropical landscape photography', isFeatured: true },
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/cgUfCmncnEqkGofq.jpg', title: 'Photography Portfolio', description: 'Collection of landscape photographs', isFeatured: false },
    ],
  },
  // James Rodriguez (artistId 4) - Watercolor & Traditional Artist
  4: {
    collections: [
      { title: 'Watercolor Florals', description: 'Delicate watercolor paintings of flowers and nature', isFeatured: true },
    ],
    items: [
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/niGdfvcyBEcGxZfO.jpg', title: 'Rose Watercolor', description: 'Delicate watercolor painting of a pink rose', isFeatured: true },
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/OhBllitMAOafmSVJ.jpg', title: 'Wildflowers', description: 'Watercolor painting of spring wildflowers', isFeatured: true },
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/UTMURuoYCmciWlfd.jpg', title: 'Floral Study', description: 'Watercolor tutorial piece - roses', isFeatured: true },
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/JQVRyMqTtkIWhHFX.jpg', title: 'Abstract Colors', description: 'Colorful abstract wall art', isFeatured: false },
    ],
  },
  // Aria Thompson (artistId 5) - Contemporary & Mixed Media
  5: {
    collections: [
      { title: 'Contemporary Art', description: 'Contemporary and mixed media art pieces', isFeatured: true },
      { title: 'Sculpture', description: 'Contemporary sculpture installations', isFeatured: false },
    ],
    items: [
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/RKGaNqUdFyfocpIW.jpg', title: 'Portfolio Showcase', description: 'Mixed media art collection', isFeatured: true },
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/fqHnIiJgvuNvqmpJ.jpg', title: 'Gallery Exhibition', description: 'Contemporary art pieces', isFeatured: true },
      { collectionIndex: 1, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/AWxFsAFEnusNmZgM.jpg', title: 'Sculpture Installation', description: 'Contemporary sculpture work', isFeatured: true },
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/FEbyrUhZjeuzYInx.jpg', title: 'Art Portfolio', description: 'Various art pieces from exhibitions', isFeatured: false },
    ],
  },
  // Oliver Kim (artistId 6) - Photography & Visual Arts
  6: {
    collections: [
      { title: 'Fine Art Photography', description: 'Artistic photography collection', isFeatured: true },
    ],
    items: [
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/XsqslkyVmscOlsgy.jpg', title: 'Fine Art Photography', description: 'Artistic photography collection', isFeatured: true },
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/xhcfGsVFvYpoPlKM.jpg', title: 'Photography Series', description: 'Fine art photography portfolio', isFeatured: true },
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/wMGnjLKAikeFzmce.jpg', title: 'Artist at Work', description: 'Behind the scenes photography', isFeatured: true },
      { collectionIndex: 0, imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/RxNeeYaUPkoLwNRd.webp', title: 'Sculptural Forms', description: 'Contemporary sculpture photography', isFeatured: false },
    ],
  },
};

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  console.log('=== Seeding Portfolio Collections and Items ===\n');

  for (const [artistId, data] of Object.entries(portfolioData)) {
    console.log(`Processing artist ID ${artistId}...`);
    
    const collectionIds = [];
    
    // Create collections
    for (const collection of data.collections) {
      const [result] = await connection.execute(
        `INSERT INTO portfolioCollections (artistId, title, description, isFeatured) VALUES (?, ?, ?, ?)`,
        [artistId, collection.title, collection.description, collection.isFeatured]
      );
      collectionIds.push(result.insertId);
      console.log(`  Created collection: ${collection.title} (ID: ${result.insertId})`);
    }
    
    // Create items
    for (const item of data.items) {
      const collectionId = collectionIds[item.collectionIndex];
      await connection.execute(
        `INSERT INTO portfolioItems (collectionId, imageUrl, title, description, isFeatured, displayOrder) VALUES (?, ?, ?, ?, ?, ?)`,
        [collectionId, item.imageUrl, item.title, item.description, item.isFeatured, 0]
      );
      console.log(`    Added item: ${item.title}`);
    }
  }

  // Verify
  const [collections] = await connection.execute(`SELECT COUNT(*) as count FROM portfolioCollections WHERE artistId IN (1,2,3,4,5,6)`);
  const [items] = await connection.execute(`
    SELECT COUNT(*) as count FROM portfolioItems pi 
    INNER JOIN portfolioCollections pc ON pi.collectionId = pc.id 
    WHERE pc.artistId IN (1,2,3,4,5,6)
  `);
  
  console.log(`\n=== Summary ===`);
  console.log(`Created ${collections[0].count} collections`);
  console.log(`Created ${items[0].count} portfolio items`);

  await connection.end();
  console.log('\n=== Portfolio seeding complete ===');
}

main().catch(console.error);
