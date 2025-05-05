import serverless from "serverless-http";
import { init } from "../index.js";

let handler;

export default async (req, res) => {
  if (!handler) {
    const app = await init();
    handler = serverless(app);
  }
  return handler(req, res);
};