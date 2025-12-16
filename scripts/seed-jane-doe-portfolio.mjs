import mysql from 'mysql2/promise';

// Jane Doe's portfolio images
const janePortfolioImages = [
  {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/QiaarpafgkXZoeYK.jpg',
    title: 'Feminine Elegance',
    description: 'A dramatic portrait capturing feminine grace with theatrical lighting'
  },
  {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/jWFCzUceKeQoAvBV.jpg',
    title: 'Low-Key Drama',
    description: 'Studio portrait using low-key lighting to create dramatic shadows and depth'
  },
  {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/gafUtyaCnDjvzcyG.jpg',
    title: 'Moody Studio Portrait',
    description: 'Dark and moody studio portrait with cinematic atmosphere'
  },
  {
    url: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/JuEhgrRNuhfWUkIA.jpg',
    title: 'Artistic Shadow Play',
    description: 'Creative portrait exploring the interplay of light and shadow'
  }
];

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  console.log('=== Adding Portfolio for Jane Doe ===\n');

  // Jane Doe's artist profile ID is 150001
  const janeArtistId = 150001;

  // Create a portfolio collection for Jane Doe (using 'title' not 'name')
  const [collectionResult] = await connection.execute(
    `INSERT INTO portfolioCollections (artistId, title, description, displayOrder, isFeatured, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
    [janeArtistId, 'Portrait Photography', 'A collection of dramatic and artistic portrait photography', 1, 1]
  );
  const collectionId = collectionResult.insertId;
  console.log(`Created collection "Portrait Photography" (ID: ${collectionId})`);

  // Add portfolio items
  for (let i = 0; i < janePortfolioImages.length; i++) {
    const img = janePortfolioImages[i];
    const [itemResult] = await connection.execute(
      `INSERT INTO portfolioItems (collectionId, imageUrl, title, description, displayOrder, isFeatured, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [collectionId, img.url, img.title, img.description, i + 1, i === 0 ? 1 : 0]
    );
    console.log(`  Added: ${img.title}`);
  }

  // Verify
  console.log('\n=== Verification ===');
  const [items] = await connection.execute(
    `SELECT pi.title, pi.imageUrl FROM portfolioItems pi
     JOIN portfolioCollections pc ON pi.collectionId = pc.id
     WHERE pc.artistId = ?`,
    [janeArtistId]
  );
  console.log(`Jane Doe now has ${items.length} portfolio items`);

  await connection.end();
  console.log('\n=== Jane Doe portfolio added ===');
}

main().catch(console.error);
