
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
    confirmationResult: any | undefined;
    grecaptcha: any;
  }
}

const firebaseConfig = {
  apiKey: "AIzaSyCx60XPDz1pEfh2y4ZyARYDU86h9AxNFXw",
  authDomain: "health-connectivity-01.firebaseapp.com",
  projectId: "health-connectivity-01",
  storageBucket: "health-connectivity-01.appspot.com",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const setUpRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: (response: any) => {
        console.log("reCAPTCHA solved, proceeding with OTP", response);
      },
      "expired-callback": () => {
        console.log("reCAPTCHA expired, reloading...");
        window.recaptchaVerifier?.render();
      },
    });
    window.recaptchaVerifier.render();
  }
};

export { auth, setUpRecaptcha };
