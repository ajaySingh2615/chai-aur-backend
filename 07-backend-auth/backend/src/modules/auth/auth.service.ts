import bcrypt from "bcryptjs";
import { ApiError } from "../../common/exceptions/api-error.js";
import { RegisterDTO } from "./auth.dto.js";
import { authRepository } from "./auth.repository.js";

class AuthService {
  // Registers a new user into the system
  async register(userData: RegisterDTO) {
    const { name, email, password, role } = userData;

    // 1. Check if the email is already in use
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw ApiError.badRequest("A user with this email already exists");
    }

    // 2. Hash the password before saving (using bcryptjs)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the user in the database
    const newUser = await authRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
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
}

// export a single instance of the service so we don't have to create a new one every time we want to use it
export const authService = new AuthService();
