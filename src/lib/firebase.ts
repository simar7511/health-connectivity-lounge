import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import { getMessaging, isSupported } from "firebase/messaging";

// Hardcoded Firebase configuration as fallback
const hardcodedConfig = {
  apiKey: "AIzaSyCx60XPDz1pEfh2y4ZyARYDU86h9AxNFXw",
  authDomain: "health-connectivity-01.firebaseapp.com",
  projectId: "health-connectivity-01",
  storageBucket: "health-connectivity-01.appspot.com",
  messagingSenderId: "429069343294",
  appId: "1:429069343294:web:943a1998a83e63353c0f6f",
  measurementId: "G-3BVWXWV69Q"
};

// Firebase configuration - Use environment variables first, fall back to hardcoded values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || hardcodedConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || hardcodedConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || hardcodedConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || hardcodedConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || hardcodedConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || hardcodedConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || hardcodedConfig.measurementId
};

// Log a redacted version of the config for troubleshooting
console.log("Firebase Config Status:", {
  apiKey: !!firebaseConfig.apiKey ? "Present" : "Missing",
  authDomain: !!firebaseConfig.authDomain ? "Present" : "Missing",
  projectId: !!firebaseConfig.projectId ? "Present" : "Missing",
  storageBucket: !!firebaseConfig.storageBucket ? "Present" : "Missing",
  messagingSenderId: !!firebaseConfig.messagingSenderId ? "Present" : "Missing",
  appId: !!firebaseConfig.appId ? "Present" : "Missing",
  measurementId: !!firebaseConfig.measurementId ? "Present" : "Missing"
});

// Declare Firebase services with default empty implementations for type safety
let app;
let db;
let auth;
let messaging = null;

// Check if we're missing any critical config values
const isMissingConfig = !firebaseConfig.apiKey || !firebaseConfig.projectId;

if (isMissingConfig) {
  console.warn("⚠️ Some Firebase config values are missing, using hardcoded values as fallback");
}

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log("✅ Firebase app initialized with project:", firebaseConfig.projectId);
  
  // Initialize services
  db = getFirestore(app);
  auth = getAuth(app);
  
  console.log("✅ Firebase Firestore and Auth services initialized");

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
  
  // Show error toast
  toast({
    variant: "destructive",
    title: "Firebase Configuration Error",
    description: `Please ensure Firebase is properly configured. Error: ${error instanceof Error ? error.message : String(error)}`,
  });

  // Create dummy implementations
  db = {};
  auth = {};
  app = {};
}

export { db, auth, messaging, app };
