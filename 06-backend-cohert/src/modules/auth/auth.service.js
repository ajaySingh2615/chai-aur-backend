import crypto from "crypto";
import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";
import User from "../../modules/auth/auth.model.js";

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const register = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict("User with this email already exists");
  }

  const { rawToken, hashedToken } = generateResetToken();

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken: hashedToken,
  });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationToken;

  return userObj;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  if (!user.isVerified) {
    throw ApiError.forbidden("Please verify your email before logging in");
  }

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.unauthorized("Refresh token is required");
  }
  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user) throw ApiError.unauthorized("User not found");

  if (user.refreshToken !== hashToken(refreshToken)) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  return { accessToken, refreshToken };
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    refreshToken: undefined,
  });
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const { rawToken, hashedToken } = generateResetToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  await user.save();

  // TODO: Send password reset email with rawToken
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  return user;
};

export { register, login, refresh, logout, forgotPassword, getMe };
