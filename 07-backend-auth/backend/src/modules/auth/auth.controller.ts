import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import { ApiResponse } from "../../common/utils/api-response.js";
import { refreshTokenCookieOptions } from "../../common/config/cookie.config.js";
import { ApiError } from "../../common/exceptions/api-error.js";

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

      // attach the refresh token to the cookie
      res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

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

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Extract the refresh token from the cookie
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw ApiError.unauthorized("No refresh token provided");
      }

      // 2. Call the service to refresh tokens
      const { accessToken, refreshToken: newRefreshToken } =
        await authService.refreshToken(refreshToken);

      // 3. Set the new refresh token in the cookie
      res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

      // 4. Send the new access token in the response
      const response = ApiResponse.ok(
        { accessToken },
        "Access token refreshed successfully",
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Get the userId from the authenticated request (set by authenticate middleware)
      const userId = req.user?.userId;
      if (!userId) {
        throw ApiError.unauthorized("User not authenticated");
      }

      // 2. Call the service to clear the refresh token from the database
      await authService.logout(userId);

      // 3. Clear the refresh token cookie
      res.clearCookie("refreshToken", refreshTokenCookieOptions);

      // 4. Send the success response
      const response = ApiResponse.ok(null, "User logged out successfully");
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
