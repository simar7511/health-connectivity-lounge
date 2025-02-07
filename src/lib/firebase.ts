import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier | null;
    confirmationResult?: any;
  }
}

// ✅ Firebase Configuration (Update with correct values from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCx60XPDz1pEfh2y4ZyARYDU86h9AxNFXw",
  authDomain: "health-connectivity-01.firebaseapp.com",
  projectId: "health-connectivity-01",
  storageBucket: "health-connectivity-01.appspot.com",
  messagingSenderId: "429069343294", // ✅ Update with actual sender ID
  appId: "1:429069343294:web:943a1998a83e63353c0f6f", // ✅ Update with actual app ID
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Setup reCAPTCHA only once
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

    // ✅ Ensure reCAPTCHA is fully rendered
    window.recaptchaVerifier.render().catch((error) => {
      console.error("❌ Error rendering reCAPTCHA:", error);
    });
  }
};

// ✅ Export Firebase Authentication and reCAPTCHA setup
export { auth, setUpRecaptcha };
