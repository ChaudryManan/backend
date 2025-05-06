// api/index.js
import { init } from "../src/index.js";

import serverless from "serverless-http";

let cachedHandler;

export default async function handler(req, res) {
  if (!cachedHandler) {
    const app = await init(); // connect DB + get Express app
    cachedHandler = serverless(app);
  }
  return cachedHandler(req, res);
}
