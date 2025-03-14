
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import { getMessaging, isSupported } from "firebase/messaging";

// Firebase configuration - Use environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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

// Declare Firebase services
let app;
let db;
let auth;
let messaging = null;

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
    description: `Please check your .env file for proper configuration. Error: ${error instanceof Error ? error.message : String(error)}`,
  });

  // Create dummy implementations
  db = {};
  auth = {};
  app = {};
}

export { db, auth, messaging, app };
