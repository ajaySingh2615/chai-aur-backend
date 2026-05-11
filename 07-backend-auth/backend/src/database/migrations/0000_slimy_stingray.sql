CREATE TYPE "public"."role" AS ENUM('candidate', 'employer', 'admin');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"password" text,
	"role" "role" DEFAULT 'candidate' NOT NULL,
	"is_email_verified" boolean DEFAULT false,
	"refresh_token" text,
	"email_verification_token" text,
	"email_verification_token_expires_at" timestamp,
	"password_reset_token" text,
	"password_reset_token_expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
