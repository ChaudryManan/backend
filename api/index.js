// api/index.js
import serverless from "serverless-http";
import { init } from "../src/index.js"; // Import named export

let handler;

// Initialize once (not on every request)
const initializeHandler = async () => {
  const app = await init(); // Connects DB and returns app
  return serverless(app);
};

export default async (req, res) => {
  if (!handler) {
    handler = await initializeHandler(); // Initialize once
  }
  return handler(req, res); // Reuse handler for subsequent requests
};