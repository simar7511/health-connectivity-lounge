
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, Phone, ArrowLeft } from "lucide-react";

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
    // Store patient phone in localStorage for future reference
    localStorage.setItem("patientPhone", formattedPhone);

    setIsLoading(true);
    try {
      console.log("Patient login successful, navigating to intake form");
      toast({ 
        title: language === "en" ? "Proceeding to Intake Form" : "Continuando al Formulario de Ingreso"
      });

      // Call onLogin callback if needed
      onLogin();
      
      // Use React Router navigation with replace to prevent back navigation issues
      navigate("/pediatric-intake", { replace: true });
    } catch (error) {
      console.error("❌ Error during login:", error);
      // Even if there's an error, we'll still redirect to the intake form
      navigate("/pediatric-intake", { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 bg-gradient-to-br from-primary/10 via-purple-50 to-white">
      <Card className="w-full max-w-md p-8 space-y-8 bg-white/90 backdrop-blur shadow-xl rounded-2xl border-t border-l border-white/50 border-r-0 border-b-0">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-gradient-to-r from-primary/10 to-purple-100">
            <Phone className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary">
            {language === "en" ? "Patient Login" : "Inicio de Sesión del Paciente"}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === "en" ? "Enter your phone number to continue" : "Ingrese su número de teléfono para continuar"}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
              {language === "en" ? "Phone Number" : "Número de Teléfono"}
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={language === "en" ? "Enter your phone number" : "Ingrese su número de teléfono"}
              className="text-lg py-6 border-gray-200 focus:border-primary focus:ring-primary rounded-lg transition-all"
              disabled={isLoading}
              required
            />
          </div>
          
          <Button 
            className="w-full text-lg py-6 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {language === "en" ? "Loading..." : "Cargando..."}
              </>
            ) : (
              language === "en" ? "Continue" : "Continuar"
            )}
          </Button>
        </div>
      </Card>

      <Button 
        variant="ghost" 
        onClick={onBack} 
        disabled={isLoading}
        className="flex items-center gap-2 hover:bg-white/50 transition-all rounded-xl px-5 py-2"
      >
        <ArrowLeft className="w-4 h-4" />
        {language === "en" ? "Back" : "Volver"}
      </Button>
    </div>
  );
};

export default PatientLogin;
