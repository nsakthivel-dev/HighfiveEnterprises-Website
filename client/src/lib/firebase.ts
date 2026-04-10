import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Debug Firebase environment variables (only logs existence, not value for security)
if (import.meta.env.PROD) {
  console.log('Firebase Configuration Check:', {
    hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
    hasAuthDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    hasProjectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
    env: import.meta.env.MODE
  });
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

if (!firebaseConfig.apiKey) {
  console.error("Firebase API Key is missing! Check VITE_FIREBASE_API_KEY in your environment variables.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
