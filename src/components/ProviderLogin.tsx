import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Lock, KeyRound } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";

interface ProviderLoginProps {
  language: "en" | "es";
  onBack: () => void;
}

export const ProviderLogin = ({ language, onBack }: ProviderLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const content = {
    en: {
      title: "Provider Login",
      emailLabel: "Enter your email",
      passwordLabel: "Enter your password",
      otpLabel: "Enter verification code",
      login: "Login",
      verify: "Verify",
      back: "Back",
      needHelp: "Need help? Chat with our AI assistant",
    },
    es: {
      title: "Acceso para Proveedores",
      emailLabel: "Ingrese su correo electrónico",
      passwordLabel: "Ingrese su contraseña",
      otpLabel: "Ingrese el código de verificación",
      login: "Ingresar",
      verify: "Verificar",
      back: "Volver",
      needHelp: "¿Necesita ayuda? Chatee con nuestro asistente AI",
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOTP) {
      setShowOTP(true);
      toast({
        title: language === "en" ? "Verification code sent" : "Código de verificación enviado",
        description:
          language === "en"
            ? "Please check your email for the verification code"
            : "Por favor revise su correo electrónico para el código de verificación",
      });
    } else {
      if (otp.length === 6) {
        toast({
          title: language === "en" ? "Login successful" : "Inicio de sesión exitoso",
          description:
            language === "en"
              ? "Welcome back to your provider dashboard"
              : "Bienvenido de nuevo a su panel de proveedor",
        });
        navigate("/provider/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: language === "en" ? "Invalid code" : "Código inválido",
          description:
            language === "en"
              ? "Please enter a valid 6-digit code"
              : "Por favor ingrese un código válido de 6 dígitos",
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 bg-gradient-to-b from-primary/20 to-background">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-primary">
          {content[language].title}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!showOTP ? (
            <>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={content[language].emailLabel}
                  className="pl-10 text-lg py-6"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={content[language].passwordLabel}
                  className="pl-10 text-lg py-6"
                />
              </div>
              <Button type="submit" className="w-full text-lg py-6">
                {content[language].login}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="text-primary" />
                  <span>{content[language].otpLabel}</span>
                </div>
                <InputOTP
                  value={otp}
                  onChange={setOTP}
                  maxLength={6}
                  render={({ slots }) => (
                    <InputOTPGroup className="gap-2">
                      {slots.map((slot, idx) => (
                        <InputOTPSlot key={idx} {...slot} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
              <Button type="submit" className="w-full text-lg py-6">
                {content[language].verify}
              </Button>
            </>
          )}
        </form>
      </Card>
      <Button variant="ghost" onClick={onBack}>
        {content[language].back}
      </Button>
      <Button variant="link" className="text-primary">
        {content[language].needHelp}
      </Button>
    </div>
  );
};