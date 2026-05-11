import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { registerSchema } from "./auth.dto.js";

const router = Router();

// POST /register
router.post("/register", validate(registerSchema), authController.register);

export const authRoutes = router;
