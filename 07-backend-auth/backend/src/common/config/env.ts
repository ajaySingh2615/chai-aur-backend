import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.string().default("5000").transform(Number),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DATABASE_URL: z.string().url()
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
