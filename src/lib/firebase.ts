
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import { getMessaging, isSupported } from "firebase/messaging";

// Firebase configuration using environment variables
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
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  console.log("Firebase initialization started with config:", firebaseConfig);
  
  // Initialize services
  db = getFirestore(app);
  auth = getAuth(app);
  
  console.log("✅ Firebase app and services initialized");

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
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
  console.error("Firebase config:", JSON.stringify(firebaseConfig, null, 2));
  
  // Show error toast
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
