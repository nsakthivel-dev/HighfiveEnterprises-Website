// Script to create admin users in Supabase
// Run this script after setting up your Supabase project

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env file
config({ path: '.env' });

// Debug: Log environment variables
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');

// Get these from your Supabase project settings
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Admin users to create
const adminUsers = [
  { email: 'ajjigova111@gmail.com', password: '@arjun12345' },
  { email: 'hiteshreem2007@gmail.com', password: '@hiteshree12345' },
  { email: 'aaminathamiz@gmail.com', password: '@aamin12345' },
  { email: 'fazeelaofficial1609@gmail.com', password: '@fazeela12345' },
  { email: 'hariharan.b17706@gmail.com', password: '@hariharan12345' },
  { email: 'nsakthiveldev@gmail.com', password: '@whitedevil12345' }
];

async function createAdminUsers() {
  console.log('Creating admin users...');
  
  for (const user of adminUsers) {
    try {
      // Create the user directly without checking if exists
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
      });
      
      if (error) {
        // If user already exists, we'll get an error
        if (error.message.includes('already exists')) {
          console.log(`User ${user.email} already exists, skipping...`);
        } else {
          console.error(`Error creating user ${user.email}:`, error.message);
        }
      } else {
        console.log(`Successfully created user ${user.email}`);
      }
    } catch (error) {
      console.error(`Unexpected error creating user ${user.email}:`, error.message);
    }
  }
  
  console.log('Finished creating admin users');
}

createAdminUsers();