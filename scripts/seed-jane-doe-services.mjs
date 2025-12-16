import mysql from 'mysql2/promise';

// Jane Doe's artist profile ID
const janeArtistId = 150001;
const janeUserId = 1230029;

// Services for Jane Doe (portrait photographer & digital artist)
const services = [
  {
    name: 'Portrait Photography Session',
    description: 'Professional portrait photography session in studio or on location. Includes 1-hour shoot, 20+ edited photos, and online gallery delivery.',
    price: 25000, // $250
    durationMinutes: 60
  },
  {
    name: 'Headshot Package',
    description: 'Professional headshots for LinkedIn, corporate profiles, or acting portfolios. Includes 30-minute session and 5 retouched images.',
    price: 15000, // $150
    durationMinutes: 30
  },
  {
    name: 'Digital Art Commission',
    description: 'Custom digital portrait or artwork created from your photos or concepts. Perfect for gifts, social media, or personal use.',
    price: 35000, // $350
    durationMinutes: 180
  },
  {
    name: 'Event Photography',
    description: 'Professional photography coverage for events, parties, or celebrations. Includes 3-hour coverage and 100+ edited photos.',
    price: 50000, // $500
    durationMinutes: 180
  }
];

// Sample reviews for Jane Doe
const reviews = [
  { rating: 5, comment: 'Jane is absolutely incredible! She captured my personality perfectly in the headshots. The photos exceeded my expectations and I got so many compliments on LinkedIn.' },
  { rating: 5, comment: 'The portrait session was so much fun and the results were stunning. Jane made me feel comfortable and the lighting was perfect. Highly recommend!' },
  { rating: 4, comment: 'Great experience overall. Jane is professional and talented. The digital art commission turned out beautifully - my family loved it as a gift.' },
  { rating: 5, comment: 'Jane photographed our anniversary party and the photos are gorgeous. She captured all the special moments and delivered them quickly. Will definitely book again!' },
];

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  console.log('=== Adding Services for Jane Doe ===\n');

  // Add services
  for (const service of services) {
    const [result] = await connection.execute(
      `INSERT INTO services (artistId, name, description, price, durationMinutes, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [janeArtistId, service.name, service.description, service.price, service.durationMinutes]
    );
    console.log(`Added service: ${service.name} ($${service.price / 100})`);
  }

  // Get some client IDs for bookings
  const [clients] = await connection.execute(
    `SELECT id, name FROM users WHERE id NOT IN (SELECT userId FROM artistProfiles) LIMIT 4`
  );

  console.log(`\nFound ${clients.length} clients for bookings\n`);

  // Create completed bookings and reviews for Jane Doe
  console.log('=== Creating Completed Bookings and Reviews ===\n');
  
  for (let i = 0; i < Math.min(reviews.length, clients.length); i++) {
    const client = clients[i];
    const review = reviews[i];
    const service = services[i];
    
    // Create a completed booking (past date)
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - (7 + i * 3)); // 7, 10, 13, 16 days ago
    
    const [bookingResult] = await connection.execute(
      `INSERT INTO bookings (clientId, artistId, serviceDescription, requestedDate, status, budget, notes, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 'completed', ?, ?, NOW(), NOW())`,
      [client.id, janeArtistId, service.name, pastDate, service.price, 'Completed session - great experience!']
    );
    const bookingId = bookingResult.insertId;
    console.log(`Created completed booking #${bookingId} for ${client.name}`);
    
    // Create review for this booking
    const [reviewResult] = await connection.execute(
      `INSERT INTO reviews (bookingId, clientId, artistId, rating, comment, createdAt)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [bookingId, client.id, janeArtistId, review.rating, review.comment]
    );
    console.log(`  Added ${review.rating}-star review`);
  }

  // Verify
  console.log('\n=== Verification ===');
  const [serviceCount] = await connection.execute(
    'SELECT COUNT(*) as count FROM services WHERE artistId = ?',
    [janeArtistId]
  );
  const [reviewCount] = await connection.execute(
    'SELECT COUNT(*) as count, AVG(rating) as avgRating FROM reviews WHERE artistId = ?',
    [janeArtistId]
  );
  console.log(`Jane Doe now has ${serviceCount[0].count} services`);
  console.log(`Jane Doe now has ${reviewCount[0].count} reviews (avg rating: ${reviewCount[0].avgRating?.toFixed(1) || 'N/A'})`);

  await connection.end();
  console.log('\n=== Jane Doe services and reviews added ===');
}

main().catch(console.error);
