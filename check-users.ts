import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { users } from './drizzle/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);
  
  const testOpenIds = ['test-client-001', 'test-artist-001', 'test-admin-001'];
  
  for (const openId of testOpenIds) {
    const user = await db.select().from(users).where(eq(users.openId, openId));
    console.log(`User ${openId}: ${user.length > 0 ? 'EXISTS' : 'NOT FOUND'}`);
  }
  
  const allUsers = await db.select({ openId: users.openId, name: users.name }).from(users).limit(5);
  console.log('\nFirst 5 users:', JSON.stringify(allUsers, null, 2));
  
  await connection.end();
}

main();
