// /api/index.js
import serverless from "serverless-http";
import { init } from "../index.js";   // the file you just updated

let handlerPromise = null;

export default async function handler(req, res) {
  // on cold start, connect DB & get your express `app`
  if (!handlerPromise) {
    const app = await init();
    handlerPromise = serverless(app);
  }
  // delegate every incoming req to express
  return handlerPromise(req, res);
}
