import { initializeApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth, type User, type NextOrObserver } from "firebase/auth";
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
let db: Firestore = firestoreDb;
let auth: Auth = firebaseAuth;
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

  // Create a mock Firestore implementation
  db = {
    // Add only the properties that are actually used in the app
    type: 'firestore',
    app: null,
    converter: null,
    // Other properties will be accessed via index signature
    _delegate: {
      type: 'firestore',
      app: null,
    }
  } as unknown as Firestore;

  // Add collection method via prototype manipulation to avoid TypeScript errors
  Object.defineProperty(db, 'collection', {
    value: () => ({
      doc: () => ({
        get: async () => ({ exists: false, data: () => null }),
        set: async () => {}
      }),
      where: () => ({
        get: async () => ({ docs: [], empty: true }),
        onSnapshot: (callback: any) => {
          callback({ docs: [], empty: true });
          return () => {};
        }
      }),
      orderBy: () => ({
        get: async () => ({ docs: [], empty: true }),
        onSnapshot: (callback: any) => {
          callback({ docs: [], empty: true });
          return () => {};
        }
      }),
      limit: () => ({
        get: async () => ({ docs: [], empty: true }),
        onSnapshot: (callback: any) => {
          callback({ docs: [], empty: true });
          return () => {};
        }
      }),
      get: async () => ({ docs: [], empty: true }),
      onSnapshot: (callback: any) => {
        callback({ 
          docs: [], 
          empty: true, 
          forEach: () => {},
          size: 0
        });
        return () => {};
      }
    }),
    enumerable: true
  });
  
  // Create a mock Auth implementation
  auth = {
    app: null,
    name: 'mock-auth',
    config: { apiKey: '', apiHost: '' },
    languageCode: null,
    tenantId: null,
    settings: { appVerificationDisabledForTesting: false },
    currentUser: null,
    _delegate: {
      app: null,
      name: 'mock-auth',
      config: { apiKey: '', apiHost: '' }
    }
  } as unknown as Auth;

  // Add auth methods via prototype manipulation
  Object.defineProperty(auth, 'signInWithEmailAndPassword', {
    value: async () => ({ user: null }),
    enumerable: true
  });
  
  Object.defineProperty(auth, 'signOut', {
    value: async () => {},
    enumerable: true
  });
  
  Object.defineProperty(auth, 'onAuthStateChanged', {
    value: (callback: NextOrObserver<User>) => {
      if (typeof callback === 'function') {
        callback(null);
      }
      return () => {};
    },
    enumerable: true
  });
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
