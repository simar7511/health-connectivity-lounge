import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PhoneIcon, UserIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PatientLoginProps {
  language: "en" | "es";
  onBack: () => void;
}

export const PatientLogin = ({ language, onBack }: PatientLoginProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  const content = {
    en: {
      title: "Patient Access",
      phoneLabel: "Enter your phone number",
      continueGuest: "Continue as Guest",
      back: "Back",
      privacy: "Your information is private and will not be shared with authorities.",
      needHelp: "Need help? Chat with our AI assistant",
    },
    es: {
      title: "Acceso para Pacientes",
      phoneLabel: "Ingrese su número de teléfono",
      continueGuest: "Continuar como Invitado",
      back: "Volver",
      privacy: "Su información es privada y no será compartida con las autoridades.",
      needHelp: "¿Necesita ayuda? Chatee con nuestro asistente AI",
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: language === "en" ? "Verification sent" : "Verificación enviada",
      description: language === "en" 
        ? "Please check your phone for the verification code" 
        : "Por favor revise su teléfono para el código de verificación",
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
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={content[language].phoneLabel}
              className="text-lg py-6"
              icon={<PhoneIcon className="w-5 h-5" />}
            />
          </div>
          <Button type="submit" className="w-full text-lg py-6">
            {language === "en" ? "Continue" : "Continuar"}
          </Button>
        </form>
        <Button 
          variant="outline" 
          className="w-full text-lg py-6"
          onClick={() => {
            toast({
              title: language === "en" ? "Welcome" : "Bienvenido",
              description: language === "en" 
                ? "You can now access basic services" 
                : "Ahora puede acceder a servicios básicos",
            });
          }}
        >
          <UserIcon className="mr-2" />
          {content[language].continueGuest}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          {content[language].privacy}
        </p>
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