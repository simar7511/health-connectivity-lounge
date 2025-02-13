
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  currentLanguage: "en" | "es";
  onLanguageChange: (lang: "en" | "es") => void;
}

export const LanguageSwitcher = ({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) => {
  return (
    <div className="flex justify-end space-x-2 mb-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onLanguageChange("en")}
        className={currentLanguage === "en" ? "bg-primary/10" : ""}
      >
        <Globe className="w-4 h-4 mr-2" />
        English
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onLanguageChange("es")}
        className={currentLanguage === "es" ? "bg-primary/10" : ""}
      >
        <Globe className="w-4 h-4 mr-2" />
        Español
      </Button>
    </div>
  );
};
