
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
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") || "");
  const [model, setModel] = useState(() => localStorage.getItem("openai_model") || "gpt-3.5-turbo");
  
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

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("openai_api_key", apiKey);
      localStorage.setItem("openai_model", model);
      setShowApiDialog(false);
      toast({
        title: language === "en" ? "Settings Saved" : "Configuración Guardada",
        description: language === "en" 
          ? "Your API settings have been updated."
          : "Tu configuración de API ha sido actualizada.",
      });
      window.location.reload(); // Reload to refresh the component with the new settings
    } else {
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "API key cannot be empty."
          : "La clave API no puede estar vacía.",
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
        />
      </div>

      <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "OpenAI API Settings" : "Configuración API de OpenAI"}
            </DialogTitle>
            <DialogDescription>
              {language === "en" 
                ? "Enter your OpenAI API key and select a model to use for the Health Assistant." 
                : "Ingrese su clave API de OpenAI y seleccione un modelo para usar en el Asistente de Salud."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
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
            
            <p className="text-xs text-muted-foreground mt-2">
              {language === "en" 
                ? "You can get an API key from platform.openai.com. The key is stored locally in your browser."
                : "Puede obtener una clave API en platform.openai.com. La clave se almacena localmente en su navegador."}
            </p>
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
