
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, KeyRound, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface AISettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: "en" | "es";
  provider: string;
  setProvider: (provider: string) => void;
  model: string;
  setModel: (model: string) => void;
  offlineMode?: "simulated" | "localLLM" | "none";
  setOfflineMode?: (mode: "simulated" | "localLLM" | "none") => void;
}

export const AISettingsDialog = ({ 
  open, 
  onOpenChange, 
  language, 
  provider,
  setProvider,
  model,
  setModel,
  offlineMode,
  setOfflineMode
}: AISettingsDialogProps) => {
  const { toast } = useToast();
  const [showResetKeySection, setShowResetKeySection] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    // Try to get API key from localStorage
    return localStorage.getItem(`${provider}_api_key`) || "";
  });
  const [showApiKey, setShowApiKey] = useState(false);

  // Update based on provider with OpenAI as default
  useEffect(() => {
    // Set default model based on provider
    if (provider === "openai" && !localStorage.getItem("openai_model")) {
      setModel("gpt-4o");
    } else if (provider === "llama" && !localStorage.getItem("llama_model")) {
      setModel("llama-2-7b-chat");
    }
    
    // Load model if saved
    const savedModel = localStorage.getItem(`${provider}_model`);
    if (savedModel) {
      setModel(savedModel);
    }
    
    // Load API key for the selected provider
    const savedApiKey = localStorage.getItem(`${provider}_api_key`);
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setApiKey("");
    }
  }, [provider, setModel]);

  useEffect(() => {
    localStorage.setItem("ai_provider", provider);
    localStorage.setItem(`${provider}_model`, model);
    
    // Save offline mode if provided
    if (offlineMode && setOfflineMode) {
      localStorage.setItem("ai_offline_mode", offlineMode);
    }
  }, [provider, model, offlineMode, setOfflineMode]);

  const saveSettings = () => {
    // Save model and provider preferences
    localStorage.setItem(`${provider}_model`, model);
    localStorage.setItem("ai_provider", provider);
    
    // Save API key if provided
    if (apiKey) {
      localStorage.setItem(`${provider}_api_key`, apiKey);
      
      // Show special message for OpenAI
      if (provider === "openai" && apiKey.startsWith("sk-")) {
        toast({
          title: language === "en" ? "OpenAI API Key Saved" : "Clave API de OpenAI Guardada",
          description: language === "en" 
            ? "Your OpenAI API key has been saved. The health assistant will now use OpenAI for better responses."
            : "Tu clave API de OpenAI ha sido guardada. El asistente de salud ahora usará OpenAI para mejores respuestas.",
        });
      }
    }
    
    // Close dialog and notify user
    onOpenChange(false);
    toast({
      title: language === "en" ? "Settings Saved" : "Configuración Guardada",
      description: language === "en" 
        ? "Your AI settings have been updated successfully."
        : "Tu configuración de IA ha sido actualizada con éxito.",
    });
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const clearApiKey = () => {
    setApiKey("");
    localStorage.removeItem(`${provider}_api_key`);
    toast({
      title: language === "en" ? "API Key Cleared" : "Clave API Borrada",
      description: language === "en" 
        ? "Your API key has been removed. Using simulated responses now."
        : "Tu clave API ha sido eliminada. Usando respuestas simuladas ahora.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {language === "en" ? "AI Settings" : "Configuración de IA"}
          </DialogTitle>
          <DialogDescription>
            {language === "en" 
              ? "Select an AI provider and configure model settings." 
              : "Seleccione un proveedor de IA y configure los ajustes del modelo."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="provider" className="text-sm font-medium">
              {language === "en" ? "AI Provider" : "Proveedor de IA"}
            </label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger>
                <SelectValue placeholder={language === "en" ? "Select provider" : "Seleccionar proveedor"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                <SelectItem value="offline">Simulated Responses</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {provider === "openai" && (
            <>
              <div className="space-y-2">
                <label htmlFor="model" className="text-sm font-medium">
                  {language === "en" ? "Model" : "Modelo"}
                </label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "en" ? "Select model" : "Seleccionar modelo"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster, less quota)</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini (Balanced)</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o (Advanced, more quota)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="apiKey" className="text-sm font-medium">
                  {language === "en" ? "OpenAI API Key" : "Clave API de OpenAI"}
                </label>
                <div className="flex">
                  <div className="relative flex-1">
                    <Input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={language === "en" ? "Enter your OpenAI API key" : "Ingresa tu clave API de OpenAI"}
                      className="pr-10"
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={toggleShowApiKey}
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {apiKey && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearApiKey}
                      className="ml-2"
                    >
                      {language === "en" ? "Clear" : "Borrar"}
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "en" 
                    ? "Your API key is stored locally and not shared with our servers." 
                    : "Tu clave API se almacena localmente y no se comparte con nuestros servidores."}
                </p>
              </div>
              
              <Alert className="bg-amber-50 border-amber-200">
                <KeyRound className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-sm">
                  {language === "en" 
                    ? "You will need an OpenAI API key to use the enhanced AI features. You can get one from openai.com"
                    : "Necesitarás una clave API de OpenAI para usar las funciones mejoradas de IA. Puedes obtener una en openai.com"}
                </AlertDescription>
              </Alert>
            </>
          )}
          
          {offlineMode !== undefined && setOfflineMode && (
            <div className="space-y-2 mt-4">
              <label htmlFor="offlineMode" className="text-sm font-medium">
                {language === "en" ? "Offline Mode" : "Modo Sin Conexión"}
              </label>
              <Select 
                value={offlineMode} 
                onValueChange={(value) => setOfflineMode(value as "simulated" | "localLLM" | "none")}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === "en" ? "Select offline mode" : "Seleccionar modo sin conexión"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{language === "en" ? "No Offline Mode" : "Sin Modo Sin Conexión"}</SelectItem>
                  <SelectItem value="simulated">{language === "en" ? "Simulated Responses" : "Respuestas Simuladas"}</SelectItem>
                  <SelectItem value="localLLM">{language === "en" ? "Local LLM (Browser)" : "LLM Local (Navegador)"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            {language === "en" ? "Cancel" : "Cancelar"}
          </Button>
          <Button onClick={saveSettings}>
            {language === "en" ? "Save" : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
