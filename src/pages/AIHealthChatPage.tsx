
import { useState, useEffect } from "react";
import { AIHealthAssistant } from "@/components/dashboard/AIHealthAssistant";
import { useNavigate, useParams } from "react-router-dom";
import { AIHealthChatHeader } from "@/components/dashboard/AIHealthChatHeader";
import { AISettingsDialog } from "@/components/dashboard/AISettingsDialog";
import { useToast } from "@/hooks/use-toast";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { initOfflineModel, getOfflineModelConfig } from "@/utils/offlineLLM";

export const AIHealthChatPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isOnline = useOnlineStatus();
  const [language, setLanguage] = useState<"en" | "es">(() => {
    return (sessionStorage.getItem("preferredLanguage") as "en" | "es") || "en";
  });
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [offlineMode, setOfflineMode] = useState<"simulated" | "localLLM" | "none">(() => {
    return localStorage.getItem("ai_offline_mode") as "simulated" | "localLLM" | "none" || "simulated";
  });
  
  // Auto-select model based on connectivity
  const [provider, setProvider] = useState(() => {
    return localStorage.getItem("ai_provider") || (isOnline ? "openai" : "llama");
  });
  
  const [model, setModel] = useState(() => {
    const savedProvider = localStorage.getItem("ai_provider");
    if (savedProvider) {
      return localStorage.getItem(`${savedProvider}_model`) || 
        (savedProvider === "openai" ? "gpt-4o" : "llama-2-7b-chat");
    }
    return isOnline ? "gpt-4o" : "llama-2-7b-chat";
  });
  
  // Initialize offline model if needed
  useEffect(() => {
    if (!isOnline && offlineMode === "localLLM") {
      initOfflineModel().then(success => {
        if (success) {
          const config = getOfflineModelConfig();
          toast({
            title: language === "en" ? "Offline LLM Ready" : "LLM sin conexión listo",
            description: language === "en" 
              ? `Using ${config.modelName} for offline responses` 
              : `Usando ${config.modelName} para respuestas sin conexión`,
            variant: "default",
          });
        } else {
          // Fall back to simulated responses if model fails to load
          setOfflineMode("simulated");
          toast({
            title: language === "en" ? "Offline LLM Failed" : "Error en LLM sin conexión",
            description: language === "en" 
              ? "Falling back to simulated responses" 
              : "Volviendo a respuestas simuladas",
            variant: "destructive",
          });
        }
      });
    }
  }, [isOnline, offlineMode, toast, language]);
  
  // Check if API keys are configured
  useEffect(() => {
    const openaiKey = localStorage.getItem("openai_api_key");
    const huggingfaceToken = localStorage.getItem("huggingface_token");
    
    // Show settings dialog if required API key is missing
    if ((provider === "openai" && !openaiKey) || 
        (provider === "llama" && !huggingfaceToken)) {
      setShowApiDialog(true);
      toast({
        title: language === "en" ? "API Key Required" : "Se requiere clave API",
        description: language === "en" 
          ? "Please configure your API key to use the AI assistant."
          : "Por favor, configura tu clave API para usar el asistente de IA.",
        variant: "default",
      });
    }
  }, [provider, language, toast]);

  // Auto-switch between online and offline models
  useEffect(() => {
    const savedProvider = localStorage.getItem("ai_provider");
    
    // Only auto-switch if user hasn't manually set a preference
    if (!savedProvider) {
      const newProvider = isOnline ? "openai" : "llama";
      
      if (provider !== newProvider) {
        setProvider(newProvider);
        
        const openaiKey = localStorage.getItem("openai_api_key");
        const huggingfaceToken = localStorage.getItem("huggingface_token");
        
        // Only show toast for connectivity change if keys are configured
        if ((newProvider === "openai" && openaiKey) || 
            (newProvider === "llama" && huggingfaceToken)) {
          // Show toast notification about connectivity change
          const message = isOnline 
            ? language === "en" 
              ? "You're now online. Switched to GPT-4 model." 
              : "Ahora estás en línea. Cambiado al modelo GPT-4."
            : language === "en" 
              ? "You're offline. Switched to local Llama model." 
              : "Estás desconectado. Cambiado al modelo local Llama.";
          
          toast({
            title: isOnline ? "Connected" : "Offline Mode",
            description: message,
            variant: "default",
          });
        }
      }
      
      // Update model based on provider
      const newModel = isOnline ? "gpt-4o" : "llama-2-7b-chat";
      if (model !== newModel) {
        setModel(newModel);
      }
    }
  }, [isOnline, provider, model, toast, language]);

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
  const setOfflineModeType = (mode: "simulated" | "localLLM" | "none") => {
    setOfflineMode(mode);
    localStorage.setItem("ai_offline_mode", mode);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <AIHealthChatHeader 
        language={language}
        toggleLanguage={toggleLanguage}
        openSettings={() => setShowApiDialog(true)}
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
        open={showApiDialog}
        onOpenChange={setShowApiDialog}
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
