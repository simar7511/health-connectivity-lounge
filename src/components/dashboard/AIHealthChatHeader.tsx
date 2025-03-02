
import { Button } from "@/components/ui/button";
import { GlobeIcon, Settings } from "lucide-react";

interface AIHealthChatHeaderProps {
  language: "en" | "es";
  toggleLanguage: () => void;
  openSettings: () => void;
}

export const AIHealthChatHeader = ({ 
  language, 
  toggleLanguage, 
  openSettings 
}: AIHealthChatHeaderProps) => {
  return (
    <div className="p-2 flex justify-end space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleLanguage}
        className="flex items-center gap-1"
      >
        <GlobeIcon className="h-4 w-4" />
        {language === "en" ? "Español" : "English"}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={openSettings}
        className="flex items-center gap-1"
      >
        <Settings className="h-4 w-4 mr-1" />
        {language === "en" ? "API Settings" : "Configuración API"}
      </Button>
    </div>
  );
};
