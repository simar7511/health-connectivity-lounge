
import { Heart } from "lucide-react";

interface ProviderFooterProps {
  language: "en" | "es";
}

export const ProviderFooter = ({ language }: ProviderFooterProps) => {
  return (
    <footer className="bg-primary/5 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600">
            {language === "en" 
              ? "© 2024 Health Connectivity Lounge. All rights reserved." 
              : "© 2024 Health Connectivity Lounge. Todos los derechos reservados."}
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>
              {language === "en" 
                ? "Made with" 
                : "Hecho con"}
            </span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>
              {language === "en" 
                ? "for better healthcare" 
                : "para una mejor atención médica"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
