#!/bin/bash

# Render Deployment Build Script
# This script is executed during the build phase on Render

set -e  # Exit on error

echo "======================================"
echo "🔨 Building SolutionSquadHub for Render"
echo "======================================"

# Check Node version
echo "✅ Node version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install pnpm globally
echo "📦 Installing pnpm..."
npm install -g pnpm
echo "✅ pnpm version: $(pnpm --version)"

# Install dependencies
echo "📥 Installing dependencies..."
pnpm install --frozen-lockfile

# Build the application
echo "🏗️  Building application..."
pnpm run build

# Verify build output
if [ -d "dist" ]; then
  echo "✅ Build directory created successfully"
  echo "📊 Build output size: $(du -sh dist | cut -f1)"
else
  echo "❌ Build failed - dist directory not created"
  exit 1
fi

if [ -f "dist/index.js" ]; then
  echo "✅ Server bundle created: dist/index.js"
else
  echo "❌ Server bundle not found: dist/index.js"
  exit 1
fi

if [ -d "dist/public" ]; then
  echo "✅ Client bundle created: dist/public"
  echo "📊 Client output size: $(du -sh dist/public | cut -f1)"
else
  echo "❌ Client bundle not found: dist/public"
  exit 1
fi

echo ""
echo "======================================"
echo "✨ Build completed successfully!"
echo "======================================"
