
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { PhoneAuthProvider, signInWithPhoneNumber } from "@/types/firebase";
import { Loader2 } from "lucide-react";

interface PatientLoginProps {
  language: "en" | "es";
  onBack: () => void;
  onLogin: () => void;
}

const PatientLogin: React.FC<PatientLoginProps> = ({ language, onBack, onLogin }) => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

    // Store language preference in sessionStorage before async operation
    sessionStorage.setItem("preferredLanguage", language);

    setIsLoading(true);
    try {
      // For now, proceed with navigation even if Firebase auth isn't ready
      // This ensures users can still access the form
      toast({ 
        title: language === "en" ? "Proceeding to Intake Form" : "Continuando al Formulario de Ingreso"
      });

      onLogin(); // Call onLogin callback if needed
      navigate("/pediatric-intake");
    } catch (error) {
      console.error("❌ Error during login:", error);
      // Even if there's an error, we'll still redirect to the intake form
      navigate("/pediatric-intake");
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
          required
        />
        
        <Button 
          className="w-full text-lg py-6" 
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {language === "en" ? "Loading..." : "Cargando..."}
            </>
          ) : (
            language === "en" ? "Continue" : "Continuar"
          )}
        </Button>
      </Card>

      <Button variant="ghost" onClick={onBack} disabled={isLoading}>
        {language === "en" ? "Back" : "Volver"}
      </Button>
    </div>
  );
};

export default PatientLogin;
