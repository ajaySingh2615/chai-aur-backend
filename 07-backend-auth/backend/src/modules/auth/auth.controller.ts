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
      const response = new ApiResponse(
        201,
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
}

export const authController = new AuthController();
