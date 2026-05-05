import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/common/config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // TODO: connect to database here
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode.`,
      );
    });

    // Graceful shutdown handling
    const shutdown = () => {
      console.log("Shutting down gracefully...");
      server.close(() => {
        console.log("Closed out remaining connections.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
