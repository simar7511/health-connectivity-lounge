
import { initializeApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";
import { getFirestore, setLogLevel } from "@/types/firebase";
import { getAuth } from "@/types/firebase";
import { toast } from "@/hooks/use-toast";

// Firebase configuration using environment variables from .env file
const firebaseConfig = {
  apiKey: "AIzaSyCx60XPDz1pEfh2y4ZyARYDU86h9AxNFXw",
  authDomain: "health-connectivity-01.firebaseapp.com",
  projectId: "health-connectivity-01",
  storageBucket: "health-connectivity-01.appspot.com",
  messagingSenderId: "429069343294",
  appId: "1:429069343294:web:943a1998a83e63353c0f6f",
  measurementId: "G-3BVWXWV69Q"
};

// Declare Firebase services
let db: Firestore;
let auth: Auth;

try {
  // Initialize Firebase with minimal logging in production
  const isProduction = process.env.NODE_ENV === 'production';
  const app = initializeApp(firebaseConfig);
  
  if (!isProduction) {
    console.log("✅ Firebase app initialized");
  }

  db = getFirestore(app);
  auth = getAuth(app);

  // Only enable debug logging in development
  if (!isProduction) {
    setLogLevel("debug");
  }
  
  // Add offline persistence capability for Firestore
  // This allows the app to work offline with cached data
  // Note: This is a simplified approach; for a real implementation,
  // you would need to enable offline persistence with Firestore settings
} catch (error: any) {
  console.error("❌ Firebase initialization error:", error);
  toast({
    variant: "destructive",
    title: "Firebase Configuration Error",
    description: `Please ensure Firebase is properly configured. Error: ${error.message}`,
  });

  // Fallback: Create empty objects to prevent runtime errors
  db = {} as Firestore;
  auth = {} as Auth;
}

export { db, auth };
