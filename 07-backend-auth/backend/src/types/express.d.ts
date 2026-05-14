import { JwtPayLoad } from "../common/utils/jwt.ts";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayLoad;
    }
  }
}
