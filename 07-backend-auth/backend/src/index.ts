import { buildApp } from "./app/app.js";
import { env } from "./common/config/env.js";
import { db, testConnection } from "./app/database/db.js";

const main = async () => {
  try {
    // TODO: 1: database connection
    await testConnection();
    // 2. build app
    const app = buildApp();

    // 3. start server
    app.listen(env.PORT, () => {
      console.log(`Server is active on port: ${env.PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);


  }
};

main();
