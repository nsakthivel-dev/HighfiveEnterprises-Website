import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    (react() as any),
    {
      name: "copy-redirects",
      writeBundle() {
        const sourceFile = path.resolve(import.meta.dirname, "public", "_redirects");
        const destFile = path.resolve(import.meta.dirname, "dist/public", "_redirects");
        if (fs.existsSync(sourceFile)) {
          fs.copyFileSync(sourceFile, destFile);
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  envDir: "../",
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks more carefully to avoid circular dependencies
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['wouter'],
          'data-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['lucide-react', 'framer-motion'],
        },
      },
    },
  },
  server: {
    host: true,
    port: 3000,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  // @ts-ignore - Vitest types might not be in the project yet
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./client/src/setupTests.ts"],
    include: ["**/*.test.ts", "**/*.test.tsx"],
  },
});