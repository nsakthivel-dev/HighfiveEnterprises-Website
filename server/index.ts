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

  // Get port from environment variable (Render provides this)
  const envPort = process.env.PORT;
  const desiredPort = envPort ? parseInt(envPort, 10) : 4000;
  const host = '0.0.0.0';

  // Log startup information
  log(`Starting server in ${isDev ? 'development' : 'production'} mode`);
  log(`Environment port: ${envPort || 'not set'}`);
  log(`Attempting to listen on port: ${desiredPort}`);
  log(`Host: ${host}`);

  // Handle server errors
  server.on('error', (err: any) => {
    console.error('Server error:', err);
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${desiredPort} is already in use`);
      // Try a different port in production
      if (!isDev) {
        const fallbackPort = desiredPort + 1;
        log(`Trying fallback port: ${fallbackPort}`);
        server.listen(fallbackPort, host);
      }
    }
    // Don't exit on error - log and let it retry
  });

  // Handle successful server start
  server.on('listening', () => {
    const addr = server.address();
    const actualPort = typeof addr === 'object' && addr ? addr.port : desiredPort;
    log(`Server successfully started on ${host}:${actualPort}`);
    log(`Server is ready to accept connections`);
    // Keep the process alive
    process.stdin.resume();
  });

  // Start listening
  server.listen(desiredPort, host, () => {
    const addr = server.address();
    const actualPort = typeof addr === 'object' && addr ? addr.port : desiredPort;
    log(`Express server listening on http://${host}:${actualPort}`);
  });
}

serverReady = initServer().catch((error) => {
  console.error('Failed to initialize server:', error);
  // Log the error but don't exit - let the server try to continue
  console.error('Server initialization failed, but process will continue running');
});

// Handle uncaught exceptions - log but don't exit in production
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // In production, don't exit immediately - log and continue
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});

// Handle unhandled promise rejections - log but don't exit in production
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, don't exit immediately - log and continue
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});

// Export the app
export { app, serverReady };
export default app;
