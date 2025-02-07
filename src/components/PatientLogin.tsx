import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { auth } from "@/lib/firebase";
import { signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

interface PatientLoginProps {
  language: "en" | "es";
  onBack: () => void;
  onLogin: () => void;
}

const PatientLogin = ({ language, onBack, onLogin }: PatientLoginProps) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const { toast } = useToast();

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
      console.log(`📩 Sending OTP to: ${formattedPhone}`);
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, null); // ❌ Removed reCAPTCHA
      setConfirmationResult(confirmation);
      toast({ title: "OTP Sent", description: "Check your phone for the verification code." });
    } catch (error: any) {
      console.error("❌ Error sending OTP:", error);
      toast({ title: "Error", description: error.message || "Failed to send OTP. Try again." });
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
