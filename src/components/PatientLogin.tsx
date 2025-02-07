import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { auth, setUpRecaptcha } from "@/lib/firebase";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

// Add type declaration for global grecaptcha
declare global {
  interface Window {
    grecaptcha: any;
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

// ✅ Define Props for Language Support
interface PatientLoginProps {
  language: "en" | "es";
  onBack: () => void;
  onLogin: () => void;
}

const PatientLogin = ({ language, onBack, onLogin }: PatientLoginProps) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      setUpRecaptcha();
    }
  }, []);

  const formatPhoneNumber = (number: string) => {
    return number.startsWith("+") ? number.trim() : `+1${number.trim()}`;
  };

  const sendOTP = async () => {
    const formattedPhone = formatPhoneNumber(phone);

    if (!/^\+\d{10,15}$/.test(formattedPhone)) {
      toast({ title: "Invalid Phone Number", description: "Enter a valid phone number with country code." });
      return;
    }

    try {
      if (!window.recaptchaVerifier) {
        toast({ title: "Error", description: "reCAPTCHA not initialized. Refresh and try again." });
        setUpRecaptcha(); // Reinitialize reCAPTCHA
        return;
      }

      // Ensure reCAPTCHA is fully loaded before sending OTP
      await new Promise((resolve) => {
        if (window.grecaptcha) {
          resolve(true);
        } else {
          setTimeout(resolve, 2000);
        }
      });

      console.log(`📩 Sending OTP to: ${formattedPhone}`);
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier!);

      setConfirmationResult(confirmation);
      window.confirmationResult = confirmation;

      toast({ title: "OTP Sent", description: "Check your phone for the verification code." });
    } catch (error: any) {
      console.error("❌ Error sending OTP:", error);
      toast({ title: "Error", description: error.message || "Failed to send OTP. Try again." });

      // Reset reCAPTCHA in case of failure
      if (window.grecaptcha && typeof window.grecaptcha.reset === "function") {
        window.grecaptcha.reset();
      }
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({ title: "Invalid OTP", description: "Enter a valid 6-digit OTP." });
      return;
    }

    try {
      if (!confirmationResult) {
        toast({ title: "Error", description: "No OTP request found. Please try again." });
        return;
      }

      console.log("🔑 Verifying OTP...");
      await confirmationResult.confirm(otp);
      toast({ title: "Login Successful" });
      onLogin();
    } catch (error: any) {
      console.error("❌ Error verifying OTP:", error);
      toast({ title: "Error", description: "Invalid OTP. Try again." });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 bg-gradient-to-b from-primary/20 to-background">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-primary">
          {language === "en" ? "Patient Login" : "Inicio de Sesión del Paciente"}
        </h1>

        <div id="recaptcha-container"></div>

        {!confirmationResult ? (
          <>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={language === "en" ? "Enter your phone number" : "Ingrese su número de teléfono"}
              className="text-lg py-6"
              required
            />
            <Button className="w-full text-lg py-6" onClick={sendOTP}>
              {language === "en" ? "Send OTP" : "Enviar OTP"}
            </Button>
          </>
        ) : (
          <>
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder={language === "en" ? "Enter OTP" : "Ingrese el código OTP"}
              className="text-lg py-6"
              required
            />
            <Button className="w-full text-lg py-6" onClick={verifyOTP}>
              {language === "en" ? "Verify OTP" : "Verificar OTP"}
            </Button>
          </>
        )}
      </Card>

      <Button variant="ghost" onClick={onBack}>
        {language === "en" ? "Back" : "Volver"}
      </Button>
    </div>
  );
};

export default PatientLogin;
