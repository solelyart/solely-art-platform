import mysql from 'mysql2/promise';

// Artist profile IDs and their user IDs
const artists = [
  { artistId: 1, userId: 150007, name: 'Elena Martinez' },
  { artistId: 2, userId: 150008, name: 'Marcus Chen' },
  { artistId: 3, userId: 150009, name: 'Sophia Anderson' },
  { artistId: 4, userId: 150010, name: 'James Rodriguez' },
  { artistId: 5, userId: 150011, name: 'Aria Thompson' },
  { artistId: 6, userId: 150012, name: 'Oliver Kim' },
];

// Get future dates
function getFutureDate(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(10 + Math.floor(Math.random() * 8), 0, 0, 0); // Random hour between 10am-6pm
  return date;
}

// Sample booking descriptions
const bookingDescriptions = [
  { service: 'Portrait Session', budget: 25000, notes: 'Looking for a professional headshot for my LinkedIn profile' },
  { service: 'Event Photography', budget: 50000, notes: 'Wedding anniversary celebration, 4 hours coverage needed' },
  { service: 'Custom Artwork', budget: 75000, notes: 'Commission for a family portrait painting, 24x36 inches' },
  { service: 'Logo Design', budget: 35000, notes: 'Need a modern logo for my new startup' },
  { service: 'Music Composition', budget: 45000, notes: 'Original soundtrack for a short film, 10 minutes total' },
  { service: 'Sculpture Commission', budget: 100000, notes: 'Bronze sculpture for garden installation' },
  { service: 'Calligraphy Work', budget: 15000, notes: 'Wedding invitation suite, 100 pieces' },
  { service: 'Digital Illustration', budget: 30000, notes: 'Character designs for mobile game, 5 characters' },
];

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  console.log('=== Creating Upcoming Bookings ===\n');

  // First, get some client user IDs (users who are not artists)
  const [clients] = await connection.execute(
    `SELECT u.id, u.name FROM users u 
     WHERE u.id NOT IN (SELECT userId FROM artistProfiles)
     LIMIT 10`
  );

  if (clients.length === 0) {
    // Create some sample client users if none exist
    console.log('Creating sample client users...');
    const clientNames = ['Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson', 'Jessica Taylor'];
    for (const name of clientNames) {
      const openId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await connection.execute(
        `INSERT INTO users (openId, name, userType, createdAt, updatedAt, lastSignedIn)
         VALUES (?, ?, 'client', NOW(), NOW(), NOW())`,
        [openId, name]
      );
    }
    // Re-fetch clients
    const [newClients] = await connection.execute(
      `SELECT u.id, u.name FROM users u 
       WHERE u.id NOT IN (SELECT userId FROM artistProfiles)
       ORDER BY id DESC LIMIT 10`
    );
    clients.push(...newClients);
  }

  console.log(`Found ${clients.length} clients for bookings\n`);

  // Create pending bookings (future dates, status: pending)
  console.log('Creating pending bookings...');
  let pendingCount = 0;
  for (let i = 0; i < 6; i++) {
    const artist = artists[i % artists.length];
    const client = clients[i % clients.length];
    const booking = bookingDescriptions[i % bookingDescriptions.length];
    const futureDate = getFutureDate(3 + i * 2); // 3, 5, 7, 9, 11, 13 days from now

    await connection.execute(
      `INSERT INTO bookings (clientId, artistId, serviceDescription, requestedDate, status, budget, notes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 'pending', ?, ?, NOW(), NOW())`,
      [client.id, artist.artistId, booking.service, futureDate, booking.budget, booking.notes]
    );
    console.log(`  Pending: ${client.name} → ${artist.name} for ${booking.service} on ${futureDate.toDateString()}`);
    pendingCount++;
  }

  // Create accepted bookings (future dates, status: accepted)
  console.log('\nCreating accepted bookings...');
  let acceptedCount = 0;
  for (let i = 0; i < 6; i++) {
    const artist = artists[(i + 3) % artists.length];
    const client = clients[(i + 2) % clients.length];
    const booking = bookingDescriptions[(i + 4) % bookingDescriptions.length];
    const futureDate = getFutureDate(1 + i); // 1, 2, 3, 4, 5, 6 days from now

    await connection.execute(
      `INSERT INTO bookings (clientId, artistId, serviceDescription, requestedDate, status, budget, notes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 'accepted', ?, ?, NOW(), NOW())`,
      [client.id, artist.artistId, booking.service, futureDate, booking.budget, booking.notes]
    );
    console.log(`  Accepted: ${client.name} → ${artist.name} for ${booking.service} on ${futureDate.toDateString()}`);
    acceptedCount++;
  }

  // Verify
  console.log('\n=== Summary ===');
  const [pendingBookings] = await connection.execute(
    `SELECT COUNT(*) as count FROM bookings WHERE status = 'pending' AND requestedDate > NOW()`
  );
  const [acceptedBookings] = await connection.execute(
    `SELECT COUNT(*) as count FROM bookings WHERE status = 'accepted' AND requestedDate > NOW()`
  );
  console.log(`Pending bookings (future): ${pendingBookings[0].count}`);
  console.log(`Accepted bookings (future): ${acceptedBookings[0].count}`);

  await connection.end();
  console.log('\n=== Upcoming bookings created ===');
}

main().catch(console.error);
