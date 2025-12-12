import { drizzle } from "drizzle-orm/mysql2";
import { categories } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const seedCategories = [
  {
    name: "Painting & Drawing",
    slug: "painting-drawing",
    description: "Custom paintings, portraits, murals, and drawings"
  },
  {
    name: "Photography",
    slug: "photography",
    description: "Professional photography services for events, portraits, and more"
  },
  {
    name: "Music & Performance",
    slug: "music-performance",
    description: "Live music, DJ services, and performance art"
  },
  {
    name: "Crafts & Handmade",
    slug: "crafts-handmade",
    description: "Handcrafted items, pottery, jewelry, and custom creations"
  },
  {
    name: "Digital Art & Design",
    slug: "digital-art-design",
    description: "Graphic design, illustration, and digital artwork"
  },
  {
    name: "Sculpture & 3D Art",
    slug: "sculpture-3d",
    description: "Sculptures, installations, and three-dimensional artwork"
  },
  {
    name: "Writing & Poetry",
    slug: "writing-poetry",
    description: "Creative writing, poetry, and literary services"
  },
  {
    name: "Videography & Film",
    slug: "videography-film",
    description: "Video production, editing, and cinematography"
  }
];

async function seed() {
  console.log("Seeding categories...");
  
  for (const category of seedCategories) {
    try {
      await db.insert(categories).values(category).onDuplicateKeyUpdate({ set: { name: category.name } });
      console.log(`✓ Added: ${category.name}`);
    } catch (error) {
      console.log(`✗ Skipped: ${category.name} (already exists)`);
    }
  }
  
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(console.error);
