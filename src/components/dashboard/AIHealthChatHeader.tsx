
import { Button } from "@/components/ui/button";
import { Globe, Settings, ArrowLeft, Wifi, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AIHealthChatHeaderProps {
  language: "en" | "es";
  toggleLanguage: () => void;
  openSettings: () => void;
  isOnline?: boolean;
}

export const AIHealthChatHeader = ({ 
  language, 
  toggleLanguage, 
  openSettings,
  isOnline = true 
}: AIHealthChatHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">
          {language === "en" ? "AI Health Assistant" : "Asistente de Salud IA"}
        </h1>
        {isOnline ? (
          <Wifi className="h-4 w-4 text-green-500 ml-2" />
        ) : (
          <WifiOff className="h-4 w-4 text-amber-500 ml-2" />
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleLanguage}>
          <Globe className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={openSettings}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
