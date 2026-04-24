import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import dotenv from "dotenv";

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

let firebaseInitialized = false;

if (!admin.apps.length) {
  try {
    if (projectId && clientEmail && privateKey) {
      // Initialize with service account credentials
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket: storageBucket || `${projectId}.firebasestorage.app`
      });
      firebaseInitialized = true;
      console.log("Firebase Admin SDK initialized successfully with service account");
    } else if (projectId) {
      // Initialize with just projectId (limited functionality)
      admin.initializeApp({
        projectId: projectId,
        storageBucket: storageBucket || `${projectId}.firebasestorage.app`
      });
      firebaseInitialized = true;
      console.log("Firebase Admin SDK initialized with limited configuration (projectId only)");
    } else {
      console.warn("Firebase Admin SDK: FIREBASE_PROJECT_ID not set. Firebase features will be disabled.");
      console.warn("Application will continue running without Firebase functionality.");
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    console.warn("Application will continue running without Firebase functionality.");
    // Don't exit the process, just warn that Firebase won't be available
    firebaseInitialized = false;
  }
}

// Export safely - these will work if Firebase is initialized
export const adminDb = firebaseInitialized ? getFirestore() : null as any;
export const adminAuth = firebaseInitialized ? getAuth() : null as any;
export const adminStorage = firebaseInitialized ? getStorage() : null as any;

export { firebaseInitialized };

export default admin;
