// src/index.js
import "dotenv/config";            // load .env
import { dbConnectPromise } from "./db/index.js";  // the promise we just exported
import app from "./app.js";

// init() will now truly wait for Mongo to be connected
export async function init() {
  await dbConnectPromise;
  return app;
}

// Local dev server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
