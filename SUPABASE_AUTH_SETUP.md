# Supabase Authentication Setup for Admin Panel

This document explains how to set up Supabase authentication for the HighFive Enterprises admin panel.

## Prerequisites

1. A Supabase project (free tier is sufficient)
2. Node.js installed
3. Environment variables configured

## Step 1: Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

You can find these values in your Supabase project dashboard:
1. Go to your Supabase project
2. Click on "Settings" → "API"
3. Copy the "Project URL" for SUPABASE_URL and NEXT_PUBLIC_SUPABASE_URL
4. Copy the "anon public" key for NEXT_PUBLIC_SUPABASE_ANON_KEY
5. Copy the "service_role" key for SUPABASE_SERVICE_ROLE_KEY

## Step 2: Create Admin Users

Run the script to create the admin users in Supabase:

```bash
node scripts/create-admin-users.js
```

This script will create the following admin users with their respective passwords:

| Email | Password |
|-------|----------|
| ajjigova111@gmail.com | @arjun12345 |
| hiteshreem2007@gmail.com | @hiteshree12345 |
| aaminathamiz@gmail.com | @aamin12345 |
| fazeelaofficial1609@gmail.com | @fazeela12345 |
| hariharan.b17706@gmail.com | @hariharan12345 |
| nsakthiveldev@gmail.com | @whitedevil12345 |

## Step 3: Enable Email Authentication in Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" → "Providers"
3. Enable "Email" as an authentication provider
4. Make sure "Confirm email" is enabled if you want email confirmation

## Step 4: Configure Row Level Security (Optional but Recommended)

To add an extra layer of security, you can configure Row Level Security (RLS) on your tables to ensure only authenticated users can access data.

## How Authentication Works

The authentication system works as follows:

1. Users navigate to `/admin` which redirects to `/admin/login`
2. Users enter their email and password
3. The system checks if the email is in the predefined admin list
4. If the email is authorized, it attempts to authenticate with Supabase
5. Upon successful authentication, users are redirected to the admin dashboard
6. All admin routes are protected by the `ProtectedRoute` component
7. Users can log out through the user menu in the admin panel

## Testing Authentication

To test the authentication:

1. Start your development server: `pnpm dev`
2. Navigate to `http://localhost:5000/admin`
3. You should be redirected to the login page
4. Try logging in with one of the admin credentials
5. You should be redirected to the admin dashboard
6. Try accessing `/admin-panel/dashboard` directly - you should be redirected to login if not authenticated

## Security Notes

- Only the predefined email addresses can access the admin panel
- Passwords are handled securely by Supabase
- Session management is handled by Supabase
- The authentication system checks both Supabase authentication and email authorization
- Even if someone creates an account with an unauthorized email, they cannot access the admin panel