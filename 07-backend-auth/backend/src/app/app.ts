import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { globalErrorHandler, notFoundHandler } from "../common/middlewares/error.middleware.js";

export const buildApp = (): Application => {
  const app = express();

  // Global middlewares
  app.use(helmet()); // Adds security headers
  app.use(cors()); // Enable CORS
  app.use(express.json()); // Parse JSON bodies

  // -- Routes --
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "server is healthy",
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/test-error", () => {
    throw new Error("This is a random system crash!")
  });

  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  return app;
};
