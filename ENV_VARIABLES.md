## Environment Variables Reference

This document explains all environment variables used by SolutionSquadHub.

### Server Configuration

#### PORT
- **Type:** Number
- **Default:** 5000
- **Required:** No
- **Description:** The port on which the Express server listens
- **Production:** Set to 5000 for Render

#### HOST
- **Type:** String  
- **Default:** 127.0.0.1
- **Required:** No
- **Description:** The host IP address to bind to
- **Production:** Set to 0.0.0.0 for Render

#### NODE_ENV
- **Type:** String
- **Values:** development | production
- **Default:** development
- **Required:** Yes
- **Description:** Environment mode for the application
- **Production:** Set to production

### Supabase Configuration

#### VITE_SUPABASE_URL
- **Type:** String (URL)
- **Required:** Yes
- **Description:** Your Supabase project URL
- **How to get:**
  1. Go to supabase.com
  2. Open your project
  3. Click Settings → API
  4. Copy "Project URL"
- **Example:** `https://xxxxx.supabase.co`

#### VITE_SUPABASE_ANON_KEY
- **Type:** String (JWT Token)
- **Required:** Yes
- **Description:** Supabase anonymous/public API key for frontend
- **How to get:**
  1. Go to supabase.com
  2. Open your project
  3. Click Settings → API
  4. Copy "Anon Public Key"
- **Security:** Safe to expose in client-side code (limited permissions)

#### SUPABASE_URL
- **Type:** String (URL)
- **Required:** Yes
- **Description:** Server-side Supabase project URL (usually same as VITE_SUPABASE_URL)
- **How to get:** Same as VITE_SUPABASE_URL

#### SUPABASE_SERVICE_ROLE_KEY
- **Type:** String (JWT Token)
- **Required:** Yes
- **Description:** Supabase service role key for server-side operations
- **How to get:**
  1. Go to supabase.com
  2. Open your project
  3. Click Settings → API
  4. Copy "Service Role Key" (scroll down)
- **Security:** ⚠️ NEVER expose in frontend code - server-side only!

### Optional Configuration

#### GEMINI_API_KEY
- **Type:** String
- **Required:** No (only if using Google Gemini chatbot)
- **Description:** Google Gemini API key for chatbot integration
- **How to get:**
  1. Go to makersuite.google.com
  2. Create an API key
  3. Copy the key
- **Security:** ⚠️ NEVER expose in client-side code

#### OPENAI_API_KEY
- **Type:** String
- **Required:** No (only if using chatbot)
- **Description:** OpenAI API key for ChatGPT integration
- **How to get:**
  1. Go to platform.openai.com
  2. Create API key
  3. Copy the key
- **Security:** ⚠️ NEVER expose in client-side code

#### DATABASE_URL
- **Type:** String (Connection string)
- **Required:** No (only if using custom database)
- **Description:** Custom database connection string
- **Format:** `postgresql://user:password@host:port/database`

#### DEBUG
- **Type:** Boolean (true | false)
- **Default:** false
- **Required:** No
- **Description:** Enable debug logging
- **Production:** Set to false

#### VITE_APP_URL
- **Type:** String (URL)
- **Required:** No
- **Description:** Frontend application URL (useful for CORS, email links, etc)
- **Example:** `https://solutionsquadhub.onrender.com`

## Setting Variables in Different Environments

### Local Development (.env file)
```bash
PORT=5000
HOST=127.0.0.1
NODE_ENV=development

VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAi...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAi...

GEMINI_API_KEY=AIzaSy...
OPENAI_API_KEY=sk-...
DEBUG=true
```

### Render Deployment (Dashboard)
1. Go to Render dashboard
2. Select your service
3. Click "Environment" tab
4. Add variables:
   - PORT=5000
   - HOST=0.0.0.0
   - NODE_ENV=production
   - VITE_SUPABASE_URL=[value]
   - VITE_SUPABASE_ANON_KEY=[value]
   - SUPABASE_URL=[value]
   - SUPABASE_SERVICE_ROLE_KEY=[value]

## Security Best Practices

✅ **DO:**
- Store all secrets in `.env` files (never in code)
- Add `.env` to `.gitignore`
- Use environment variables for all sensitive data
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (server-side only)
- Rotate API keys regularly
- Use different keys for development and production

❌ **DON'T:**
- Commit `.env` files to Git
- Expose `SUPABASE_SERVICE_ROLE_KEY` in client code
- Hardcode API keys in JavaScript
- Share API keys via email or chat
- Use same credentials across environments
- Log sensitive values to console in production

## Troubleshooting Environment Variables

### "Cannot find variable X"
```
Solution:
1. Check variable is set in Render dashboard
2. Verify variable name spelling (case-sensitive)
3. Restart the service after adding variables
4. Check .env file locally
```

### "Supabase connection failed"
```
Solution:
1. Verify SUPABASE_URL is correct
2. Check SUPABASE_SERVICE_ROLE_KEY is not expired
3. Ensure Supabase project is active
4. Check network connectivity
```

### "Permission denied" errors
```
Solution:
1. Use VITE_SUPABASE_ANON_KEY for frontend
2. Use SUPABASE_SERVICE_ROLE_KEY for backend
3. Check Supabase RLS (Row Level Security) policies
4. Verify table permissions
```

## Accessing Variables in Code

### Frontend (React)
```typescript
// Only variables prefixed with VITE_ are accessible
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

### Backend (Node.js)
```typescript
// Access via process.env
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const port = process.env.PORT || 5000;
const host = process.env.HOST || '0.0.0.0';
```

## Example Configuration

### Complete Local Development Setup
```bash
# .env file
PORT=5000
HOST=127.0.0.1
NODE_ENV=development
DEBUG=true

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

OPENAI_API_KEY=sk-proj-...
```

### Complete Production Setup (Render)
```
PORT → 5000
HOST → 0.0.0.0
NODE_ENV → production
DEBUG → false
VITE_SUPABASE_URL → https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY → eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL → https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY → eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY → sk-proj-...
VITE_APP_URL → https://solutionsquadhub.onrender.com
```

## Verification Checklist

- [ ] All required variables are set
- [ ] Variable values are correct
- [ ] `.env` file is in `.gitignore`
- [ ] No secrets in repository
- [ ] Environment matches configuration
- [ ] Service redeploys after variable changes
- [ ] Application starts without errors
- [ ] API endpoints work correctly

## Support

If you encounter issues:
1. Check this reference guide
2. Review application logs
3. Verify variable values
4. Check Supabase status
5. Contact support if needed
