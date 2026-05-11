import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
  time,
} from "drizzle-orm/pg-core";
import { email } from "zod";

// Define an enum for user roles
export const roleEnum = pgEnum("role", ["candidate", "employer", "admin"]);

export const usersTable = pgTable("users", {
  // Primary Identication
  id: uuid("id").primaryKey().defaultRandom(),

  // Profile Data
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password"),

  // 3. Security & Roles
  role: roleEnum("role").default("candidate").notNull(),
  isEmailVerified: boolean("is_email_verified").default(false),

  refreshToken: text("refresh_token"),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationTokenExpiresAt: timestamp(
    "email_verification_token_expires_at",
  ),
  passwordResetToken: text("password_reset_token"),
  passwordResetTokenExpiresAt: timestamp("password_reset_token_expires_at"),

  // 4. Audit / Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
