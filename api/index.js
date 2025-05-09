// api/index.js
import serverless from "serverless-http";
import { init } from "../src/index.js";

// **Kick off initialization at module load**
//   — connectDB runs at import-time in db/index.js (Option A).
//   — init() simply returns the app.
const handlerPromise = init().then(appInstance => {
  console.log("✅ Serverless handler ready");
  return serverless(appInstance);
});

export default async function handler(req, res) {
  console.log("▶️ Wrapper invoked:", req.method, req.url);
  const fn = await handlerPromise;  // already resolved (or in-flight)
  return fn(req, res);
}
