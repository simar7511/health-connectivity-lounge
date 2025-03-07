import { useState, useEffect } from "react";
import { AIHealthAssistant } from "@/components/dashboard/AIHealthAssistant";
import { useNavigate, useParams } from "react-router-dom";
import { AIHealthChatHeader } from "@/components/dashboard/AIHealthChatHeader";
import { AISettingsDialog } from "@/components/dashboard/AISettingsDialog";
import { useToast } from "@/hooks/use-toast";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { OfflineModeType } from "@/utils/offlineHelpers";
import { aiService } from "@/services/aiService";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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
    const storedMode = localStorage.getItem("ai_offline_mode") as OfflineModeType;
    return storedMode && (storedMode === "simulated" || storedMode === "localLLM") 
      ? storedMode 
      : "simulated";
  });
  
  const [provider, setProvider] = useState("openai");
  
  const [model, setModel] = useState("gpt-4o");
  
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const [applicationError, setApplicationError] = useState<string | null>(null);
  
  const [appCrashed, setAppCrashed] = useState(false);
  
  useEffect(() => {
    const currentKey = localStorage.getItem("openai_api_key") || "";
    const newApiKey = "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";
    
    try {
      if (quotaExceeded || !currentKey) {
        console.log("Updating API key due to quota exceeded or missing key");
        localStorage.setItem("openai_api_key", newApiKey);
        aiService.setApiKey(newApiKey);
        aiService.resetQuotaStatus();
        setQuotaExceeded(false);
        
        toast({
          title: language === "en" ? "API Key Updated" : "Clave API Actualizada",
          description: language === "en" 
            ? "Your OpenAI API key has been updated" 
            : "Tu clave API de OpenAI ha sido actualizada",
          variant: "default",
        });
      } else {
        aiService.setApiKey(currentKey);
      }
      
      console.log("OpenAI API key set");
      
      aiService.setModel(model);
      aiService.setLanguage(language);
      aiService.setOnlineStatus(isOnline);
      aiService.setOfflineMode(offlineMode);
      
      const apiStatus = aiService.getApiStatus();
      setQuotaExceeded(apiStatus.quotaExceeded);
      
      setApplicationError(null);
      setAppCrashed(false);
      
      console.log(`Settings - Provider: ${provider}, Model: ${model}, Language: ${language}, Online: ${isOnline}, Mode: ${offlineMode}, Quota Exceeded: ${apiStatus.quotaExceeded}`);
    } catch (error: any) {
      console.error("Error initializing AI service:", error);
      setApplicationError(language === "en" 
        ? "An error occurred while initializing the AI assistant. Please try refreshing the page."
        : "Ocurrió un error al inicializar el asistente de IA. Intente actualizar la página.");
    }
  }, [provider, model, language, offlineMode, isOnline, quotaExceeded, toast]);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Unhandled error caught:", event.error);
      setAppCrashed(true);
      setApplicationError(language === "en"
        ? "The application encountered an error and needs to be restarted. Please refresh the page."
        : "La aplicación encontró un error y necesita reiniciarse. Por favor, actualice la página.");
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, [language]);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === "en" ? "es" : "en";
      console.log(`Language toggled from ${prev} to ${newLang}`);
      sessionStorage.setItem("preferredLanguage", newLang);
      
      aiService.setLanguage(newLang);
      
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

  const setOfflineModeType = (mode: OfflineModeType) => {
    setOfflineMode(mode);
    localStorage.setItem("ai_offline_mode", mode);
    aiService.setOfflineMode(mode);
  };

  const updateApiKey = (newKey: string) => {
    try {
      if (newKey && newKey !== localStorage.getItem("openai_api_key")) {
        localStorage.setItem("openai_api_key", newKey);
        aiService.setApiKey(newKey);
        aiService.resetQuotaStatus();
        
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

  const handleRetryApplication = () => {
    window.location.reload();
  };

  if (applicationError || appCrashed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Alert variant="destructive" className="max-w-md mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {language === "en" ? "Application Error" : "Error de Aplicación"}
          </AlertTitle>
          <AlertDescription>
            {applicationError || (language === "en" 
              ? "The application encountered an unexpected error."
              : "La aplicación encontró un error inesperado.")}
          </AlertDescription>
        </Alert>
        <Button 
          onClick={handleRetryApplication}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <RefreshCw className="h-4 w-4" />
          {language === "en" ? "Refresh Application" : "Actualizar Aplicación"}
        </Button>
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
