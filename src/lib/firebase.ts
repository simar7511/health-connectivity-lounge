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

// ✅ Correct Firebase Configuration (Environment Variables)
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
  // ✅ Initialize Firebase
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);

  // 🔥 Enable Firestore Debug Logging
  setLogLevel("debug");

  console.log("✅ Firebase initialized:", app);
  console.log("✅ Firestore initialized:", db);
  console.log("✅ Authentication initialized:", auth);
} catch (error: any) {
  console.error("❌ Firebase initialization error:", error);

  // Show error using toast notification
  toast({
    variant: "destructive",
    title: "Firebase Configuration Error",
    description: `Please ensure Firebase is properly configured. Error: ${error.message}`,
  });

  // Fallback: Create empty objects to prevent runtime errors
  db = {} as any;
  auth = {} as any;
}

// ✅ Export Firebase Services
export { db, auth };

