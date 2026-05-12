import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

// the payload is the data we embed inside the token
export interface JwtPayload {
  userId: string;
  role: string;
}

export const generateTokens = (payload: JwtPayload) => {
  // 1. generate the short lived access token
  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
  });

  // 2. Generate the long lived refresh token
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });

  return { accessToken, refreshToken };
};
