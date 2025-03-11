
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProviderLoginProps {
  language: "en" | "es";
  onBack?: () => void;
  onLogin: () => void;
}

const ProviderLogin = ({ language, onBack, onLogin }: ProviderLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const generatedOtp = "123456";
  const { toast } = useToast();
  const navigate = useNavigate();
  const { loginProvider, loading, isProvider } = useAuth();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, set OTP flow for test accounts
    if (email === "provider@test.com" || email.endsWith("@provider.com")) {
      toast({ title: "A 6-digit verification code has been sent to your email." });
      setIsOtpSent(true);
    } else {
      // Real authentication flow
      try {
        await loginProvider(email, password);
        
        // If login was successful and user is a provider, navigate
        if (isProvider) {
          onLogin();
          navigate("/provider/dashboard");
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      // This is for the demo OTP flow
      try {
        // Use test password for OTP demo
        await loginProvider(email, "test-password-123");
        
        toast({ title: "Login successful! Redirecting..." });
        onLogin();
        navigate("/provider/dashboard");
      } catch (error) {
        console.error("OTP login error:", error);
        toast({ 
          title: "Login failed after OTP verification", 
          variant: "destructive" 
        });
      }
    } else {
      toast({ title: "Invalid OTP. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 bg-gradient-to-b from-primary/20 to-background">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-primary">
          {language === "en" ? "Provider Login" : "Acceso para Proveedores"}
        </h1>

        {!isOtpSent ? (
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

            <Button type="submit" className="w-full text-lg py-6" disabled={loading}>
              {loading ? 
                (language === "en" ? "Logging in..." : "Iniciando sesión...") : 
                (language === "en" ? "Login" : "Ingresar")
              }
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                type="password"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder={language === "en" ? "Enter your verification code" : "Ingrese su código de verificación"}
                className="pl-10 text-lg py-6 tracking-widest"
                maxLength={6}
                required
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>

            <Button type="submit" className="w-full text-lg py-6" disabled={loading}>
              {loading ? 
                (language === "en" ? "Verifying..." : "Verificando...") : 
                (language === "en" ? "Verify Code" : "Verificar Código")
              }
            </Button>
          </form>
        )}
      </Card>

      {!isOtpSent && onBack && (
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

export default ProviderLogin;
