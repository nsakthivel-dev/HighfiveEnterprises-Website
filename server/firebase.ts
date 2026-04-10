import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import dotenv from "dotenv";

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID || "lupus-venture";

if (!process.env.FIREBASE_PROJECT_ID) {
  console.warn("⚠️ FIREBASE_PROJECT_ID not set, falling back to:", projectId);
}

if (!admin.apps.length) {
  try {
    // Attempt to initialize using GOOGLE_APPLICATION_CREDENTIALS path if provided
    // Otherwise, it will try to use default credentials (e.g., in Google Cloud)
    // For local development with just projectId, some features might be limited
    
    const config: admin.AppOptions = {
      projectId: projectId,
      storageBucket: `${projectId}.firebasestorage.app`
    };

    // If private key and client email are provided in environment variables (for Vercel/Render)
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      config.credential = admin.credential.cert({
        projectId: projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Ensure private key handles newlines correctly
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
    }

    admin.initializeApp(config);
    console.log("✅ Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing Firebase Admin SDK:", error);
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
export const adminStorage = getStorage();

export default admin;
