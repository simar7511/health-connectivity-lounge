
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, KeyRound, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  // Update based on provider
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
    
    // Close dialog and notify user
    onOpenChange(false);
    toast({
      title: language === "en" ? "Settings Saved" : "Configuración Guardada",
      description: language === "en" 
        ? "Your AI settings have been updated successfully."
        : "Tu configuración de IA ha sido actualizada con éxito.",
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
          <Alert className="bg-primary/10 border-primary/20">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <AlertDescription>
              {language === "en" 
                ? "API keys are now managed by the system administrator. No need to enter them manually." 
                : "Las claves API ahora son administradas por el administrador del sistema. No es necesario ingresarlas manualmente."}
            </AlertDescription>
          </Alert>
          
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
                <SelectItem value="llama">Llama 2 (Offline Capable)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
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
          
          {offlineMode && setOfflineMode && (
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
