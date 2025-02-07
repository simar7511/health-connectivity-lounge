
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc 
} from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCx60XPDz1pEfh2y4ZyARYDU86h9AxNFXw",
  authDomain: "health-connectivity-01.firebaseapp.com",
  projectId: "health-connectivity-01",
  storageBucket: "health-connectivity-01.appspot.com",
  messagingSenderId: "429069343294",
  appId: "1:429069343294:web:943a1998a83e63353c0f6f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

auth.useDeviceLanguage(); // Ensures Firebase auth respects user language settings

// Setup reCAPTCHA verification
const setUpRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: (response: any) => {
        console.log("✅ reCAPTCHA solved, proceeding with OTP", response);
      },
      "expired-callback": () => {
        console.warn("⚠️ reCAPTCHA expired, reloading...");
        window.recaptchaVerifier?.clear();
        setUpRecaptcha(); // Reinitialize if expired
      },
    });

    // Ensure reCAPTCHA is fully rendered
    window.recaptchaVerifier.render().catch((error) => {
      console.error("❌ Error rendering reCAPTCHA:", error);
    });
  }
};

export { auth, setUpRecaptcha };
