import mysql from 'mysql2/promise';

// Profile image URLs from S3 uploads - mapped to user IDs (not artist profile IDs)
const profileImages = [
  { artistId: 1, userId: 150007, name: 'Elena Martinez', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/fBFflOdBiOvouziq.jpg' },
  { artistId: 2, userId: 150008, name: 'Marcus Chen', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/aTGyfdhDhTfnRCZk.jpg' },
  { artistId: 3, userId: 150009, name: 'Sophia Anderson', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/XbBZpxvnpHQiDhPv.jpg' },
  { artistId: 4, userId: 150010, name: 'James Rodriguez', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/bGiQuPnCqqZvJBJz.jpg' },
  { artistId: 5, userId: 150011, name: 'Aria Thompson', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/WkKLZaWxRuEYuAir.jpg' },
  { artistId: 6, userId: 150012, name: 'Oliver Kim', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/clIiicnsthQCAfpZ.jpg' },
  { artistId: 150001, userId: 1230029, name: 'Jane Doe', url: 'https://files.manuscdn.com/user_upload_by_module/session_file/95874016/aynISLbJvBvpgmVj.jpg' },
];

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  console.log('=== Updating Artist Profile Images ===\n');

  for (const artist of profileImages) {
    // Update the users table profilePhotoUrl
    const [result] = await connection.execute(
      'UPDATE users SET profilePhotoUrl = ? WHERE id = ?',
      [artist.url, artist.userId]
    );
    console.log(`Updated ${artist.name} (User ID: ${artist.userId}): ${result.affectedRows > 0 ? 'Success' : 'Not found'}`);
  }

  // Verify
  console.log('\n=== Verification ===');
  const [users] = await connection.execute(
    `SELECT u.id, u.name, u.profilePhotoUrl, ap.displayName 
     FROM users u 
     JOIN artistProfiles ap ON u.id = ap.userId 
     ORDER BY ap.id`
  );
  users.forEach(u => {
    console.log(`${u.displayName || u.name}: ${u.profilePhotoUrl ? 'Has image' : 'No image'}`);
  });

  await connection.end();
  console.log('\n=== Profile images updated ===');
}

main().catch(console.error);
