
import { initializeApp } from "firebase/app";
import { getFirestore, setLogLevel } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "@/hooks/use-toast";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if all required Firebase config values are present
const requiredKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId'
];

const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  const errorMessage = `Missing required Firebase configuration keys: ${missingKeys.join(', ')}. Please check your .env file.`;
  console.error('❌ Firebase Config Error:', errorMessage);
  
  toast({
    variant: "destructive",
    title: "Firebase Configuration Error",
    description: "Firebase is not properly configured. Please check environment variables.",
  });

  throw new Error(errorMessage);
}

let db;
let auth;

try {
  console.log('Initializing Firebase with config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '***' : undefined // Hide actual API key in logs
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
  
  // Show error using toast
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
