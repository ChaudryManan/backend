import serverless from "serverless-http";
import { init } from "../index.js";

let handlerPromise;

export default async function handler(req, res) {
  if (!handlerPromise) {
    const app = await init();
    handlerPromise = serverless(app);
  }
  return handlerPromise(req, res); // Added return and fixed syntax
}