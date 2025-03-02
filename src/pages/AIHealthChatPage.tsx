
import { useState, useEffect } from "react";
import { AIHealthAssistant } from "@/components/dashboard/AIHealthAssistant";
import { useNavigate, useParams } from "react-router-dom";
import { AIHealthChatHeader } from "@/components/dashboard/AIHealthChatHeader";
import { AISettingsDialog } from "@/components/dashboard/AISettingsDialog";
import { useToast } from "@/hooks/use-toast";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

// Default API keys
const DEFAULT_OPENAI_API_KEY = "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";
const DEFAULT_HUGGINGFACE_TOKEN = "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";

export const AIHealthChatPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isOnline = useOnlineStatus();
  const [language, setLanguage] = useState<"en" | "es">(() => {
    return (sessionStorage.getItem("preferredLanguage") as "en" | "es") || "en";
  });
  const [showApiDialog, setShowApiDialog] = useState(false);
  
  // Auto-select model based on connectivity
  const [provider, setProvider] = useState(() => {
    return isOnline ? "openai" : "llama";
  });
  
  const [model, setModel] = useState(() => {
    return isOnline ? "gpt-4o" : "llama-2-7b-chat";
  });
  
  // Initialize API keys in localStorage if they don't exist
  useEffect(() => {
    if (!localStorage.getItem("openai_api_key")) {
      localStorage.setItem("openai_api_key", DEFAULT_OPENAI_API_KEY);
    }
    if (!localStorage.getItem("huggingface_token")) {
      localStorage.setItem("huggingface_token", DEFAULT_HUGGINGFACE_TOKEN);
    }
  }, []);

  // Auto-switch between online and offline models
  useEffect(() => {
    const newProvider = isOnline ? "openai" : "llama";
    const newModel = isOnline ? "gpt-4o" : "llama-2-7b-chat";
    
    if (provider !== newProvider) {
      setProvider(newProvider);
      localStorage.setItem("ai_provider", newProvider);
      
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
        variant: isOnline ? "default" : "secondary",
      });
    }
    
    if (model !== newModel) {
      setModel(newModel);
      localStorage.setItem("ai_model", newModel);
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
      />
    </div>
  );
};

export default AIHealthChatPage;
