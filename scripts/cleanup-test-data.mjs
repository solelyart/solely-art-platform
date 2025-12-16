import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  console.log('=== Cleanup Test Data Script ===\n');
  console.log('Deleting test data using SQL patterns...\n');

  const testNamePatterns = `
    (u.name LIKE '%Test Artist%' 
     OR u.name LIKE '%Test Client%'
     OR u.name LIKE '%E2E Test%'
     OR u.name LIKE '%Availability Test%'
     OR u.name LIKE '%Calendar Test%'
     OR u.name LIKE '%Multi-booking%'
     OR u.name LIKE '%Pacific Artist%'
     OR u.name LIKE '%Lifecycle%'
     OR u.name LIKE '%Race Conditions%'
     OR u.name LIKE '%Double Booking%')
  `;

  // 1. Delete messages for test conversations (using participant1Id and participant2Id)
  await connection.execute(`
    DELETE m FROM messages m
    INNER JOIN conversations c ON m.conversationId = c.id
    INNER JOIN users u ON (c.participant1Id = u.id OR c.participant2Id = u.id)
    WHERE ${testNamePatterns}
  `);
  console.log('Deleted test messages');

  // 2. Delete test conversations
  await connection.execute(`
    DELETE c FROM conversations c
    INNER JOIN users u ON (c.participant1Id = u.id OR c.participant2Id = u.id)
    WHERE ${testNamePatterns}
  `);
  console.log('Deleted test conversations');

  // 3. Delete portfolio items for test artists
  await connection.execute(`
    DELETE pi FROM portfolioItems pi
    INNER JOIN portfolioCollections pc ON pi.collectionId = pc.id
    INNER JOIN users u ON pc.artistId = u.id
    WHERE ${testNamePatterns}
  `);
  console.log('Deleted test portfolio items');

  // 4. Delete portfolio collections for test artists
  await connection.execute(`
    DELETE pc FROM portfolioCollections pc
    INNER JOIN users u ON pc.artistId = u.id
    WHERE ${testNamePatterns}
  `);
  console.log('Deleted test portfolio collections');

  // 5. Delete bookings for test users
  await connection.execute(`
    DELETE b FROM bookings b
    INNER JOIN users u ON (b.artistId = u.id OR b.clientId = u.id)
    WHERE ${testNamePatterns}
  `);
  console.log('Deleted test bookings');

  // 6. Delete reviews for test users
  await connection.execute(`
    DELETE r FROM reviews r
    INNER JOIN users u ON (r.artistId = u.id OR r.clientId = u.id)
    WHERE ${testNamePatterns}
  `);
  console.log('Deleted test reviews');

  // 7. Delete services for test artists
  await connection.execute(`
    DELETE s FROM services s
    INNER JOIN users u ON s.artistId = u.id
    WHERE ${testNamePatterns}
  `);
  console.log('Deleted test services');

  // 8. Delete availability windows for test artists
  await connection.execute(`
    DELETE aw FROM availabilityWindows aw
    INNER JOIN users u ON aw.artistId = u.id
    WHERE ${testNamePatterns}
  `);
  console.log('Deleted test availability windows');

  // 9. Delete blackout dates for test artists
  await connection.execute(`
    DELETE bd FROM blackoutDates bd
    INNER JOIN users u ON bd.artistId = u.id
    WHERE ${testNamePatterns}
  `);
  console.log('Deleted test blackout dates');

  // 10. Delete artist settings for test artists
  await connection.execute(`
    DELETE ast FROM artistSettings ast
    INNER JOIN users u ON ast.artistId = u.id
    WHERE ${testNamePatterns}
  `);
  console.log('Deleted test artist settings');

  // 11. Delete slot locks for test artists
  await connection.execute(`
    DELETE sl FROM slotLocks sl
    INNER JOIN users u ON sl.artistId = u.id
    WHERE ${testNamePatterns}
  `);
  console.log('Deleted test slot locks');

  // 12. Delete artist profiles for test users
  await connection.execute(`
    DELETE ap FROM artistProfiles ap
    INNER JOIN users u ON ap.userId = u.id
    WHERE ${testNamePatterns}
  `);
  console.log('Deleted test artist profiles');

  // 13. Finally delete test users (keep IDs 1-4 which are sample artists)
  const [result] = await connection.execute(`
    DELETE FROM users 
    WHERE (name LIKE '%Test Artist%' 
     OR name LIKE '%Test Client%'
     OR name LIKE '%E2E Test%'
     OR name LIKE '%Availability Test%'
     OR name LIKE '%Calendar Test%'
     OR name LIKE '%Multi-booking%'
     OR name LIKE '%Pacific Artist%'
     OR name LIKE '%Lifecycle%'
     OR name LIKE '%Race Conditions%'
     OR name LIKE '%Double Booking%')
      AND id NOT IN (1, 2, 3, 4)
  `);
  console.log(`Deleted ${result.affectedRows} test users`);

  // 14. Verify remaining users
  const [remainingUsers] = await connection.execute(`
    SELECT id, name, userType FROM users ORDER BY id LIMIT 50
  `);
  console.log(`\n=== Remaining users: ${remainingUsers.length} ===`);
  remainingUsers.forEach(u => console.log(`  - ID ${u.id}: ${u.name} (${u.userType})`));

  await connection.end();
  console.log('\n=== Cleanup complete ===');
}

main().catch(console.error);
