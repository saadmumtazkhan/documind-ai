
import { app } from "./app";
import { env } from "./config/env";
import { pool } from "./config/database";

const server = app.listen(env.PORT, () => {
  console.log(`API listening on port ${env.PORT}`);
});

function shutdown() {
  server.close(async () => {
    await pool.end();
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

