
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Simple and reliable Firebase initialization
 */
export const initializeFirebase = () => {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || null,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || null,
      appId: import.meta.env.VITE_FIREBASE_APP_ID || null,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || null
    };
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);
    
    console.log("Firebase initialized");
    
    return { 
      initialized: true, 
      app, 
      auth, 
      db, 
      storage
    };
  } catch (error) {
    console.error("Firebase initialization error:", error);
    return { 
      initialized: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

export default initializeFirebase;
