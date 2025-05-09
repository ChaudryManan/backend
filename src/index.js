// src/index.js
import "dotenv/config";            // load .env first
import "./db/index.js";            // side-effect: connect to MongoDB
import app from "./app.js";        // your Express app

// init() just returns the app instance
export async function init() {
  return app;
}

// Local dev server (only when not on Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
