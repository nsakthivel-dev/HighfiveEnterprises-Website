# Windows Setup and Build Instructions

This document provides instructions for building and running the Highfive Enterprises website on Windows systems.

## Prerequisites

1. Node.js (version 18 or higher)
2. pnpm (package manager)
3. Windows PowerShell

## Installation

1. Install dependencies:
   ```
   pnpm install
   ```

## Building the Project

### Option 1: Using Batch Files (Recommended for Windows)

Double-click on `build.bat` to build the project.

### Option 2: Using Command Line

Run the following command:
```
pnpm build:win
```

This will:
1. Build the client-side application using Vite
2. Bundle the server-side code using esbuild
3. Output everything to the `dist` folder

## Running the Application

### Development Mode

#### Option 1: Using Batch Files
Double-click on `dev.bat` to start the development server.

#### Option 2: Using Command Line
```
pnpm dev
```

### Production Mode

#### Option 1: Using Batch Files
After building, double-click on `start.bat` to start the production server.

#### Option 2: Using Command Line
```
pnpm start
```

## Folder Structure After Build

```
dist/
├── index.js              # Bundled server code
└── public/               # Client build files
    ├── index.html        # Main HTML file
    ├── assets/           # CSS, JS, and image assets
    └── _redirects        # Redirect rules (if applicable)
```

## Troubleshooting

1. **'&&' is not a valid statement separator**: This is a known issue with older versions of PowerShell. We've provided a Windows-compatible build script that uses `&` instead.

2. **'vite' is not recognized**: Make sure you've run `pnpm install` first.

3. **Port already in use**: The application will automatically try different ports if the default is occupied.