import { app } from "./app";
import { env } from "./config/env";

const PORT = env.PORT;

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
