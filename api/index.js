// api/index.js
import serverless from "serverless-http";
import { init } from "../src/index.js";

let handlerPromise = init().then(appInstance => {
  console.log("✅ Serverless handler ready");
  return serverless(appInstance);
});

export default async function handler(req, res) {
  console.log("▶️ Wrapper invoked:", req.method, req.url);
  const fn = await handlerPromise;  // now truly waits for DB connect
  return fn(req, res);
}
