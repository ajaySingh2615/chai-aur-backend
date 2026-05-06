import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: 2,
      maxLength: 50,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true, // Automatically creates a MongoDB index for fast lookups
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 8,
      select: false, // Security: prevents password from being returned in standard queries
    },
    role: {
      type: String,
      enum: ["candidate", "employer", "admin"],
      default: "candidate",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: { type: String, select: false },
    refreshToken: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
