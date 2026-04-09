import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Register routes and set up the server
let serverReady: Promise<void>;

async function initServer() {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup vite/static serving and listen
  const isDev = process.env.NODE_ENV === "development" || app.get("env") === "development";
  
  if (isDev) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const envPort = process.env.PORT;
  let desiredPort = envPort ? parseInt(envPort, 10) : 4000;
  const host = '0.0.0.0';

  let attempts = 0;
  const maxAttempts = 10;

  const tryListen = (p: number) => {
    server.removeAllListeners('error');
    if (p === 0) {
      server.listen({ port: 0, host }, () => {
        const addr = server.address();
        const actualPort = typeof addr === 'object' && addr ? addr.port : p;
        log(`serving on http://localhost:${actualPort}`);
      });
      return;
    }

    server.on('error', (err: any) => {
      if (err && err.code === 'EADDRINUSE') {
        attempts += 1;
        if (attempts <= maxAttempts) {
          const nextPort = p + 1;
          log(`EADDRINUSE on ${host}:${p}, retrying on ${nextPort}…`);
          tryListen(nextPort);
        } else {
          log(`EADDRINUSE: Exhausted retries up to ${p}.`);
          throw err;
        }
      } else if (err && err.code === 'ENOTSUP') {
        log(`ENOTSUP: Failed to bind to ${host}:${p}`);
        tryListen(p + 1);
      } else {
        throw err;
      }
    });

    server.listen({ port: p, host }, () => {
      log(`serving on http://localhost:${p}`);
    });
  };

  tryListen(desiredPort);
}

serverReady = initServer();

// Export the app
export { app, serverReady };
export default app;
