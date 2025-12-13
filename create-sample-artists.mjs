import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

// Sample artist data
const sampleArtists = [
  {
    displayName: "Elena Martinez",
    bio: "Contemporary painter specializing in abstract expressionism and mixed media. My work explores the intersection of emotion and color, creating pieces that evoke deep feelings and contemplation.",
    location: "Brooklyn, NY",
    hourlyRate: 12000, // $120/hr in cents
    categories: ["Painting & Drawing", "Digital Art & Design"],
    services: [
      { name: "Custom Portrait Commission", description: "Hand-painted portrait in your choice of style", price: 50000, durationMinutes: 240 },
      { name: "Abstract Art Workshop", description: "Learn abstract painting techniques in a 2-hour session", price: 15000, durationMinutes: 120 },
      { name: "Art Consultation", description: "Professional advice on art collection and curation", price: 10000, durationMinutes: 60 },
    ]
  },
  {
    displayName: "Marcus Chen",
    bio: "Award-winning photographer with 15+ years of experience in portrait, fashion, and editorial photography. I capture authentic moments and create timeless images that tell your story.",
    location: "Los Angeles, CA",
    hourlyRate: 15000, // $150/hr
    categories: ["Photography", "Videography & Film"],
    services: [
      { name: "Portrait Photography Session", description: "Professional headshots or personal portraits", price: 35000, durationMinutes: 90 },
      { name: "Event Photography", description: "Full-day coverage of your special event", price: 200000, durationMinutes: 480 },
      { name: "Photography Mentorship", description: "One-on-one coaching for aspiring photographers", price: 12000, durationMinutes: 60 },
    ]
  },
  {
    displayName: "Sophia Anderson",
    bio: "Digital illustrator and graphic designer creating vibrant, eye-catching visuals for brands and publications. Specializing in editorial illustration, character design, and brand identity.",
    location: "Austin, TX",
    hourlyRate: 10000, // $100/hr
    categories: ["Digital Art & Design", "Crafts & Handmade"],
    services: [
      { name: "Custom Illustration", description: "Unique digital illustration for your project", price: 40000, durationMinutes: 180 },
      { name: "Brand Identity Design", description: "Complete visual identity including logo and guidelines", price: 150000, durationMinutes: 600 },
      { name: "Design Workshop", description: "Learn digital illustration fundamentals", price: 8000, durationMinutes: 90 },
    ]
  },
  {
    displayName: "James Rodriguez",
    bio: "Sculptor and 3D artist working with clay, metal, and digital mediums. I create both traditional sculptures and cutting-edge 3D printed art pieces that push the boundaries of form and material.",
    location: "Chicago, IL",
    hourlyRate: 13000, // $130/hr
    categories: ["Sculpture & 3D Art", "Crafts & Handmade"],
    services: [
      { name: "Custom Sculpture Commission", description: "Bespoke sculpture in your choice of material", price: 80000, durationMinutes: 480 },
      { name: "3D Modeling Service", description: "Digital 3D models for printing or visualization", price: 25000, durationMinutes: 120 },
      { name: "Sculpture Class", description: "Hands-on sculpting workshop for beginners", price: 10000, durationMinutes: 120 },
    ]
  },
  {
    displayName: "Aria Thompson",
    bio: "Multi-disciplinary artist and creative director with expertise in music production, visual arts, and performance. I blend different art forms to create immersive, unforgettable experiences.",
    location: "Nashville, TN",
    hourlyRate: 11000, // $110/hr
    categories: ["Music & Performance", "Videography & Film"],
    services: [
      { name: "Music Production Session", description: "Professional music production and mixing", price: 30000, durationMinutes: 180 },
      { name: "Creative Direction", description: "Art direction for your creative project", price: 45000, durationMinutes: 240 },
      { name: "Performance Workshop", description: "Stage presence and performance coaching", price: 9000, durationMinutes: 90 },
    ]
  },
  {
    displayName: "Oliver Kim",
    bio: "Calligrapher and lettering artist specializing in modern calligraphy, hand-lettering, and custom typography. I bring elegance and personality to every piece through the art of beautiful writing.",
    location: "Portland, OR",
    hourlyRate: 9000, // $90/hr
    categories: ["Writing & Poetry", "Digital Art & Design"],
    services: [
      { name: "Wedding Calligraphy", description: "Hand-lettered invitations and place cards", price: 25000, durationMinutes: 180 },
      { name: "Custom Typography Design", description: "Unique lettering for logos and branding", price: 35000, durationMinutes: 150 },
      { name: "Calligraphy Workshop", description: "Learn modern calligraphy techniques", price: 7500, durationMinutes: 120 },
    ]
  },
];

async function createSampleArtists() {
  console.log("🎨 Creating sample artists...\n");

  for (const artist of sampleArtists) {
    try {
      // Create user
      const userInsert = await db.insert(schema.users).values({
        openId: `sample-${artist.displayName.toLowerCase().replace(/\s+/g, '-')}`,
        name: artist.displayName,
        email: `${artist.displayName.toLowerCase().replace(/\s+/g, '.')}@solelyart.example`,
        userType: "artist",
        role: "user",
      });

      const userId = Number(userInsert[0].insertId);

      // Create artist profile
      const profileInsert = await db.insert(schema.artistProfiles).values({
        userId: userId,
        displayName: artist.displayName,
        bio: artist.bio,
        location: artist.location,
        categories: JSON.stringify(artist.categories),
        hourlyRate: artist.hourlyRate,
        portfolioImages: "[]",
      });

      const artistId = Number(profileInsert[0].insertId);

      // Create services
      for (const service of artist.services) {
        await db.insert(schema.services).values({
          artistId: artistId,
          name: service.name,
          description: service.description,
          price: service.price,
          durationMinutes: service.durationMinutes,
        });
      }

      console.log(`✅ Created artist: ${artist.displayName} (User ID: ${userId}, Artist ID: ${artistId})`);
      console.log(`   - ${artist.services.length} services added`);
      console.log(`   - Location: ${artist.location}`);
      console.log(`   - Rate: $${artist.hourlyRate / 100}/hr\n`);

    } catch (error) {
      console.error(`❌ Error creating ${artist.displayName}:`, error.message);
    }
  }

  console.log("\n🎉 Sample artists created successfully!");
  console.log("\n📝 To view artists:");
  console.log("1. Visit /browse to see all artists");
  console.log("2. Click on an artist to view their profile");
  console.log("3. See their services and portfolio");
  console.log("\n💡 Note: Portfolio images need to be uploaded manually through the Dashboard");
  
  process.exit(0);
}

createSampleArtists().catch(console.error);
