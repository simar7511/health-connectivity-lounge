
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
  const [model, setModel] = useState(() => localStorage.getItem("openai_model") || "gpt-4o-mini");
  const [aiProvider, setAiProvider] = useState(() => localStorage.getItem("ai_provider") || "openai");

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
      localStorage.setItem(`${aiProvider}_api_key`, apiKey);
      if (aiProvider === "openai") {
        localStorage.setItem("openai_model", model);
      }
      localStorage.setItem("ai_provider", aiProvider);
      setShowApiDialog(false);
      toast({
        title: language === "en" ? "Settings Saved" : "Configuración Guardada",
        description: language === "en" 
          ? "Your AI API settings have been updated."
          : "Tu configuración de API de IA ha sido actualizada.",
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

  useEffect(() => {
    // Update API key when provider changes
    const savedKey = localStorage.getItem(`${aiProvider}_api_key`) || "";
    setApiKey(savedKey);
  }, [aiProvider]);

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
          aiProvider={aiProvider}
          model={model}
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
                ? "Enter your API key and select an AI provider to use for the Health Assistant." 
                : "Ingrese su clave API y seleccione un proveedor de IA para usar en el Asistente de Salud."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="aiProvider" className="text-sm font-medium">
                {language === "en" ? "AI Provider" : "Proveedor de IA"}
              </label>
              <Select value={aiProvider} onValueChange={setAiProvider}>
                <SelectTrigger>
                  <SelectValue placeholder={language === "en" ? "Select provider" : "Seleccionar proveedor"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="claude">Anthropic Claude</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium">
                {language === "en" ? "API Key" : "Clave API"}
              </label>
              <Input
                id="apiKey"
                type="password"
                placeholder={
                  aiProvider === "openai" ? "sk-..." : 
                  aiProvider === "gemini" ? "AIza..." : 
                  "sk-ant-..."
                }
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            
            {aiProvider === "openai" && (
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
            
            {aiProvider === "gemini" && (
              <div className="space-y-2">
                <label htmlFor="model" className="text-sm font-medium">
                  {language === "en" ? "Model" : "Modelo"}
                </label>
                <Select value="gemini-pro" disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Gemini Pro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {language === "en" 
                    ? "Only Gemini Pro is currently supported" 
                    : "Solo se admite actualmente Gemini Pro"}
                </p>
              </div>
            )}
            
            {aiProvider === "claude" && (
              <div className="space-y-2">
                <label htmlFor="model" className="text-sm font-medium">
                  {language === "en" ? "Model" : "Modelo"}
                </label>
                <Select value="claude-3-haiku" disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Claude 3 Haiku" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {language === "en" 
                    ? "Only Claude 3 Haiku is currently supported" 
                    : "Solo se admite actualmente Claude 3 Haiku"}
                </p>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-2">
              {language === "en" 
                ? "You can get API keys from the respective provider websites. These keys are stored locally in your browser."
                : "Puede obtener claves API en los sitios web de los respectivos proveedores. Estas claves se almacenan localmente en su navegador."}
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
