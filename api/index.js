// api/index.js
import serverless from "serverless-http";
import { init } from "../src/index.js";

let handler;

export default async function (req, res) {
  if (!handler) {
    const app = await init();     // connects DB, builds Express app
    handler = serverless(app);
  }
  return handler(req, res);
}

