import { env } from "./env.js";

export const refreshTokenCookieOptions = {
  httpOnly: true, // Stops XSS attacks by preventing client-side JS from accessing the cookie
  secure: env.NODE_ENV === "production", // Only send cookie over HTTPS in production
  sameSite: "strict" as const, // Prevents CSRF attacks by not sending cookie on cross-site requests
  maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days (same as refresh token)
};
