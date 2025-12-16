import mysql from 'mysql2/promise';

// Sample reviews for each artist
const artistReviews = {
  // Elena Martinez (ID 150007) - Portrait & Fine Art Painter
  150007: [
    { rating: 5, comment: "Elena captured my family's essence beautifully. Her attention to detail and ability to bring out genuine emotions in her portraits is remarkable. Highly recommend!", clientName: "Sarah Mitchell" },
    { rating: 5, comment: "Absolutely stunning work! Elena's portrait of my grandmother brought tears to our eyes. She truly has a gift for capturing personality and soul.", clientName: "David Chen" },
    { rating: 4, comment: "Great experience working with Elena. She was patient, professional, and the final portrait exceeded our expectations. Would definitely commission again.", clientName: "Jennifer Williams" },
  ],
  // Marcus Chen (ID 150008) - Digital Artist & Illustrator
  150008: [
    { rating: 5, comment: "Marcus created the most incredible fantasy illustration for my book cover. His imagination and technical skills are unmatched. The colors and details are breathtaking!", clientName: "Michael Torres" },
    { rating: 5, comment: "Working with Marcus was a dream. He took my vague concept and turned it into a masterpiece. His digital art skills are truly next level.", clientName: "Emma Rodriguez" },
    { rating: 4, comment: "Very talented digital artist. Marcus delivered exactly what I envisioned for my game character designs. Quick turnaround and excellent communication.", clientName: "Alex Kim" },
  ],
  // Sophia Anderson (ID 150009) - Landscape & Nature Photographer
  150009: [
    { rating: 5, comment: "Sophia's landscape photography is absolutely breathtaking. She captured our wedding venue in ways we never imagined. Every photo tells a story.", clientName: "Rachel Green" },
    { rating: 5, comment: "I commissioned Sophia for nature prints for my office. The quality and composition of her work transformed our space. Truly talented photographer!", clientName: "Thomas Brown" },
    { rating: 5, comment: "Sophia has an incredible eye for light and composition. Her mountain photography collection is now the centerpiece of our living room.", clientName: "Lisa Anderson" },
  ],
  // James Rodriguez (ID 150010) - Watercolor & Traditional Artist
  150010: [
    { rating: 5, comment: "James's watercolor work is exquisite. He painted a custom piece of our garden that captures every delicate detail. A true master of the medium.", clientName: "Patricia Moore" },
    { rating: 4, comment: "Beautiful floral watercolors! James created a series for our boutique that customers constantly compliment. His traditional technique is refreshing.", clientName: "Karen White" },
    { rating: 5, comment: "Commissioned James for a botanical illustration series. His patience and skill with watercolors produced museum-quality pieces. Absolutely worth every penny.", clientName: "Robert Taylor" },
  ],
  // Aria Thompson (ID 150011) - Contemporary & Mixed Media
  150011: [
    { rating: 5, comment: "Aria's contemporary pieces are thought-provoking and visually stunning. She created a custom installation for our gallery that became the talk of the town.", clientName: "Christopher Lee" },
    { rating: 4, comment: "Very creative and innovative artist. Aria's mixed media approach brought a unique perspective to our corporate art collection.", clientName: "Amanda Davis" },
    { rating: 5, comment: "Aria is a visionary. Her contemporary art piece for our home is a conversation starter at every gathering. Truly one-of-a-kind work.", clientName: "Daniel Martinez" },
  ],
  // Oliver Kim (ID 150012) - Photography & Visual Arts
  150012: [
    { rating: 5, comment: "Oliver's fine art photography is exceptional. He captured our product line in ways that elevated our entire brand aesthetic. Highly professional.", clientName: "Jessica Wilson" },
    { rating: 5, comment: "Working with Oliver was seamless. His artistic vision combined with technical expertise produced stunning results for our magazine feature.", clientName: "Mark Thompson" },
    { rating: 4, comment: "Great photographer with a keen artistic eye. Oliver's work for our exhibition was well-received by critics and visitors alike.", clientName: "Nicole Garcia" },
  ],
};

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  console.log('=== Seeding Sample Reviews ===\n');

  // First, check if we have client users to use as reviewers
  // We'll create some sample client users for the reviews
  const clientIds = [];
  
  // Create sample client users for reviews
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

  // Insert reviews for each artist
  let totalReviews = 0;
  for (const [artistId, reviews] of Object.entries(artistReviews)) {
    console.log(`Adding reviews for artist ID ${artistId}...`);
    
    for (const review of reviews) {
      const clientId = clientMap[review.clientName];
      if (!clientId) {
        console.log(`  ⚠️  Client not found: ${review.clientName}`);
        continue;
      }

      // Create a date in the past (1-6 months ago)
      const monthsAgo = Math.floor(Math.random() * 6) + 1;
      const reviewDate = new Date();
      reviewDate.setMonth(reviewDate.getMonth() - monthsAgo);

      try {
        await connection.execute(
          `INSERT INTO reviews (artistId, clientId, rating, comment, createdAt) 
           VALUES (?, ?, ?, ?, ?)`,
          [artistId, clientId, review.rating, review.comment, reviewDate]
        );
        totalReviews++;
        console.log(`  ✅ Added review from ${review.clientName} (${review.rating}★)`);
      } catch (e) {
        console.log(`  ❌ Failed to add review: ${e.message}`);
      }
    }
  }

  // Verify the reviews
  const [reviewCounts] = await connection.execute(`
    SELECT ap.displayName, COUNT(r.id) as reviewCount, AVG(r.rating) as avgRating
    FROM artistProfiles ap
    LEFT JOIN reviews r ON ap.userId = r.artistId
    WHERE ap.userId IN (150007, 150008, 150009, 150010, 150011, 150012)
    GROUP BY ap.userId, ap.displayName
  `);
  
  console.log('\n=== Review Summary ===');
  reviewCounts.forEach(r => {
    console.log(`${r.displayName}: ${r.reviewCount} reviews (avg: ${r.avgRating ? r.avgRating.toFixed(1) : 'N/A'}★)`);
  });

  await connection.end();
  console.log(`\n=== Added ${totalReviews} reviews total ===`);
}

main().catch(console.error);
