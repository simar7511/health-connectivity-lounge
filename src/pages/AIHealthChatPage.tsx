
import { useState, useEffect } from "react";
import { AIHealthAssistant } from "@/components/dashboard/AIHealthAssistant";
import { useNavigate, useParams } from "react-router-dom";
import { AIHealthChatHeader } from "@/components/dashboard/AIHealthChatHeader";
import { AISettingsDialog } from "@/components/dashboard/AISettingsDialog";
import { useToast } from "@/hooks/use-toast";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { OfflineModeType } from "@/utils/offlineHelpers";
import { aiService } from "@/services/aiService";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  
  // Track API quota exceeded status
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Track application error state
  const [applicationError, setApplicationError] = useState<string | null>(null);
  
  useEffect(() => {
    // Initialize with the OpenAI key
    const openaiKey = localStorage.getItem("openai_api_key") || "";
    
    try {
      if (!openaiKey) {
        // If no key is found, try to set a default one
        const defaultKey = "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";
        localStorage.setItem("openai_api_key", defaultKey);
        aiService.setApiKey(defaultKey);
      } else {
        // Set existing API key
        aiService.setApiKey(openaiKey);
      }
      
      console.log("OpenAI API key set");
      
      // Update the AI service with current settings
      aiService.setModel(model);
      aiService.setLanguage(language);
      aiService.setOnlineStatus(isOnline);
      aiService.setOfflineMode(offlineMode);
      
      // Check API status
      const apiStatus = aiService.getApiStatus();
      setQuotaExceeded(apiStatus.quotaExceeded);
      
      // Reset application error if any
      setApplicationError(null);
      
      // Log current settings
      console.log(`Settings - Provider: ${provider}, Model: ${model}, Language: ${language}, Online: ${isOnline}, Mode: ${offlineMode}, Quota Exceeded: ${apiStatus.quotaExceeded}`);
    } catch (error: any) {
      console.error("Error initializing AI service:", error);
      setApplicationError(language === "en" 
        ? "An error occurred while initializing the AI assistant. Please try refreshing the page."
        : "Ocurrió un error al inicializar el asistente de IA. Intente actualizar la página.");
    }
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

  // Update API key and check quota status
  const updateApiKey = (newKey: string) => {
    try {
      if (newKey && newKey !== localStorage.getItem("openai_api_key")) {
        localStorage.setItem("openai_api_key", newKey);
        aiService.setApiKey(newKey);
        aiService.resetQuotaStatus();
        
        // Update quota status
        setQuotaExceeded(false);
        
        toast({
          title: language === "en" ? "API Key Updated" : "Clave API Actualizada",
          description: language === "en" 
            ? "Your OpenAI API key has been updated" 
            : "Tu clave API de OpenAI ha sido actualizada",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error("Error updating API key:", error);
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "Failed to update API key. Please try again." 
          : "Error al actualizar la clave API. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Handle application recovery
  const handleRetryApplication = () => {
    window.location.reload();
  };

  if (applicationError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {language === "en" ? "Application Error" : "Error de Aplicación"}
          </AlertTitle>
          <AlertDescription>
            {applicationError}
          </AlertDescription>
        </Alert>
        <button 
          onClick={handleRetryApplication}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          {language === "en" ? "Refresh Application" : "Actualizar Aplicación"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <AIHealthChatHeader 
        language={language}
        toggleLanguage={toggleLanguage}
        openSettings={() => setShowSettingsDialog(true)}
        isOnline={isOnline}
      />
      
      {quotaExceeded && (
        <Alert variant="destructive" className="mx-2 mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {language === "en" ? "API Quota Exceeded" : "Cuota de API Excedida"}
          </AlertTitle>
          <AlertDescription>
            {language === "en" 
              ? "Your OpenAI API quota has been exceeded. The assistant will use offline responses. Please update your API key in settings."
              : "Tu cuota de API de OpenAI ha sido excedida. El asistente usará respuestas sin conexión. Por favor, actualiza tu clave API en configuración."}
          </AlertDescription>
        </Alert>
      )}
      
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
          quotaExceeded={quotaExceeded}
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
        updateApiKey={updateApiKey}
        quotaExceeded={quotaExceeded}
      />
    </div>
  );
};

export default AIHealthChatPage;
