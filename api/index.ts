import { app, serverReady } from "../server/index";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Ensure server initialization is complete before handling requests
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await serverReady;
  app(req, res);
}
