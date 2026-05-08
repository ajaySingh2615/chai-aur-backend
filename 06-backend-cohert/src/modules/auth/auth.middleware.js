import ApiError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";

const authenticate = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError(401, "Unauthorized: No token provided"));
  }

  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new ApiError(401, "Unauthorized: User not found"));
  }

  req.user = {  
    id: user._id,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError.forbidden(
        "Forbidden: You don't have permission to access this resource",
      );
    }
    next();
  };
};

export { authenticate, authorize };
