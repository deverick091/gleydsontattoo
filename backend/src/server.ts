import { app } from "./app.js";
import { env } from "./config/env.js";

const PORT = env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Gleydsontattoo API running on port ${PORT}`);
  console.log(`📋 Environment: ${env.NODE_ENV}`);
});

process.on("SIGINT", () => {
  console.log("Gracefully shutting down...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
