import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LockIcon, MailIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProviderLoginProps {
  language: "en" | "es";
  onBack: () => void;
}

export const ProviderLogin = ({ language, onBack }: ProviderLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const content = {
    en: {
      title: "Healthcare Provider Login",
      emailLabel: "Email",
      passwordLabel: "Password",
      login: "Login",
      back: "Back",
      twoFactor: "Two-factor authentication will be required",
    },
    es: {
      title: "Acceso para Proveedores de Salud",
      emailLabel: "Correo electrónico",
      passwordLabel: "Contraseña",
      login: "Iniciar sesión",
      back: "Volver",
      twoFactor: "Se requerirá autenticación de dos factores",
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: language === "en" ? "2FA Required" : "2FA Requerido",
      description: language === "en" 
        ? "Please check your email for the verification code" 
        : "Por favor revise su correo para el código de verificación",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 bg-gradient-to-b from-primary/20 to-background">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-primary">
          {content[language].title}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={content[language].emailLabel}
              className="text-lg py-6"
              icon={<MailIcon className="w-5 h-5" />}
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={content[language].passwordLabel}
              className="text-lg py-6"
              icon={<LockIcon className="w-5 h-5" />}
            />
          </div>
          <Button type="submit" className="w-full text-lg py-6">
            {content[language].login}
          </Button>
        </form>
        <p className="text-sm text-center text-muted-foreground">
          {content[language].twoFactor}
        </p>
      </Card>
      <Button variant="ghost" onClick={onBack}>
        {content[language].back}
      </Button>
    </div>
  );
};