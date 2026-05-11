import { z } from "zod";

// Registration Schema
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["candidate", "employer"]).default("candidate"),
});

// Infer the TS type for the service to use
export type RegisterDTO = z.infer<typeof registerSchema>;

// Login Schema
export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Infer the TS type
export type LoginDTO = z.infer<typeof loginSchema>;
