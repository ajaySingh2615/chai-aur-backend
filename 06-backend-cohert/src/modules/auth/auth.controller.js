import ApiResponse from "../../common/utils/api-response.js";
import * as authService from "./auth.service.js";

const register = async (req, res) => {
  const user = await authService.register(req.body);
  ApiResponse.created(res, user, "User registered successfully");
};

const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  ApiResponse.ok(res, "Login successful", {
    user,
    accessToken,
  });
};

const logout = async (req, res) => {
  await authService.logout(req.user.id);
  res.clearCookie("refreshToken");
  ApiResponse.ok(res, "Logout successful");
};

const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);
  ApiResponse.ok(res, "User found", { user });
};

export { register, login, logout, getMe };
