import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from "dotenv";
import { createServer } from "http";

dotenv.config();

// Immediate startup logging
console.log("=== SERVER STARTUP INITIATED ===");
console.log("Node version:", process.version);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("Working directory:", process.cwd());

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

// Health check endpoint for Render
app.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Highfive Enterprises API is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime()
  });
});

// Error handler middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Express error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Start the server
async function start() {
  try {
    console.log("Step 1: Registering routes...");
    const httpServer = await registerRoutes(app);
    console.log("Step 1: Routes registered successfully");

    const isDev = process.env.NODE_ENV === "development";
    
    if (!isDev) {
      console.log("Step 2: Setting up static file serving...");
      try {
        serveStatic(app);
        console.log("Step 2: Static file serving configured");
      } catch (staticError) {
        console.warn("Warning: Static file serving setup failed:", staticError);
      }
    }

    // Render provides the PORT environment variable
    const port = parseInt(process.env.PORT || "4000", 10);
    const host = '0.0.0.0';

    console.log(`Step 3: Starting HTTP server on ${host}:${port}...`);
    
    // Set a timeout to detect if server fails to start
    const startupTimeout = setTimeout(() => {
      console.error("Server failed to start within 30 seconds");
      process.exit(1);
    }, 30000);
    
    httpServer.listen(port, host, () => {
      clearTimeout(startupTimeout);
      console.log("=== SERVER STARTED SUCCESSFULLY ===");
      console.log(`Express server listening on http://${host}:${port}`);
      console.log(`Environment: ${isDev ? 'development' : 'production'}`);
      console.log("Server is ready to accept connections");
      console.log("=====================================");
    });

    httpServer.on('error', (error: any) => {
      clearTimeout(startupTimeout);
      console.error("HTTP Server Error:", error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error("=== SERVER STARTUP FAILED ===");
    console.error("Fatal error during server startup:", error);
    console.error("Error stack:", (error as Error).stack);
    // Exit with error code so Render knows the deployment failed
    process.exit(1);
  }
}

// Start the server
start();

// Keep process alive
process.stdin.resume();

// Handle fatal errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
});

console.log("Server module loaded, starting initialization...");
