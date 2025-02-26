
import { initializeApp } from "firebase/app";
import { getFirestore, setLogLevel } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "@/hooks/use-toast";

// Firebase configuration
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
let db;
let auth;

try {
  // Initialize Firebase with detailed logging
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
