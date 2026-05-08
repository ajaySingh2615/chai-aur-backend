import { Router } from "express";
import * as authController from "./auth.controller.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import { authenticate } from "../../common/middleware/validate.middleware.js";
import LoginDto from "./dto/login.dto.js";

const router = Router();

router.post("/register", validate(RegisterDto), authController.register);
router.post("/login", validate(LoginDto), authController.login);
router.get("/me", authenticate, authController.getMe);
router.post("/logout", authenticate, authController.logout);

export default router;
