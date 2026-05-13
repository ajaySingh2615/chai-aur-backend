import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../common/config/env.js";
import { sql } from "drizzle-orm";
import * as userSchema from "./schema/users.js";

// 1. Create the Postgres query client
// We disable 'prepare' for local development/pgbouncer compatibility
const queryClient = postgres(env.DATABASE_URL, { prepare: false });

// 2. Wrap the client with Drizzle
export const db = drizzle(queryClient, { schema: userSchema });

export const testConnection = async () => {
  try {
    await db.execute(sql`SELECT 1`);
    console.log("Database connection verified");
  } catch (error) {
    console.log("Database connection failed");
    throw error;
  }
};
