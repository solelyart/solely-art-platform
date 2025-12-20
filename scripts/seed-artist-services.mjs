import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== Adding Services for Remaining Artists ===');

// Artist services data based on their specialties
const artistServices = [
  // Elena Martinez (ID: 1) - Contemporary painter, abstract expressionism
  {
    artistId: 1,
    services: [
      { name: 'Custom Abstract Painting', description: 'Commission a unique abstract expressionist piece tailored to your space and vision. Includes consultation and up to 2 revisions.', price: 85000, durationMinutes: 240 },
      { name: 'Portrait in Mixed Media', description: 'A contemporary portrait combining acrylic, oil, and mixed media techniques. Perfect for capturing personality with artistic flair.', price: 65000, durationMinutes: 180 },
      { name: 'Mural Consultation', description: 'On-site consultation for large-scale mural projects. Includes concept sketches and material recommendations.', price: 25000, durationMinutes: 120 },
      { name: 'Art Workshop (Group)', description: 'Interactive 3-hour workshop for groups of up to 8 people. Learn abstract painting techniques and create your own piece.', price: 45000, durationMinutes: 180 },
    ]
  },
  // Marcus Chen (ID: 2) - Award-winning photographer, portrait/fashion/editorial
  {
    artistId: 2,
    services: [
      { name: 'Professional Headshots', description: 'Studio session for corporate headshots or actor portfolios. Includes 3 retouched images and outfit changes.', price: 35000, durationMinutes: 90 },
      { name: 'Fashion Editorial Shoot', description: 'Full-day fashion photography session with creative direction, styling consultation, and 15 edited images.', price: 150000, durationMinutes: 480 },
      { name: 'Event Photography', description: 'Professional coverage of your event with candid and posed shots. Includes all edited images delivered within 5 days.', price: 75000, durationMinutes: 240 },
      { name: 'Portrait Session', description: 'Intimate portrait session capturing your authentic self. Includes 5 retouched images and print-ready files.', price: 45000, durationMinutes: 120 },
    ]
  },
  // Sophia Anderson (ID: 3) - Digital illustrator and graphic designer
  {
    artistId: 3,
    services: [
      { name: 'Brand Identity Package', description: 'Complete brand identity including logo, color palette, typography, and brand guidelines document.', price: 120000, durationMinutes: 480 },
      { name: 'Custom Illustration', description: 'Unique digital illustration for editorial, book covers, or personal projects. Includes 3 concept sketches.', price: 55000, durationMinutes: 180 },
      { name: 'Social Media Graphics Pack', description: '10 custom-designed social media graphics optimized for your platforms. Includes templates for future use.', price: 40000, durationMinutes: 120 },
      { name: 'Character Design', description: 'Original character design with turnaround sheet and expression studies. Perfect for games, animation, or branding.', price: 75000, durationMinutes: 240 },
    ]
  },
  // James Rodriguez (ID: 4) - Sculptor and 3D artist
  {
    artistId: 4,
    services: [
      { name: 'Custom Bronze Sculpture', description: 'Commission a one-of-a-kind bronze sculpture. Price varies by size; this covers consultation and small-scale pieces.', price: 200000, durationMinutes: 480 },
      { name: '3D Model for Printing', description: 'Digital 3D model ready for printing. Includes high-resolution files and printing recommendations.', price: 45000, durationMinutes: 180 },
      { name: 'Installation Art Consultation', description: 'Consultation for large-scale installation projects. Includes site visit, concept development, and proposal.', price: 35000, durationMinutes: 180 },
      { name: 'Sculpture Workshop', description: 'Hands-on clay sculpting workshop for beginners. All materials included. Groups of up to 6 people.', price: 50000, durationMinutes: 180 },
    ]
  },
  // Aria Thompson (ID: 5) - Multi-disciplinary artist, music production, visual art
  {
    artistId: 5,
    services: [
      { name: 'Music Production Session', description: 'Full-day studio session including recording, mixing, and mastering for one track.', price: 80000, durationMinutes: 480 },
      { name: 'Album Artwork Design', description: 'Complete album artwork package including cover, back, and booklet designs. Includes 3 concept options.', price: 65000, durationMinutes: 240 },
      { name: 'Live Performance', description: 'Live musical performance for private events, galleries, or corporate functions. 2-hour set.', price: 100000, durationMinutes: 120 },
      { name: 'Creative Direction', description: 'Creative direction services for music videos, photo shoots, or brand campaigns. Includes mood boards and shot lists.', price: 55000, durationMinutes: 180 },
    ]
  },
  // Oliver Kim (ID: 6) - Calligrapher and lettering artist
  {
    artistId: 6,
    services: [
      { name: 'Wedding Invitation Suite', description: 'Custom hand-lettered wedding invitation suite including save-the-dates, invitations, and RSVP cards.', price: 85000, durationMinutes: 240 },
      { name: 'Logo Lettering', description: 'Hand-crafted lettering for logos and wordmarks. Includes 3 concept directions and vector files.', price: 60000, durationMinutes: 180 },
      { name: 'Live Event Calligraphy', description: 'On-site calligraphy services for events. Personalize place cards, gifts, or keepsakes for your guests.', price: 45000, durationMinutes: 180 },
      { name: 'Custom Quote Art', description: 'Beautiful hand-lettered quote or phrase on premium paper. Framed and ready to display.', price: 25000, durationMinutes: 90 },
    ]
  },
];

let totalServicesAdded = 0;

for (const artist of artistServices) {
  console.log(`\nAdding services for artist ID ${artist.artistId}...`);
  
  for (const service of artist.services) {
    try {
      await connection.execute(
        `INSERT INTO services (artistId, name, description, price, durationMinutes, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())`,
        [artist.artistId, service.name, service.description, service.price, service.durationMinutes]
      );
      console.log(`  ✓ Added: ${service.name} ($${(service.price / 100).toFixed(2)})`);
      totalServicesAdded++;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`  - Skipped (already exists): ${service.name}`);
      } else {
        console.error(`  ✗ Error adding ${service.name}:`, error.message);
      }
    }
  }
}

console.log(`\n=== Complete: Added ${totalServicesAdded} services ===`);

await connection.end();
