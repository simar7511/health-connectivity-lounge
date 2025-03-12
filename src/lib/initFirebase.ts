
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Safely initializes Firebase using environment variables
 * with better error handling to prevent crashes
 */
export const initializeFirebase = () => {
  try {
    // Check for required environment variables
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID'
    ];
    
    // Validate environment variables
    const missingVars = requiredVars.filter(varName => 
      !import.meta.env[varName] || import.meta.env[varName] === ''
    );
    
    if (missingVars.length > 0) {
      console.warn(`Missing required Firebase config: ${missingVars.join(', ')}`);
      return { initialized: false, error: 'Missing Firebase configuration' };
    }
    
    // Firebase configuration from environment variables
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || null,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || null,
      appId: import.meta.env.VITE_FIREBASE_APP_ID || null,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || null
    };
    
    // Initialize Firebase only if we have the minimal required configuration
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);
    
    console.log("Firebase successfully initialized");
    
    return { 
      initialized: true, 
      app, 
      auth, 
      db, 
      storage,
      projectId: firebaseConfig.projectId
    };
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    return { 
      initialized: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

export default initializeFirebase;
