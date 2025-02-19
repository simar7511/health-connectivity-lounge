
import { initializeApp } from "firebase/app";
import { getFirestore, setLogLevel } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "@/hooks/use-toast";

// Development configuration - Replace these with your Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgdfX1VBG7WTas",
  authDomain: "divhealth-dev.firebaseapp.com",
  projectId: "divhealth-dev",
  storageBucket: "divhealth-dev.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6abcdef1234"
};

let db;
let auth;

try {
  console.log('Initializing Firebase with config:', {
    ...firebaseConfig,
    apiKey: '***' // Hide API key in logs
  });

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);

  // Enable Firestore Debug Logging
  if (import.meta.env.DEV) {
    setLogLevel("debug");
  }

  console.log("✅ Firebase initialized:", app);
  console.log("✅ Firestore initialized:", db);
  console.log("✅ Authentication initialized:", auth);
} catch (error: any) {
  console.error("❌ Firebase initialization error:", error);
  
  toast({
    variant: "destructive",
    title: "Firebase Configuration Error",
    description: error.message || "Failed to initialize Firebase"
  });

  // Create empty objects to prevent runtime errors
  db = {} as any;
  auth = {} as any;
}

export { db, auth };
