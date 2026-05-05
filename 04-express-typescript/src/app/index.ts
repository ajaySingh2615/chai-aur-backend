import express from "express";
import type { Application } from "express";

export function createServerApplication(): Application {
  const app = express();

  app.get("/", function (req, res) {
    return res.json({ message: "Hello ji, kaise ho" });
  });

  app.get("/hello", function (req, res) {
    return res.json({ message: "Bye" });
  });

  return app;
}
