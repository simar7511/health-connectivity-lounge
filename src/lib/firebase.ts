
import { initializeApp } from "firebase/app";
import { getFirestore, setLogLevel } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "@/hooks/use-toast";

// ✅ Debugging: Log environment variables before initializing Firebase
console.log("🔥 Firebase ENV Variables:");
console.log("API Key:", import.meta.env.VITE_FIREBASE_API_KEY);
console.log("Auth Domain:", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log("Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log("Storage Bucket:", import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
console.log("Messaging Sender ID:", import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
console.log("App ID:", import.meta.env.VITE_FIREBASE_APP_ID);

// ✅ Correct Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Declare Firebase services
let db;
let auth;

try {
  // ✅ Initialize Firebase with detailed logging
  console.log("🔄 Attempting to initialize Firebase with config:", firebaseConfig);
  const app = initializeApp(firebaseConfig);
  console.log("✅ Firebase app initialized successfully:", app);

  db = getFirestore(app);
  console.log("✅ Firestore initialized:", db);

  auth = getAuth(app);
  console.log("✅ Authentication initialized:", auth);

  // Enable Firestore Debug Logging
  setLogLevel("debug");
} catch (error: any) {
  console.error("❌ Firebase initialization error:", error);
  toast({
    variant: "destructive",
    title: "Firebase Configuration Error",
    description: `Please ensure Firebase is properly configured. Error: ${error.message}`,
  });

  // Fallback: Create empty objects to prevent runtime errors
  db = {} as any;
  auth = {} as any;
}

export { db, auth };
