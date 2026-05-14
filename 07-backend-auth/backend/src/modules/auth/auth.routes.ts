import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.dto.js";
import { authenticate } from "../../common/middlewares/authenticate.middleware.js";

const router = Router();

// POST /register
router.post("/register", validate(registerSchema), authController.register);

// POST /login
router.post("/login", validate(loginSchema), authController.login);

// POST /refresh-token
router.post("/refresh-token", authController.refreshToken);

// POST /logout
// (This route will be protected by the authenticate middleware, so only logged-in users can access it)
router.post("/logout", authenticate, authController.logout);

export const authRoutes = router;
