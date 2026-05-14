import bcrypt from "bcryptjs";
import { ApiError } from "../../common/exceptions/api-error.js";
import { LoginDTO, RegisterDTO } from "./auth.dto.js";
import { authRepository } from "./auth.repository.js";
import { comparePassword, hashPassword } from "../../common/utils/hashing.js";
import {
  generateTokens,
  JwtPayload,
  verifyToken,
} from "../../common/utils/jwt.js";
import { env } from "../../common/config/env.js";
import { th } from "zod/v4/locales/index.js";

class AuthService {
  // Registers a new user into the system
  async register(userData: RegisterDTO) {
    const { name, email, password } = userData;

    // 1. Check if the email is already in use
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw ApiError.badRequest("A user with this email already exists");
    }

    // 2. Hash the password before saving (using bcryptjs)

    const hashedPassword = await hashPassword(password);

    // 3. Create the user in the database
    const newUser = await authRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Sanitize the user object before returning (remove password and tokens)
    const {
      password: _,
      refreshToken,
      emailVerificationToken,
      passwordResetToken,
      ...safeUser
    } = newUser;

    return safeUser;
  }

  // Authenticates a user and issues JWT tokens
  async login(loginData: LoginDTO) {
    const { email, password } = loginData;

    // find user and check if they exist
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    // verify the password
    // (Edge Case Check: If user.password is null, it means they registered via Google/OAuth!)
    if (!user.password) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    // generate the VIP badges (tokens)
    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      role: user.role,
    });

    // save the refresh token in the database so we can verify it later
    await authRepository.update(user.id, { refreshToken });

    // sanitize the user object before returning (remove password and tokens)
    const {
      password: _,
      refreshToken: __,
      emailVerificationToken,
      passwordResetToken,
      ...safeUser
    } = user;

    // return everything the controller will need
    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    // verify and decode JWT -> extract userId and role -> if invalid, throw error
    let decoded: JwtPayload;
    try {
      decoded = verifyToken(token, env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw ApiError.unauthorized("Invalid or expired refresh token");
    }

    // find the user in DB by userId -> if not found, throw error
    const user = await authRepository.findById(decoded.userId);
    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    // compare the provided refresh token with the one in DB -> if mismatch, throw error
    if (user.refreshToken !== token) {
      throw ApiError.unauthorized("Refresh token does not match");
    }

    // generate new tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      role: user.role,
    });

    // save the new refresh token in the database
    await authRepository.update(user.id, { refreshToken });

    // return both tokens
    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    // 1. Clear the refresh token from the database to invalidate it
    await authRepository.update(userId, { refreshToken: null as any });
  }
}

// export a single instance of the service so we don't have to create a new one every time we want to use it
export const authService = new AuthService();
