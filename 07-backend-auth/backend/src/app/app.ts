import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";

export const buildApp = (): Application => {
  const app = express();

  // Global middlewares
  app.use(helmet()); // Adds security headers
  app.use(cors()); // Enable CORS
  app.use(express.json()); // Parse JSON bodies

  // Health check route
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "server is healthy",
      timestamp: new Date().toISOString(),
    });
  });

  return app;
};
