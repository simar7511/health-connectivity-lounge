
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  RecaptchaVerifier,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  MultiFactorResolver
} from "firebase/auth";

interface ProviderLoginProps {
  language: "en" | "es";
  onBack?: () => void;
  onLogin: () => void;
}

const ProviderLogin = ({ language, onBack, onLogin }: ProviderLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [is2FARequired, setIs2FARequired] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize reCAPTCHA verifier
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': () => {
        // reCAPTCHA solved
      }
    });
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Send verification code to phone
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const verId = await phoneAuthProvider.verifyPhoneNumber(
        phoneNumber,
        window.recaptchaVerifier
      );
      
      setVerificationId(verId);
      setIs2FARequired(true);
      
      toast({ 
        title: language === "en" 
          ? "Verification code sent" 
          : "Código de verificación enviado",
        description: language === "en"
          ? "Please check your phone for the verification code"
          : "Por favor revise su teléfono para el código de verificación"
      });
    } catch (error: any) {
      toast({ 
        variant: "destructive",
        title: language === "en" ? "Login Failed" : "Error de inicio de sesión",
        description: error.message
      });
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      
      // Complete sign-in
      await auth.currentUser?.multiFactor.enroll(multiFactorAssertion, "Phone 2FA");
      
      toast({ 
        title: language === "en" ? "Login Successful" : "Inicio de sesión exitoso" 
      });
      
      onLogin();
      navigate("/provider/dashboard");
    } catch (error: any) {
      toast({ 
        variant: "destructive",
        title: language === "en" ? "Verification Failed" : "Error de verificación",
        description: error.message
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 bg-gradient-to-b from-primary/20 to-background">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-primary">
          {language === "en" ? "Provider Login" : "Acceso para Proveedores"}
        </h1>

        {!is2FARequired ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === "en" ? "Enter your email" : "Ingrese su correo electrónico"}
                className="pl-10 text-lg py-6"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === "en" ? "Enter your password" : "Ingrese su contraseña"}
                className="pl-10 text-lg py-6"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={language === "en" ? "Enter your phone number" : "Ingrese su número de teléfono"}
                className="pl-10 text-lg py-6"
                required
              />
            </div>

            <div id="recaptcha-container"></div>

            <Button type="submit" className="w-full text-lg py-6">
              {language === "en" ? "Login" : "Ingresar"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder={language === "en" ? "Enter 2FA code" : "Ingrese el código 2FA"}
                className="pl-10 text-lg py-6"
                required
              />
            </div>

            <Button type="submit" className="w-full text-lg py-6">
              {language === "en" ? "Verify 2FA Code" : "Verificar código 2FA"}
            </Button>
          </form>
        )}
      </Card>

      {!is2FARequired && onBack && (
        <Button variant="ghost" onClick={onBack}>
          {language === "en" ? "Back" : "Volver"}
        </Button>
      )}

      <Button variant="link" className="text-primary">
        {language === "en" ? "Need help? Chat with our AI assistant" : "¿Necesita ayuda? Chatee con nuestro asistente AI"}
      </Button>
    </div>
  );
};

// Add RecaptchaVerifier to the window object type
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export default ProviderLogin;
