// api/index.js
import serverless from "serverless-http";
import { init } from "../src/index.js";

let handlerPromise;

export default async function handler(req, res) {
  if (!handlerPromise) {
    // on cold start, call init() and wrap the Express app
    handlerPromise = init().then(appInstance => serverless(appInstance));
  }
  const fn = await handlerPromise;
  return fn(req, res);
}
