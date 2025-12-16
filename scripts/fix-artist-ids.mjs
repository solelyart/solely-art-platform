import mysql from 'mysql2/promise';

// The issue: reviews and bookings use userId as artistId, but the profile page
// queries by artistProfile.id. We need to update the reviews/bookings to use
// the artistProfile.id instead of userId.

// Mapping: artistProfile.id -> userId
const artistMapping = {
  1: 150007,  // Elena Martinez
  2: 150008,  // Marcus Chen
  3: 150009,  // Sophia Anderson
  4: 150010,  // James Rodriguez
  5: 150011,  // Aria Thompson
  6: 150012,  // Oliver Kim
};

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  console.log('=== Fixing Artist ID References ===\n');

  // Update reviews: change artistId from userId to artistProfile.id
  for (const [profileId, userId] of Object.entries(artistMapping)) {
    const [result] = await connection.execute(
      `UPDATE reviews SET artistId = ? WHERE artistId = ?`,
      [profileId, userId]
    );
    if (result.affectedRows > 0) {
      console.log(`Updated ${result.affectedRows} reviews: artistId ${userId} -> ${profileId}`);
    }
  }

  // Update bookings: change artistId from userId to artistProfile.id
  for (const [profileId, userId] of Object.entries(artistMapping)) {
    const [result] = await connection.execute(
      `UPDATE bookings SET artistId = ? WHERE artistId = ?`,
      [profileId, userId]
    );
    if (result.affectedRows > 0) {
      console.log(`Updated ${result.affectedRows} bookings: artistId ${userId} -> ${profileId}`);
    }
  }

  // Verify the updates
  console.log('\n=== Verification ===');
  
  for (const [profileId, userId] of Object.entries(artistMapping)) {
    const [reviews] = await connection.execute(
      `SELECT COUNT(*) as count FROM reviews WHERE artistId = ?`,
      [profileId]
    );
    const [bookings] = await connection.execute(
      `SELECT COUNT(*) as count FROM bookings WHERE artistId = ?`,
      [profileId]
    );
    const [profile] = await connection.execute(
      `SELECT displayName FROM artistProfiles WHERE id = ?`,
      [profileId]
    );
    console.log(`${profile[0]?.displayName || 'Unknown'} (ID ${profileId}): ${reviews[0].count} reviews, ${bookings[0].count} bookings`);
  }

  await connection.end();
  console.log('\n=== Fix complete ===');
}

main().catch(console.error);
