
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import { getMessaging, isSupported } from "firebase/messaging";
import { initializeFirebase } from "./initFirebase";

// Initialize Firebase using our utility function
const {
  initialized: isInitialized,
  app,
  db: firestoreDb,
  auth: firebaseAuth,
  error: initError
} = initializeFirebase();

// Log initialization status
console.log("Firebase initialization status:", {
  isInitialized,
  projectId: isInitialized ? app.options.projectId : null,
  error: initError || null
});

// If initialization failed, create mock implementations
let db = firestoreDb;
let auth = firebaseAuth;
let messaging = null;

// If Firebase failed to initialize, create mock implementations
if (!isInitialized) {
  console.error("❌ Firebase initialization error:", initError);
  
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
      doc: () => ({
        get: async () => ({ exists: false, data: () => null }),
        set: async () => {}
      }),
      where: () => ({
        get: async () => ({ docs: [], empty: true }),
        onSnapshot: (callback) => {
          callback({ docs: [], empty: true });
          return () => {};
        }
      }),
      orderBy: () => ({
        get: async () => ({ docs: [], empty: true }),
        onSnapshot: (callback) => {
          callback({ docs: [], empty: true });
          return () => {};
        }
      }),
      limit: () => ({
        get: async () => ({ docs: [], empty: true }),
        onSnapshot: (callback) => {
          callback({ docs: [], empty: true });
          return () => {};
        }
      }),
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
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {};
    }
  };
} else {
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

// Export the initialized services
export { db, auth, messaging, app };
