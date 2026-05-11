import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";

class AuthController {
  // Handles POST /api/v1/auth/register
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. data is already validated by the validate middleware, so we can safely pass it to the service
      const userData = req.body;

      // 2. pass the perfect data to the service layer
      const newUser = await authService.register(userData);

      // 3. send the success response back to the client
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: newUser,
      });
    } catch (error) {
      // If the Service throws an ApiError (like "Email already exists"),
      // we pass it to our global error handler middleware!
      next(error);
    }
  }
}

export const authController = new AuthController();
