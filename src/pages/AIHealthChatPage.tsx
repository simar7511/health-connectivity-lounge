import { useState, useEffect } from "react";
import { AIHealthAssistant } from "@/components/dashboard/AIHealthAssistant";
import { useNavigate, useParams } from "react-router-dom";
import { AIHealthChatHeader } from "@/components/dashboard/AIHealthChatHeader";
import { AISettingsDialog } from "@/components/dashboard/AISettingsDialog";
import { useToast } from "@/hooks/use-toast";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { OfflineModeType } from "@/utils/offlineHelpers";
import { aiService } from "@/services/aiService";

export const AIHealthChatPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isOnline = useOnlineStatus();
  const [language, setLanguage] = useState<"en" | "es">(() => {
    return (sessionStorage.getItem("preferredLanguage") as "en" | "es") || "en";
  });
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  
  // Initialize offlineMode with stored preference or default to "simulated"
  const [offlineMode, setOfflineMode] = useState<OfflineModeType>(() => {
    const storedMode = localStorage.getItem("ai_offline_mode") as OfflineModeType;
    return storedMode && (storedMode === "simulated" || storedMode === "localLLM") 
      ? storedMode 
      : "simulated";
  });
  
  // Always default to "openai" provider
  const [provider, setProvider] = useState("openai");
  
  // Default to GPT-4o model for OpenAI
  const [model, setModel] = useState("gpt-4o");
  
  useEffect(() => {
    // Initialize with the OpenAI key
    const openaiKey = "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";
    
    // Set and save the API key
    localStorage.setItem("openai_api_key", openaiKey);
    aiService.setApiKey(openaiKey);
    console.log("OpenAI API key set and validated");
    
    // Update the AI service with current settings
    aiService.setModel(model);
    aiService.setLanguage(language);
    aiService.setOnlineStatus(isOnline);
    aiService.setOfflineMode(offlineMode);
    
    // Log current settings
    console.log(`Settings - Provider: ${provider}, Model: ${model}, Language: ${language}, Online: ${isOnline}, Mode: ${offlineMode}`);
  }, [provider, model, language, offlineMode, isOnline]);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === "en" ? "es" : "en";
      console.log(`Language toggled from ${prev} to ${newLang}`);
      sessionStorage.setItem("preferredLanguage", newLang);
      
      // Update AI service language
      aiService.setLanguage(newLang);
      
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

  // Set offline mode type 
  const setOfflineModeType = (mode: OfflineModeType) => {
    setOfflineMode(mode);
    localStorage.setItem("ai_offline_mode", mode);
    aiService.setOfflineMode(mode);
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
          aiService={aiService}
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
