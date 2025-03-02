
import { useState, useEffect } from "react";
import { AIHealthAssistant } from "@/components/dashboard/AIHealthAssistant";
import { useNavigate, useParams } from "react-router-dom";
import { AIHealthChatHeader } from "@/components/dashboard/AIHealthChatHeader";
import { AISettingsDialog } from "@/components/dashboard/AISettingsDialog";

// Default API keys
const DEFAULT_OPENAI_API_KEY = "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";
const DEFAULT_HUGGINGFACE_TOKEN = "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";

export const AIHealthChatPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"en" | "es">(() => {
    return (sessionStorage.getItem("preferredLanguage") as "en" | "es") || "en";
  });
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [model, setModel] = useState(() => localStorage.getItem("ai_model") || "llama-2-7b");
  const [provider, setProvider] = useState(() => localStorage.getItem("ai_provider") || "llama");
  
  // Initialize API keys in localStorage if they don't exist
  useEffect(() => {
    if (!localStorage.getItem("openai_api_key")) {
      localStorage.setItem("openai_api_key", DEFAULT_OPENAI_API_KEY);
    }
    if (!localStorage.getItem("huggingface_token")) {
      localStorage.setItem("huggingface_token", DEFAULT_HUGGINGFACE_TOKEN);
    }
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "es" : "en");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <AIHealthChatHeader 
        language={language}
        toggleLanguage={toggleLanguage}
        openSettings={() => setShowApiDialog(true)}
      />
      
      <div className="flex-1 overflow-hidden">
        <AIHealthAssistant 
          language={language} 
          onBack={handleBack}
          patientId={patientId}
          model={model}
          provider={provider}
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
