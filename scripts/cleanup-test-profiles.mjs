import mysql from 'mysql2/promise';

// Keep these artist profile IDs (main sample artists + Jane Doe)
const keepProfileIds = [1, 2, 3, 4, 5, 6, 150001];

async function safeDelete(connection, query, params, description) {
  try {
    const [result] = await connection.execute(query, params);
    console.log(`  Deleted ${result.affectedRows} ${description}`);
    return result.affectedRows;
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') {
      console.log(`  Skipped ${description} (table doesn't exist)`);
      return 0;
    }
    throw err;
  }
}

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  console.log('=== Cleaning Up Test Artist Profiles ===\n');

  // Get all test profile IDs to delete
  const [profiles] = await connection.execute(
    `SELECT id, displayName FROM artistProfiles WHERE id NOT IN (${keepProfileIds.join(',')})`
  );
  
  console.log(`Found ${profiles.length} test profiles to delete`);

  if (profiles.length === 0) {
    console.log('No test profiles to delete.');
    await connection.end();
    return;
  }

  const testIds = profiles.map(p => p.id);
  const placeholders = testIds.map(() => '?').join(',');

  // Delete related data first (foreign key constraints)
  console.log('\nDeleting related data...');

  // Delete portfolio items for test profiles
  await safeDelete(connection,
    `DELETE pi FROM portfolioItems pi 
     INNER JOIN portfolioCollections pc ON pi.collectionId = pc.id 
     WHERE pc.artistId IN (${placeholders})`,
    testIds, 'portfolio items');

  // Delete portfolio collections for test profiles
  await safeDelete(connection,
    `DELETE FROM portfolioCollections WHERE artistId IN (${placeholders})`,
    testIds, 'portfolio collections');

  // Delete services for test profiles
  await safeDelete(connection,
    `DELETE FROM services WHERE artistId IN (${placeholders})`,
    testIds, 'services');

  // Delete availability settings for test profiles (table name might be different)
  await safeDelete(connection,
    `DELETE FROM artistAvailabilitySettings WHERE artistId IN (${placeholders})`,
    testIds, 'availability settings');

  // Delete availability slots for test profiles
  await safeDelete(connection,
    `DELETE FROM artistAvailabilitySlots WHERE artistId IN (${placeholders})`,
    testIds, 'availability slots');

  // Delete blackout dates for test profiles
  await safeDelete(connection,
    `DELETE FROM artistBlackoutDates WHERE artistId IN (${placeholders})`,
    testIds, 'blackout dates');

  // Delete reviews for test profiles
  await safeDelete(connection,
    `DELETE FROM reviews WHERE artistId IN (${placeholders})`,
    testIds, 'reviews');

  // Delete bookings for test profiles
  await safeDelete(connection,
    `DELETE FROM bookings WHERE artistId IN (${placeholders})`,
    testIds, 'bookings');

  // Delete slot locks for test profiles
  await safeDelete(connection,
    `DELETE FROM slotLocks WHERE artistId IN (${placeholders})`,
    testIds, 'slot locks');

  // Finally delete the artist profiles
  console.log('\nDeleting artist profiles...');
  const [profilesResult] = await connection.execute(
    `DELETE FROM artistProfiles WHERE id IN (${placeholders})`,
    testIds
  );
  console.log(`  Deleted ${profilesResult.affectedRows} artist profiles`);

  // Verify
  const [remaining] = await connection.execute('SELECT id, displayName FROM artistProfiles ORDER BY id');
  console.log('\n=== Remaining Artist Profiles ===');
  remaining.forEach(p => console.log(`  ${p.displayName} (ID: ${p.id})`));

  await connection.end();
  console.log('\n=== Cleanup complete ===');
}

main().catch(console.error);
