# Render Deployment Guide for SolutionSquadHub

## Overview
This guide walks you through deploying SolutionSquadHub to Render (www.render.com), a modern cloud platform that integrates seamlessly with GitHub.

## Prerequisites
- GitHub account with your repository pushed
- Render account (free at www.render.com)
- Supabase project with environment variables
- Basic understanding of environment variables

## Step 1: Prepare Your GitHub Repository

1. **Initialize Git** (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - ready for Render deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

2. **Verify these files exist in your repo:**
   - `render.yaml` - Deployment configuration
   - `.gitignore` - Excludes node_modules and sensitive files
   - `.env.example` - Environment variable template
   - `package.json` - Updated with build scripts
   - `server/index.ts` - Main server file
   - `vite.config.ts` - Client build configuration

## Step 2: Set Up Render Account

1. Go to [render.com](https://www.render.com)
2. Click "Sign Up" and create your account
3. Connect your GitHub account to Render
4. Grant Render access to your repository

## Step 3: Create a Web Service on Render

### Option A: Using render.yaml (Recommended)
1. From your Render dashboard, click **"New +"** → **"Web Service"**
2. Select **"Deploy existing repository"**
3. Choose your GitHub repository
4. Select the branch (usually `main`)
5. Render will automatically detect and use `render.yaml` configuration

### Option B: Manual Configuration
If render.yaml isn't detected, configure manually:

1. **Service Details:**
   - Name: `solutionsquadhub` (or your preferred name)
   - Region: Select closest to you
   - Branch: `main` (or your deployment branch)
   - Root Directory: Leave empty

2. **Build Configuration:**
   - Build Command: `npm install -g pnpm && pnpm install --frozen-lockfile && pnpm run build`
   - Start Command: `pnpm start`

3. **Environment:**
   - Plan: Select Free or Paid (free tier available)
   - Instance Type: Standard

## Step 4: Configure Environment Variables

1. In Render dashboard, go to your service
2. Click **"Environment"** tab
3. Add the following environment variables:

```
PORT=5000
HOST=0.0.0.0
NODE_ENV=production

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: If using OpenAI chatbot
OPENAI_API_KEY=your_openai_key
```

### Getting Supabase Credentials:
1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Click **"Settings"** → **"API"**
4. Copy:
   - Project URL → `SUPABASE_URL`
   - Anon Public Key → `VITE_SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will start the deployment
3. Watch the build logs in the "Logs" tab
4. Once green checkmark appears, your app is live!

## Step 6: Access Your Application

Your application will be available at:
```
https://your-service-name.onrender.com
```

You can find the exact URL in:
- Service dashboard under "Deploys"
- Environment variables you can update

## Monitoring & Maintenance

### View Logs
- Click **"Logs"** tab to see application output
- Useful for debugging errors

### Redeploy
- **Auto-deploy:** Enabled by default (pushes to GitHub trigger redeployment)
- **Manual deploy:** Click "Deploy latest commit" in dashboard

### Environment Variables Update
1. Click **"Environment"** tab
2. Edit variables
3. Click **"Save"** - this triggers a redeploy

### Database Updates
To run database migrations or commands:
```bash
# In Render shell or locally
pnpm run db:push
```

## Troubleshooting

### Build Fails
1. Check build logs in Render dashboard
2. Verify `package.json` exists and is valid
3. Ensure Node version is 18+
4. Check that build command produces `dist` folder

### Application Crashes
1. Check application logs
2. Verify all environment variables are set
3. Check Supabase credentials are correct
4. Ensure `PORT` and `HOST` are not hardcoded

### Environment Variables Not Loading
1. Verify variable names match code
2. Redeploy after adding variables
3. Check `.env` file is in `.gitignore`

### Static Assets Not Loading
1. Verify `dist/public` folder exists
2. Check `vite.config.ts` output directory
3. Verify static files are copied to dist

## Performance Optimization

### For Free Tier:
- Service spins down after 15 minutes of inactivity
- First request after inactivity may be slow
- Consider upgrading to Starter plan for better performance

### Recommended Optimizations:
1. Enable gzip compression in Express
2. Implement caching headers
3. Optimize database queries
4. Use CDN for static assets

## Scaling Up

When ready to upgrade from free tier:
1. Click on your service in Render dashboard
2. Go to **"Settings"** → **"Plan"**
3. Select **"Starter"** or higher
4. Choose resources (CPU, RAM)
5. Service will restart with new configuration

## Custom Domain

1. In Render dashboard, go to **"Settings"** → **"Custom Domain"**
2. Add your domain
3. Update DNS records as per Render instructions
4. Wait for SSL certificate (usually instant)

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Node.js Best Practices](https://nodejs.org/en/docs/)
- [Vite Documentation](https://vitejs.dev/)

## Support

- Render Support: https://render.com/support
- Supabase Support: https://supabase.com/support
- Check application logs for error details

---

**Successfully deployed? 🎉**
Share your live URL and enjoy your deployed application!
