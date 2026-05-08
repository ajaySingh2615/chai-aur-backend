import express from "express";
import type { Express } from "express";

export function createExpressApplication(): Express {
  const app = express();

  // Middleware

  // Routes

  app.get("/", (req, res) => {
    return res.json({ message: "Welcome to chaicode auth service" });
  });

  return app;
}
