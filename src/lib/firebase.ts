
import { initializeApp } from "firebase/app";
import { Firestore as FirestoreType, getFirestore, setLogLevel } from "firebase/firestore";
import { Auth as AuthType, getAuth } from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import { getMessaging, isSupported } from "firebase/messaging";

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
let db: FirestoreType;
let auth: AuthType;
let messaging: any = null;

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
  db = {} as FirestoreType;
  auth = {} as AuthType;
}

export { db, auth, messaging };
