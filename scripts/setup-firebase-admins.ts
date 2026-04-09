import { adminAuth } from "../server/firebase.js";
import dotenv from "dotenv";

dotenv.config();

const adminUsers = [
  { email: 'nsakthiveldev@gmail.com', password: '@whitedevil12345' },
  { email: 'aaminathamiz@gmail.com', password: '@aamin12345' },
  { email: 'hiteshreem2007@gmail.com', password: '@hiteshree12345' },
  { email: 'hariharan.b17706@gmail.com', password: '@hariharan12345' },
  { email: 'fazeelaofficial1609@gmail.com', password: '@fazeela12345' },
  { email: 'arjungova111@gmail.com', password: '@arjun12345' }
];

async function setupAdmins() {
  console.log("Setting up Admin users in Firebase Auth...");

  for (const user of adminUsers) {
    try {
      await adminAuth.createUser({
        email: user.email,
        password: user.password,
        emailVerified: true
      });
      console.log(`✅ Success: User created - ${user.email}`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`ℹ️ Info: User already exists - ${user.email}`);
      } else {
        console.error(`❌ Error creating user ${user.email}:`, error.message);
      }
    }
  }

  console.log("Admin setup complete.");
  process.exit(0);
}

setupAdmins();
