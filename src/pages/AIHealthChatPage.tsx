
import { useState, useEffect } from "react";
import { AIHealthAssistant } from "@/components/dashboard/AIHealthAssistant";
import { useNavigate, useParams } from "react-router-dom";
import { AIHealthChatHeader } from "@/components/dashboard/AIHealthChatHeader";
import { AISettingsDialog } from "@/components/dashboard/AISettingsDialog";
import { useToast } from "@/hooks/use-toast";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { OfflineModeType } from "@/utils/offlineHelpers";

export const AIHealthChatPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isOnline = useOnlineStatus();
  const [language, setLanguage] = useState<"en" | "es">(() => {
    return (sessionStorage.getItem("preferredLanguage") as "en" | "es") || "en";
  });
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [offlineMode, setOfflineMode] = useState<OfflineModeType>(() => {
    // Default to simulated mode - no external services used
    return "simulated";
  });
  
  // Set fixed values for provider and model since we're not using real APIs
  const [provider, setProvider] = useState("offline");
  const [model, setModel] = useState("simulated-health-model");
  
  useEffect(() => {
    // Log current settings to help with debugging
    console.log(`Current settings - Provider: ${provider}, Model: ${model}, Offline Mode: ${offlineMode}, Online: ${isOnline}, Language: ${language}`);
  }, [provider, model, offlineMode, isOnline, language]);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === "en" ? "es" : "en";
      console.log(`Language toggled from ${prev} to ${newLang}`);
      sessionStorage.setItem("preferredLanguage", newLang);
      
      // Show a toast to confirm language change
      toast({
        title: newLang === "en" ? "Switched to English" : "Cambiado a Español",
        description: newLang === "en" 
          ? "The Health Assistant will now respond in English" 
          : "El Asistente de Salud ahora responderá en Español",
        variant: "default",
      });
      
      return newLang;
    });
  };

  // Set offline mode type - always staying offline
  const setOfflineModeType = (mode: OfflineModeType) => {
    setOfflineMode(mode);
    localStorage.setItem("ai_offline_mode", mode);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <AIHealthChatHeader 
        language={language}
        toggleLanguage={toggleLanguage}
        openSettings={() => setShowSettingsDialog(true)}
        isOnline={isOnline}
      />
      
      <div className="flex-1 overflow-hidden">
        <AIHealthAssistant 
          language={language} 
          onBack={handleBack}
          patientId={patientId}
          model={model}
          provider={provider}
          isOnline={isOnline}
          offlineMode={offlineMode}
        />
      </div>

      <AISettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        language={language}
        provider={provider}
        setProvider={setProvider}
        model={model}
        setModel={setModel}
        offlineMode={offlineMode}
        setOfflineMode={setOfflineModeType}
      />
    </div>
  );
};

export default AIHealthChatPage;
