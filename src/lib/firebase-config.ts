
// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";
import { toast } from "@/hooks/use-toast";

// Use environment variables with fallbacks to hardcoded values as a last resort
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCx60XPDz1pEfh2y4ZyARYDU86h9AxNFXw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "health-connectivity-01.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "health-connectivity-01",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "health-connectivity-01.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "429069343294",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:429069343294:web:943a1998a83e63353c0f6f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3BVWXWV69Q",
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;
let messaging = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Initialize Firebase Cloud Messaging if supported
  isSupported()
    .then(supported => {
      if (supported) {
        messaging = getMessaging(app);
        console.log("✅ Firebase Cloud Messaging initialized");
      } else {
        console.log("ℹ️ Firebase Cloud Messaging not supported in this environment");
      }
    })
    .catch(error => {
      console.error("Error checking FCM support:", error);
    });

  // Log successful Firebase initialization for debugging
  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
  toast({
    variant: "destructive",
    title: "Firebase Error",
    description: `Failed to initialize Firebase: ${error instanceof Error ? error.message : String(error)}`,
  });
}

export { app, auth, db, storage, messaging, firebaseConfig };
