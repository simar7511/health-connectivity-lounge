
// Firebase configuration and initialization with performance optimizations
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported } from "firebase/messaging";
import { toast } from "@/hooks/use-toast";

// Use environment variables with fallbacks to hardcoded values as a last resort
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase with singleton pattern
let app;
let auth;
let db;
let storage;
let messaging = null;

// Check if Firebase already initialized to prevent duplicate initialization during HMR
if (!getApps().length) {
  try {
    console.time('Firebase Initialization');
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Use emulators when in development
    if (import.meta.env.DEV) {
      // Uncomment these lines if you want to use Firebase emulators
      // connectAuthEmulator(auth, 'http://localhost:9099');
      // connectFirestoreEmulator(db, 'localhost', 9000);
      // connectStorageEmulator(storage, 'localhost', 9199);
    }

    // Initialize Firebase Cloud Messaging with promise handling
    const initializeMessaging = async () => {
      try {
        const isMessagingSupported = await isSupported();
        if (isMessagingSupported) {
          messaging = getMessaging(app);
          console.log("✅ Firebase Cloud Messaging initialized");
        } else {
          console.log("ℹ️ Firebase Cloud Messaging not supported in this environment");
        }
      } catch (error) {
        console.error("Error checking FCM support:", error);
      }
    };

    // Initialize messaging asynchronously but don't wait for it
    initializeMessaging();
    
    console.timeEnd('Firebase Initialization');
    console.log("✅ Firebase initialized successfully");
  } catch (error) {
    console.error("❌ Firebase initialization error:", error);
    
    // Only show toast in browser environment
    if (typeof window !== 'undefined') {
      toast({
        variant: "destructive",
        title: "Firebase Error",
        description: `Failed to initialize Firebase: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }
} else {
  // Reuse existing Firebase instances
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log("♻️ Reusing existing Firebase instances");
}

export { app, auth, db, storage, messaging, firebaseConfig };
