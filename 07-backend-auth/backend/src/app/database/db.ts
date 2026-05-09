import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { env } from "../../common/config/env.js"
import { sql } from "drizzle-orm";

// 1. Create the Postgres query client
// We disable 'prepare' for local development/pgbouncer compatibility
const queryClient = postgres(env.DATABASE_URL, { prepare: false });

// 2. Wrap the client with Drizzle
// (We will pass our schemas here later so Drizzle knows about our tables)
export const db = drizzle(queryClient);

export const testConnection = async () => {
    try {
        await db.execute(sql`SELECT 1`)
        console.log('Database connection verified');
    } catch (error) {
        console.log('Database connection failed');
        throw error;
    }
}