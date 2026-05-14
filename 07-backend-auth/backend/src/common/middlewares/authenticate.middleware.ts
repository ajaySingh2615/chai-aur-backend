import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/api-error.js";
import { verifyToken } from "../utils/jwt.js";
import { env } from "../config/env.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Extract the access token from the Authorization header
  const authHeader = req.headers.authorization;

  // 2. If no token is provided, return 401 Unauthorized
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("No token provided"));
  }

  // 3. Verify the token and decode the payload (using JWT utils)
  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token, env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
};
