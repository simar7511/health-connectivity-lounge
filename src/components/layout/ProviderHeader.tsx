
import { Button } from "@/components/ui/button";
import { Globe, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProviderHeaderProps {
  language: "en" | "es";
  onLanguageChange: () => void;
}

export const ProviderHeader = ({ language, onLanguageChange }: ProviderHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="/placeholder.svg"
              alt="Health Connectivity Lounge"
              className="h-10 w-auto"
            />
            <h1 className="text-xl font-semibold hidden md:block">
              {language === "en" ? "Provider Portal" : "Portal del Proveedor"}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              className="text-primary-foreground hover:text-primary-foreground/80"
              onClick={onLanguageChange}
            >
              <Globe className="h-5 w-5 mr-2" />
              {language === "en" ? "Español" : "English"}
            </Button>
            
            <Button
              variant="ghost"
              className="text-primary-foreground hover:text-primary-foreground/80"
              onClick={() => navigate("/provider/login")}
            >
              <LogOut className="h-5 w-5 mr-2" />
              {language === "en" ? "Sign Out" : "Cerrar Sesión"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
