
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
    // If we're offline, always default to local provider
    if (!isOnline) return "llama";
    
    return localStorage.getItem("ai_provider") || "openai";
  });
  
  const [model, setModel] = useState(() => {
    // If we're offline, always default to local model
    if (!isOnline) return "llama-2-7b-chat";
    
    const savedProvider = localStorage.getItem("ai_provider");
    if (savedProvider) {
      return localStorage.getItem(`${savedProvider}_model`) || 
        (savedProvider === "openai" ? "gpt-4o" : "llama-2-7b-chat");
    }
    return "gpt-4o";
  });
  
  // Initialize offline model if needed
  useEffect(() => {
    // If we're offline or the user has selected localLLM mode, initialize the model
    if ((!isOnline || offlineMode === "localLLM") && !isUsingLocalModelAlready) {
      console.log("Initializing offline model");
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

  // Track if we've tried to load the model
  const [isUsingLocalModelAlready, setIsUsingLocalModelAlready] = useState(false);
  
  // When offline mode changes to localLLM, attempt to load the model
  useEffect(() => {
    if (offlineMode === "localLLM" && !isUsingLocalModelAlready) {
      setIsUsingLocalModelAlready(true);
      initOfflineModel().catch(console.error);
    }
  }, [offlineMode, isUsingLocalModelAlready]);
  
  // Check if API keys are configured
  useEffect(() => {
    const openaiKey = localStorage.getItem("openai_api_key");
    const huggingfaceToken = localStorage.getItem("huggingface_token");
    
    // If we're offline, don't show the API key dialog
    if (!isOnline) return;
    
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
  }, [provider, language, toast, isOnline]);

  // Auto-switch between online and offline models
  useEffect(() => {
    // Update provider and model based on connectivity status
    if (!isOnline) {
      // Always switch to offline mode when offline
      if (provider !== "llama") {
        setProvider("llama");
        toast({
          title: language === "en" ? "Offline Mode" : "Modo Sin Conexión",
          description: language === "en" 
            ? "You're offline. Switched to offline mode."
            : "Estás desconectado. Cambiado a modo sin conexión.",
          variant: "default",
        });
      }
      
      // Make sure we have an appropriate offline mode set
      if (offlineMode === "none") {
        setOfflineMode("simulated");
      }
    } else {
      // When back online, inform the user
      if (provider === "llama" && !localStorage.getItem("ai_provider")) {
        toast({
          title: language === "en" ? "Connected" : "Conectado",
          description: language === "en" 
            ? "You're now online. You can switch to online AI providers in settings."
            : "Ahora estás en línea. Puedes cambiar a proveedores de IA en línea en ajustes.",
          variant: "default",
        });
      }
    }
  }, [isOnline, provider, language, toast, offlineMode]);

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
    
    // If changing to localLLM, initialize the model
    if (mode === "localLLM" && !isUsingLocalModelAlready) {
      setIsUsingLocalModelAlready(true);
      initOfflineModel().catch(console.error);
    }
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
