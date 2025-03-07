
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
    // Get from localStorage or default based on online status
    const savedMode = localStorage.getItem("ai_offline_mode") as OfflineModeType | null;
    // Default to "none" if online and no setting, otherwise "simulated"
    return savedMode || (isOnline ? "none" : "simulated");
  });
  
  // Auto-select model based on connectivity
  const [provider, setProvider] = useState(() => {
    // Use saved provider or default to OpenAI if not set
    return localStorage.getItem("ai_provider") || "openai";
  });
  
  const [model, setModel] = useState(() => {
    const savedProvider = localStorage.getItem("ai_provider");
    if (savedProvider) {
      return localStorage.getItem(`${savedProvider}_model`) || 
        (savedProvider === "openai" ? "gpt-4o" : "llama-2-7b-chat");
    }
    // Default to GPT-4o
    return "gpt-4o";
  });
  
  useEffect(() => {
    // Log current settings to help with debugging
    console.log(`Current settings - Provider: ${provider}, Model: ${model}, Offline Mode: ${offlineMode}, Online: ${isOnline}`);
  }, [provider, model, offlineMode, isOnline]);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === "en" ? "es" : "en";
      sessionStorage.setItem("preferredLanguage", newLang);
      return newLang;
    });
  };

  // Handle saving provider/model preferences
  useEffect(() => {
    localStorage.setItem("ai_provider", provider);
    localStorage.setItem(`${provider}_model`, model);
    localStorage.setItem("ai_offline_mode", offlineMode);
  }, [provider, model, offlineMode]);

  // Handle offline mode setting
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
