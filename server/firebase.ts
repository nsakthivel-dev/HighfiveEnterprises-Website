import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import dotenv from "dotenv";

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID || "lupus-venture";

if (!admin.apps.length) {
  try {
    // Attempt to initialize using GOOGLE_APPLICATION_CREDENTIALS path if provided
    // Otherwise, it will try to use default credentials (e.g., in Google Cloud)
    // For local development with just projectId, some features might be limited
    admin.initializeApp({
      projectId: projectId,
      storageBucket: `${projectId}.firebasestorage.app`
    });
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
export const adminStorage = getStorage();

export default admin;
