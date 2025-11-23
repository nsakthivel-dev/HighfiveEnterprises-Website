# Render Deployment Checklist ✅

Use this checklist before deploying to Render.

## Pre-Deployment

- [ ] Git repository initialized and pushed to GitHub
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/USERNAME/REPO
  git push -u origin main
  ```

- [ ] All sensitive data removed from code
  - [ ] No API keys in JavaScript/TypeScript files
  - [ ] No hardcoded database credentials
  - [ ] All secrets in `.env` files

- [ ] `.env.example` file created with template variables
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] NODE_ENV
  - [ ] PORT
  - [ ] HOST

- [ ] `.gitignore` file properly configured
  - [ ] node_modules/ in .gitignore
  - [ ] .env in .gitignore
  - [ ] dist/ in .gitignore
  - [ ] build/ in .gitignore

- [ ] `render.yaml` file created and correct
  - [ ] Build command is correct
  - [ ] Start command is correct
  - [ ] Port is set to 5000
  - [ ] Environment variables listed

- [ ] `package.json` updated
  - [ ] `"start"` script runs production code
  - [ ] `"build"` script produces dist folder
  - [ ] Node engine specified (>=18.0.0)
  - [ ] All dependencies are listed (no global installs)

## Supabase Setup

- [ ] Supabase project created at https://supabase.com
- [ ] Project API credentials obtained
  - [ ] Project URL
  - [ ] Anon Public Key
  - [ ] Service Role Key
- [ ] Database tables created
  - [ ] team_members
  - [ ] projects
  - [ ] events
  - [ ] feedback
  - [ ] applications
  - [ ] activities
  - [ ] network_collaborations
  - [ ] network_partners
  - [ ] services
  - [ ] packages
- [ ] Storage bucket "media" created in Supabase
  - [ ] Public access enabled for file downloads

## Render Setup

- [ ] Render account created at https://www.render.com
- [ ] GitHub account connected to Render
- [ ] Repository access granted to Render

## Render Deployment

- [ ] Web Service created on Render
  - [ ] GitHub repository connected
  - [ ] Correct branch selected (main)
  - [ ] render.yaml detected (or manual config complete)

- [ ] Environment variables configured in Render
  - [ ] PORT = 5000
  - [ ] HOST = 0.0.0.0
  - [ ] NODE_ENV = production
  - [ ] VITE_SUPABASE_URL = [from Supabase project settings]
  - [ ] VITE_SUPABASE_ANON_KEY = [from Supabase project settings]
  - [ ] SUPABASE_URL = [from Supabase project settings]
  - [ ] SUPABASE_SERVICE_ROLE_KEY = [from Supabase project settings]
  - [ ] VITE_GEMINI_API_KEY = [if using Google Gemini chatbot]
  - [ ] OPENAI_API_KEY = [if using OpenAI chatbot]
  - [ ] VITE_APP_URL = https://your-app-name.onrender.com

- [ ] Build command verified
  ```bash
  npm install -g pnpm && pnpm install --frozen-lockfile && pnpm run build
  ```

- [ ] Start command verified
  ```bash
  pnpm start
  ```

- [ ] Deployment started
  - [ ] Build logs checked for errors
  - [ ] Build completed successfully
  - [ ] Service is live (green checkmark)

## Post-Deployment Testing

- [ ] Access the application at `https://your-service-name.onrender.com`
- [ ] Homepage loads without errors
- [ ] Navigation works properly
- [ ] API endpoints respond correctly
- [ ] File uploads work (if applicable)
- [ ] Database queries work
- [ ] Environment variables are being used correctly
- [ ] Static assets (CSS, images) load properly
- [ ] No console errors in browser DevTools

## Production Monitoring

- [ ] Subscribe to Render status page (optional)
- [ ] Set up error tracking (optional)
  - [ ] Sentry
  - [ ] LogRocket
  - [ ] New Relic
  
- [ ] Monitor application logs regularly
- [ ] Set up alerts for service downtime (paid features)

## Optimization (Optional)

- [ ] Enable auto-redeploy on GitHub push
- [ ] Set up custom domain (if applicable)
- [ ] Configure HTTPS (automatic with Render)
- [ ] Consider upgrading from Free to Starter plan
- [ ] Set up database backups in Supabase
- [ ] Enable monitoring in Supabase

## Common Issues & Solutions

If you encounter issues:

### Build Fails
```
❌ Build command failed
→ Check that all dependencies are in package.json
→ Verify Node version is 18+
→ Check for syntax errors
```

### Application Won't Start
```
❌ Service won't start
→ Check application logs
→ Verify PORT environment variable
→ Ensure dist/index.js exists
```

### Static Files Not Loading
```
❌ CSS/images not loading
→ Check dist/public folder exists
→ Verify vite.config.ts settings
→ Check file paths in HTML
```

### Database Connection Fails
```
❌ Cannot connect to Supabase
→ Verify SUPABASE_URL is correct
→ Check SUPABASE_SERVICE_ROLE_KEY
→ Ensure Supabase project is active
```

## After Deployment

- [ ] Update project README with live URL
- [ ] Test all features thoroughly
- [ ] Get team feedback
- [ ] Document any custom configurations
- [ ] Set up monitoring/alerting
- [ ] Schedule regular backups

---

**Status:** ⏳ Ready to deploy  
**Last Updated:** [Today's Date]  
**Deployed URL:** [Will be filled after deployment]
