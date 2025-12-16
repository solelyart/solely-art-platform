import mysql from 'mysql2/promise';

// Sample data for each artist - will create both bookings and reviews
const artistData = {
  // Elena Martinez (ID 150007) - Portrait & Fine Art Painter
  150007: [
    { rating: 5, comment: "Elena captured my family's essence beautifully. Her attention to detail and ability to bring out genuine emotions in her portraits is remarkable. Highly recommend!", clientName: "Sarah Mitchell", service: "Custom Portrait Commission" },
    { rating: 5, comment: "Absolutely stunning work! Elena's portrait of my grandmother brought tears to our eyes. She truly has a gift for capturing personality and soul.", clientName: "David Chen", service: "Custom Portrait Commission" },
    { rating: 4, comment: "Great experience working with Elena. She was patient, professional, and the final portrait exceeded our expectations. Would definitely commission again.", clientName: "Jennifer Williams", service: "Art Consultation" },
  ],
  // Marcus Chen (ID 150008) - Digital Artist & Illustrator
  150008: [
    { rating: 5, comment: "Marcus created the most incredible fantasy illustration for my book cover. His imagination and technical skills are unmatched. The colors and details are breathtaking!", clientName: "Michael Torres", service: "Digital Illustration" },
    { rating: 5, comment: "Working with Marcus was a dream. He took my vague concept and turned it into a masterpiece. His digital art skills are truly next level.", clientName: "Emma Rodriguez", service: "Character Design" },
    { rating: 4, comment: "Very talented digital artist. Marcus delivered exactly what I envisioned for my game character designs. Quick turnaround and excellent communication.", clientName: "Alex Kim", service: "Character Design" },
  ],
  // Sophia Anderson (ID 150009) - Landscape & Nature Photographer
  150009: [
    { rating: 5, comment: "Sophia's landscape photography is absolutely breathtaking. She captured our wedding venue in ways we never imagined. Every photo tells a story.", clientName: "Rachel Green", service: "Nature Photography Session" },
    { rating: 5, comment: "I commissioned Sophia for nature prints for my office. The quality and composition of her work transformed our space. Truly talented photographer!", clientName: "Thomas Brown", service: "Fine Art Prints" },
    { rating: 5, comment: "Sophia has an incredible eye for light and composition. Her mountain photography collection is now the centerpiece of our living room.", clientName: "Lisa Anderson", service: "Fine Art Prints" },
  ],
  // James Rodriguez (ID 150010) - Watercolor & Traditional Artist
  150010: [
    { rating: 5, comment: "James's watercolor work is exquisite. He painted a custom piece of our garden that captures every delicate detail. A true master of the medium.", clientName: "Patricia Moore", service: "Custom Watercolor Painting" },
    { rating: 4, comment: "Beautiful floral watercolors! James created a series for our boutique that customers constantly compliment. His traditional technique is refreshing.", clientName: "Karen White", service: "Custom Watercolor Painting" },
    { rating: 5, comment: "Commissioned James for a botanical illustration series. His patience and skill with watercolors produced museum-quality pieces. Absolutely worth every penny.", clientName: "Robert Taylor", service: "Botanical Illustration" },
  ],
  // Aria Thompson (ID 150011) - Contemporary & Mixed Media
  150011: [
    { rating: 5, comment: "Aria's contemporary pieces are thought-provoking and visually stunning. She created a custom installation for our gallery that became the talk of the town.", clientName: "Christopher Lee", service: "Custom Art Installation" },
    { rating: 4, comment: "Very creative and innovative artist. Aria's mixed media approach brought a unique perspective to our corporate art collection.", clientName: "Amanda Davis", service: "Mixed Media Commission" },
    { rating: 5, comment: "Aria is a visionary. Her contemporary art piece for our home is a conversation starter at every gathering. Truly one-of-a-kind work.", clientName: "Daniel Martinez", service: "Mixed Media Commission" },
  ],
  // Oliver Kim (ID 150012) - Photography & Visual Arts
  150012: [
    { rating: 5, comment: "Oliver's fine art photography is exceptional. He captured our product line in ways that elevated our entire brand aesthetic. Highly professional.", clientName: "Jessica Wilson", service: "Commercial Photography" },
    { rating: 5, comment: "Working with Oliver was seamless. His artistic vision combined with technical expertise produced stunning results for our magazine feature.", clientName: "Mark Thompson", service: "Editorial Photography" },
    { rating: 4, comment: "Great photographer with a keen artistic eye. Oliver's work for our exhibition was well-received by critics and visitors alike.", clientName: "Nicole Garcia", service: "Fine Art Photography" },
  ],
};

// Sample clients
const sampleClients = [
  { name: 'Sarah Mitchell', email: 'sarah.mitchell@example.com' },
  { name: 'David Chen', email: 'david.chen@example.com' },
  { name: 'Jennifer Williams', email: 'jennifer.williams@example.com' },
  { name: 'Michael Torres', email: 'michael.torres@example.com' },
  { name: 'Emma Rodriguez', email: 'emma.rodriguez@example.com' },
  { name: 'Alex Kim', email: 'alex.kim@example.com' },
  { name: 'Rachel Green', email: 'rachel.green@example.com' },
  { name: 'Thomas Brown', email: 'thomas.brown@example.com' },
  { name: 'Lisa Anderson', email: 'lisa.anderson@example.com' },
  { name: 'Patricia Moore', email: 'patricia.moore@example.com' },
  { name: 'Karen White', email: 'karen.white@example.com' },
  { name: 'Robert Taylor', email: 'robert.taylor@example.com' },
  { name: 'Christopher Lee', email: 'christopher.lee@example.com' },
  { name: 'Amanda Davis', email: 'amanda.davis@example.com' },
  { name: 'Daniel Martinez', email: 'daniel.martinez@example.com' },
  { name: 'Jessica Wilson', email: 'jessica.wilson@example.com' },
  { name: 'Mark Thompson', email: 'mark.thompson@example.com' },
  { name: 'Nicole Garcia', email: 'nicole.garcia@example.com' },
];

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  console.log('=== Seeding Bookings and Reviews ===\n');

  // Insert sample clients
  for (const client of sampleClients) {
    const openId = `sample-client-${client.email.replace('@example.com', '')}`;
    try {
      await connection.execute(
        `INSERT INTO users (openId, name, email, userType, role) VALUES (?, ?, ?, 'client', 'user')
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [openId, client.name, client.email]
      );
    } catch (e) {
      // Ignore duplicate errors
    }
  }

  // Get client IDs
  const [clients] = await connection.execute(`
    SELECT id, name FROM users WHERE email LIKE '%@example.com' ORDER BY name
  `);
  
  const clientMap = {};
  clients.forEach(c => { clientMap[c.name] = c.id; });

  console.log(`Created/found ${clients.length} sample client users\n`);

  let totalBookings = 0;
  let totalReviews = 0;

  for (const [artistId, items] of Object.entries(artistData)) {
    console.log(`Processing artist ID ${artistId}...`);
    
    for (const item of items) {
      const clientId = clientMap[item.clientName];
      if (!clientId) {
        console.log(`  ⚠️  Client not found: ${item.clientName}`);
        continue;
      }

      // Create a completed booking date in the past (1-6 months ago)
      const monthsAgo = Math.floor(Math.random() * 6) + 1;
      const bookingDate = new Date();
      bookingDate.setMonth(bookingDate.getMonth() - monthsAgo);

      try {
        // Create a completed booking
        const [bookingResult] = await connection.execute(
          `INSERT INTO bookings (clientId, artistId, serviceDescription, requestedDate, status, budget, notes, createdAt) 
           VALUES (?, ?, ?, ?, 'completed', ?, ?, ?)`,
          [clientId, artistId, item.service, bookingDate, 50000, `Completed ${item.service} session`, bookingDate]
        );
        
        const bookingId = bookingResult.insertId;
        totalBookings++;
        console.log(`  ✅ Created booking #${bookingId} for ${item.clientName}`);

        // Create the review linked to the booking
        const reviewDate = new Date(bookingDate);
        reviewDate.setDate(reviewDate.getDate() + 7); // Review 1 week after booking

        await connection.execute(
          `INSERT INTO reviews (bookingId, clientId, artistId, rating, comment, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [bookingId, clientId, artistId, item.rating, item.comment, reviewDate]
        );
        totalReviews++;
        console.log(`  ✅ Added review from ${item.clientName} (${item.rating}★)`);

      } catch (e) {
        console.log(`  ❌ Failed: ${e.message}`);
      }
    }
  }

  // Verify the results
  const [reviewCounts] = await connection.execute(`
    SELECT ap.displayName, COUNT(r.id) as reviewCount, ROUND(AVG(r.rating), 1) as avgRating
    FROM artistProfiles ap
    LEFT JOIN reviews r ON ap.userId = r.artistId
    WHERE ap.userId IN (150007, 150008, 150009, 150010, 150011, 150012)
    GROUP BY ap.userId, ap.displayName
  `);
  
  console.log('\n=== Review Summary ===');
  reviewCounts.forEach(r => {
    console.log(`${r.displayName}: ${r.reviewCount} reviews (avg: ${r.avgRating || 'N/A'}★)`);
  });

  const [bookingCounts] = await connection.execute(`
    SELECT ap.displayName, COUNT(b.id) as bookingCount
    FROM artistProfiles ap
    LEFT JOIN bookings b ON ap.userId = b.artistId AND b.status = 'completed'
    WHERE ap.userId IN (150007, 150008, 150009, 150010, 150011, 150012)
    GROUP BY ap.userId, ap.displayName
  `);
  
  console.log('\n=== Booking Summary ===');
  bookingCounts.forEach(b => {
    console.log(`${b.displayName}: ${b.bookingCount} completed bookings`);
  });

  await connection.end();
  console.log(`\n=== Added ${totalBookings} bookings and ${totalReviews} reviews total ===`);
}

main().catch(console.error);
