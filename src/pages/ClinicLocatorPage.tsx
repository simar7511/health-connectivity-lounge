
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { NavigationHeader } from "@/components/layout/NavigationHeader";
import { ReturnToHomeButton } from "@/components/layout/ReturnToHomeButton";

const ClinicLocatorPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [location, setLocation] = useState("");

  const t = {
    title: language === "en" ? "Find a Free Clinic" : "Encontrar una Clínica Gratuita",
    subtitle: language === "en" 
      ? "Enter your location to find nearby clinics that provide free maternal care." 
      : "Ingrese su ubicación para encontrar clínicas cercanas que brinden atención materna gratuita.",
    placeholder: language === "en" ? "Enter your city or ZIP code" : "Ingrese su ciudad o código postal",
    search: language === "en" ? "Search Clinics" : "Buscar Clínicas",
    back: language === "en" ? "Back to Dashboard" : "Volver al Panel",
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationHeader 
        title={t.title}
        language={language}
      />
      
      <main className="flex-1 container mx-auto p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">🏥 {t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder={t.placeholder} 
                className="w-full p-2 pr-10 border rounded-md" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
          </div>
          
          <Button className="w-full py-3" disabled={!location.trim()}>
            <Search className="mr-2 h-4 w-4" />
            {t.search}
          </Button>
          
          <Button
            variant="outline"
            className="w-full py-3"
            onClick={() => navigate("/patient/dashboard")}
          >
            {t.back}
          </Button>
          
          <div className="mt-8 pt-4 border-t">
            <ReturnToHomeButton language={language} className="w-full" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClinicLocatorPage;
