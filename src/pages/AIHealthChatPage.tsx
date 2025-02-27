
import { useState, useEffect } from "react";
import { AIHealthAssistant } from "@/components/dashboard/AIHealthAssistant";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { GlobeIcon, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AIHealthChatPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [language, setLanguage] = useState<"en" | "es">(() => {
    return (sessionStorage.getItem("preferredLanguage") as "en" | "es") || "en";
  });
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("ai_api_key") || "");
  const [model, setModel] = useState(() => localStorage.getItem("ai_model") || "llama-2-7b");
  const [provider, setProvider] = useState(() => localStorage.getItem("ai_provider") || "llama");
  
  useEffect(() => {
    // Update session storage when language changes
    sessionStorage.setItem("preferredLanguage", language);
  }, [language]);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "es" : "en");
  };

  // Update API key based on provider
  useEffect(() => {
    const key = localStorage.getItem(`${provider}_api_key`) || "";
    setApiKey(key);
    
    // Set default model based on provider
    if (provider === "openai" && !localStorage.getItem("openai_model")) {
      setModel("gpt-3.5-turbo");
    } else if (provider === "llama" && !localStorage.getItem("llama_model")) {
      setModel("llama-2-7b");
    }
    
    // Load model if saved
    const savedModel = localStorage.getItem(`${provider}_model`);
    if (savedModel) {
      setModel(savedModel);
    }
  }, [provider]);

  const saveApiKey = () => {
    if ((provider === "openai" && apiKey.trim()) || provider === "llama") {
      localStorage.setItem(`${provider}_api_key`, apiKey);
      localStorage.setItem(`${provider}_model`, model);
      localStorage.setItem("ai_provider", provider);
      setShowApiDialog(false);
      toast({
        title: language === "en" ? "Settings Saved" : "Configuración Guardada",
        description: language === "en" 
          ? "Your API settings have been updated."
          : "Tu configuración de API ha sido actualizada.",
      });
      window.location.reload(); // Reload to refresh the component with the new settings
    } else if (provider === "openai" && !apiKey.trim()) {
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "API key cannot be empty for OpenAI."
          : "La clave API no puede estar vacía para OpenAI.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="p-2 flex justify-end space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleLanguage}
          className="flex items-center gap-1"
        >
          <GlobeIcon className="h-4 w-4" />
          {language === "en" ? "Español" : "English"}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowApiDialog(true)}
          className="flex items-center gap-1"
        >
          <Settings className="h-4 w-4 mr-1" />
          {language === "en" ? "API Settings" : "Configuración API"}
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <AIHealthAssistant 
          language={language} 
          onBack={handleBack}
          patientId={patientId}
          model={model}
          provider={provider}
        />
      </div>

      <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "AI API Settings" : "Configuración API de IA"}
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
                  <SelectItem value="llama">Llama 2 (Free)</SelectItem>
                  <SelectItem value="openai">OpenAI (Requires API Key)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {provider === "openai" && (
              <div className="space-y-2">
                <label htmlFor="apiKey" className="text-sm font-medium">
                  {language === "en" ? "OpenAI API Key" : "Clave API de OpenAI"}
                </label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            )}
            
            {provider === "openai" && (
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
            )}
            
            {provider === "llama" && (
              <div className="space-y-2">
                <label htmlFor="model" className="text-sm font-medium">
                  {language === "en" ? "Model" : "Modelo"}
                </label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === "en" ? "Select model" : "Seleccionar modelo"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llama-2-7b">Llama 2 (7B parameters)</SelectItem>
                    <SelectItem value="llama-2-13b">Llama 2 (13B parameters)</SelectItem>
                    <SelectItem value="llama-2-7b-chat">Llama 2 Chat (7B parameters)</SelectItem>
                    <SelectItem value="llama-2-13b-chat">Llama 2 Chat (13B parameters)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {provider === "llama" && (
              <Alert className="bg-primary/10 border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <AlertDescription>
                  {language === "en" 
                    ? "Llama 2 models are provided via a free API. No API key is required to use them." 
                    : "Los modelos Llama 2 se proporcionan a través de una API gratuita. No se requiere clave API para usarlos."}
                </AlertDescription>
              </Alert>
            )}
            
            {provider === "openai" && (
              <p className="text-xs text-muted-foreground mt-2">
                {language === "en" 
                  ? "You can get an API key from platform.openai.com. The key is stored locally in your browser."
                  : "Puede obtener una clave API en platform.openai.com. La clave se almacena localmente en su navegador."}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowApiDialog(false)}
            >
              {language === "en" ? "Cancel" : "Cancelar"}
            </Button>
            <Button onClick={saveApiKey}>
              {language === "en" ? "Save" : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIHealthChatPage;
