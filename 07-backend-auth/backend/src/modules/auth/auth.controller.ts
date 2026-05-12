import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import { ApiResponse } from "../../common/utils/api-response.js";

class AuthController {
  // Handles POST /api/v1/auth/register
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. data is already validated by the validate middleware, so we can safely pass it to the service
      const userData = req.body;

      // 2. pass the perfect data to the service layer
      const newUser = await authService.register(userData);

      // 3. send the success response back to the client
      const response = ApiResponse.created(
        newUser,
        "User registered successfully",
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      // If the Service throws an ApiError (like "Email already exists"),
      // we pass it to our global error handler middleware!
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // the data is already validated by zod loginSchema
      const loginData = req.body;

      // call the service to verify credentials and generate tokens
      const { user, accessToken, refreshToken } =
        await authService.login(loginData);

      // configure our highly secure cookie options
      const cookieOptions = {
        httpOnly: true, // Stops XSS attacks by preventing client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
        sameSite: "strict" as const, // Prevents CSRF attacks by not sending cookie on cross-site requests
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days (same as refresh token)
      };

      // attach the refresh token to the cookie
      res.cookie("refreshToken", refreshToken, cookieOptions);

      // send the success response (Only sending the Access Token and User info
      const response = ApiResponse.ok(
        { user, accessToken },
        "User logged in successfully",
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
