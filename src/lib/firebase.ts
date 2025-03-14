
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

// Add flag to prevent multiple initialization attempts
let isInitializing = false;
let isInitialized = false;

// Declare Firebase services
let app;
let db;
let auth;
let messaging = null;

try {
  if (!isInitialized && !isInitializing) {
    isInitializing = true;
    console.log("Initializing Firebase with config:", firebaseConfig.projectId);
    
    // Ensure all required config values are present
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      throw new Error("Missing required Firebase configuration values");
    }
    
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    console.log("✅ Firebase app initialized with project:", firebaseConfig.projectId);
    
    // Initialize services
    db = getFirestore(app);
    auth = getAuth(app);
    
    console.log("✅ Firebase Firestore and Auth services initialized");
    isInitialized = true;
    isInitializing = false;

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
  }
} catch (error) {
  isInitializing = false;
  console.error("❌ Firebase initialization error:", error);
  
  // Show error toast
  toast({
    variant: "destructive",
    title: "Firebase Configuration Error",
    description: "There was an issue initializing Firebase. You can still use demo mode.",
  });

  // Create dummy implementations with appropriate methods to prevent errors
  db = {
    collection: () => ({
      // Fake collection reference that won't throw errors
      where: () => ({}),
      orderBy: () => ({}),
      limit: () => ({}),
      get: async () => ({ docs: [], empty: true }),
      onSnapshot: (callback) => {
        // Call callback with empty data
        callback({ 
          docs: [], 
          empty: true, 
          forEach: () => {},
          size: 0
        });
        return () => {}; // Return unsubscribe function
      }
    })
  };
  
  auth = {
    signInWithEmailAndPassword: async () => ({ user: null }),
    signOut: async () => {},
    onAuthStateChanged: () => (() => {})
  };
  
  app = {};
}

// Export the initialized services
export { db, auth, messaging, app };
