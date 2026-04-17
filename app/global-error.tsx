"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground">
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-3xl font-bold mb-4 tracking-tight">System Error</h2>
          <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
            We've encountered an unexpected error. Our team has been notified and we're working to fix it.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => reset()}
              className="px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Try again
            </button>
            <a 
              href="/"
              className="px-8 py-3 bg-secondary text-foreground font-bold rounded-2xl hover:bg-secondary/80 transition-all"
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
