
import { initializeApp } from "firebase/app";
import { getFirestore } from "@/types/firebase";
import { getAuth } from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import { getMessaging, isSupported } from "firebase/messaging";

// Firebase configuration using environment variables from .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Declare Firebase services
let db;
let auth;
let messaging = null;

try {
  // Initialize Firebase with minimal logging in production
  const isProduction = process.env.NODE_ENV === 'production';
  const app = initializeApp(firebaseConfig);
  
  if (!isProduction) {
    console.log("✅ Firebase app initialized");
  }

  db = getFirestore(app);
  auth = getAuth(app);

  // Initialize Firebase Cloud Messaging if supported
  isSupported()
    .then(supported => {
      if (supported) {
        messaging = getMessaging(app);
        if (!isProduction) {
          console.log("✅ Firebase Cloud Messaging initialized");
        }
      } else {
        console.log("❌ Firebase Cloud Messaging not supported in this environment");
      }
    })
    .catch(error => {
      console.error("Error checking FCM support:", error);
    });
  
  // Add offline persistence capability for Firestore
  // This allows the app to work offline with cached data
  // Note: This is a simplified approach; for a real implementation,
  // you would need to enable offline persistence with Firestore settings
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
  toast({
    variant: "destructive",
    title: "Firebase Configuration Error",
    description: `Please ensure Firebase is properly configured. Error: ${error instanceof Error ? error.message : String(error)}`,
  });

  // Fallback: Create empty objects to prevent runtime errors
  db = {};
  auth = {};
}

export { db, auth, messaging };
