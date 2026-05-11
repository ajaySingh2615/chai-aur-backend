import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: "./src/database/schema/*.ts", // Where your schemas live
  out: "src/database/migrations", // Where to save the generated SQL files
  dialect: "postgresql", // The type of database we are using
  dbCredentials: {
    url: process.env.DATABASE_URL!, // The connection string from .env
  },
  verbose: true, // Optional: Log the generated SQL to the console
  strict: true, // Optional: Enable strict mode for better type safety
});
