# Render Deployment Guide

## Issues Fixed

The deployment was failing because the Express server was exiting early. The following fixes have been applied:

### 1. **Firebase Initialization Error Handling**
- Firebase errors no longer crash the server
- The application continues running even if Firebase fails to initialize
- Added proper error messages to help diagnose Firebase configuration issues

### 2. **Server Startup Improvements**
- Added a 30-second startup timeout to detect failures
- Proper exit codes when server fails to start
- Better error logging for troubleshooting

### 3. **Health Check Endpoints**
- Added `/` and `/health` endpoints for Render health checks
- Returns JSON status to confirm the server is running

### 4. **Render Configuration**
- Created `render.yaml` with proper build and start commands
- Configured environment variables

## Deploying to Render

### Option 1: Using render.yaml (Recommended)

1. Push your code to GitHub/GitLab
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Blueprint"
4. Connect your repository
5. Render will automatically detect `render.yaml` and configure the service

### Option 2: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your repository
4. Configure the following settings:

**Build Settings:**
- **Build Command:** `pnpm install && pnpm run build`
- **Start Command:** `pnpm run server`
- **Node Version:** 20.x

**Environment Variables:**
```
NODE_ENV=production
```

**If using Firebase (Optional):**
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-bucket-name
```

## Important Notes

### Port Configuration
- Render automatically provides the `PORT` environment variable
- The server is configured to listen on `process.env.PORT`
- Default fallback is port 4000

### Firebase Configuration
The application will run **without Firebase** if credentials are not provided. However, these features won't work:
- Admin dashboard
- Feedback system
- Services/Packages management
- File uploads
- Email sending

For full functionality, add your Firebase Admin SDK credentials in the Render dashboard.

### Health Checks
- Render will check the `/` endpoint for health
- The server returns a JSON response confirming it's running
- Health check interval is automatically managed by Render

## Troubleshooting

### "Application exited early"
- Check the deployment logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify the build completes successfully

### "Port already in use"
- This shouldn't happen on Render as they provide a unique PORT
- Locally, kill the process using the port or use a different PORT

### Firebase Errors
- Verify your Firebase credentials are correct
- Ensure `FIREBASE_PRIVATE_KEY` includes the quotes and newlines
- Check that the service account has proper permissions

### Build Failures
- Ensure Node.js version is 20.x
- Run `pnpm install` locally to verify dependencies
- Check that `pnpm-lock.yaml` is committed to the repository

## Testing Locally

Before deploying, test the production build locally:

```bash
# Install dependencies
pnpm install

# Build the static site
pnpm build

# Start the production server
pnpm server
```

The server should start on `http://localhost:4000`

## Logs

View detailed logs in:
1. Render Dashboard → Your Service → Logs
2. Look for "=== SERVER STARTED SUCCESSFULLY ===" message
3. Check for any Firebase initialization warnings

## Support

If you continue to experience issues:
1. Check Render's troubleshooting guide: https://render.com/docs/troubleshooting-deploys
2. Review the deployment logs for specific error messages
3. Ensure all environment variables are properly configured
