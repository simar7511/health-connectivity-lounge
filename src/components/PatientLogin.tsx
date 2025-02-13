
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { signInWithPhoneNumber } from "firebase/auth";

interface PatientLoginProps {
  language: "en" | "es";
  onBack: () => void;
  onLogin: () => void;
}

const PatientLogin = ({ language, onBack, onLogin }: PatientLoginProps) => {
  const [phone, setPhone] = useState("");
  const { toast } = useToast();

  const formatPhoneNumber = (number: string) => {
    return number.startsWith("+") ? number.trim() : `+1${number.trim()}`;
  };

  const handleLogin = async () => {
    const formattedPhone = formatPhoneNumber(phone);

    if (!/^\+\d{10,15}$/.test(formattedPhone)) {
      toast({ 
        title: language === "en" ? "Invalid Phone Number" : "Número de Teléfono Inválido", 
        description: language === "en" 
          ? "Enter a valid phone number with country code." 
          : "Ingrese un número de teléfono válido con código de país."
      });
      return;
    }

    try {
      // For now, just proceed with login
      // In a real app, you'd want to implement proper authentication here
      toast({ 
        title: language === "en" ? "Login Successful" : "Inicio de Sesión Exitoso"
      });
      onLogin();
    } catch (error: any) {
      console.error("❌ Error during login:", error);
      toast({ 
        title: language === "en" ? "Error" : "Error", 
        description: error.message || (language === "en" 
          ? "Failed to login. Try again." 
          : "Error al iniciar sesión. Intente nuevamente.")
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 bg-gradient-to-b from-primary/20 to-background">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-primary">
          {language === "en" ? "Patient Login" : "Inicio de Sesión del Paciente"}
        </h1>

        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={language === "en" ? "Enter your phone number" : "Ingrese su número de teléfono"}
          className="text-lg py-6"
          required
        />
        
        <Button 
          className="w-full text-lg py-6" 
          onClick={handleLogin}
        >
          {language === "en" ? "Login" : "Iniciar Sesión"}
        </Button>
      </Card>

      <Button variant="ghost" onClick={onBack}>
        {language === "en" ? "Back" : "Volver"}
      </Button>
    </div>
  );
};

export default PatientLogin;
