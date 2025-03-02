
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Default API keys
const DEFAULT_OPENAI_API_KEY = "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";
const DEFAULT_HUGGINGFACE_TOKEN = "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";

interface AISettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: "en" | "es";
  provider: string;
  setProvider: (provider: string) => void;
  model: string;
  setModel: (model: string) => void;
}

export const AISettingsDialog = ({ 
  open, 
  onOpenChange, 
  language, 
  provider,
  setProvider,
  model,
  setModel
}: AISettingsDialogProps) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") || DEFAULT_OPENAI_API_KEY);
  const [huggingFaceToken, setHuggingFaceToken] = useState(() => localStorage.getItem("huggingface_token") || DEFAULT_HUGGINGFACE_TOKEN);

  // Update API key based on provider
  useEffect(() => {
    if (provider === "openai") {
      const key = localStorage.getItem("openai_api_key") || DEFAULT_OPENAI_API_KEY;
      setApiKey(key);
    } else if (provider === "llama") {
      const token = localStorage.getItem("huggingface_token") || DEFAULT_HUGGINGFACE_TOKEN;
      setHuggingFaceToken(token);
    }
    
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
  }, [provider, setModel]);

  const saveApiKey = () => {
    if (provider === "openai" && !apiKey.trim()) {
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "API key cannot be empty for OpenAI."
          : "La clave API no puede estar vacía para OpenAI.",
        variant: "destructive",
      });
      return;
    }

    if (provider === "llama" && !huggingFaceToken.trim()) {
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "Hugging Face token cannot be empty for Llama 2 models."
          : "El token de Hugging Face no puede estar vacío para los modelos Llama 2.",
        variant: "destructive",
      });
      return;
    }
    
    if (provider === "openai") {
      localStorage.setItem("openai_api_key", apiKey);
    } else if (provider === "llama") {
      localStorage.setItem("huggingface_token", huggingFaceToken);
    }
    
    localStorage.setItem(`${provider}_model`, model);
    localStorage.setItem("ai_provider", provider);
    onOpenChange(false);
    toast({
      title: language === "en" ? "Settings Saved" : "Configuración Guardada",
      description: language === "en" 
        ? "Your API settings have been updated."
        : "Tu configuración de API ha sido actualizada.",
    });
    window.location.reload(); // Reload to refresh the component with the new settings
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <SelectItem value="llama">Llama 2 (Requires Hugging Face token)</SelectItem>
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
          
          {provider === "llama" && (
            <div className="space-y-2">
              <label htmlFor="huggingFaceToken" className="text-sm font-medium">
                {language === "en" ? "Hugging Face API Token" : "Token de API de Hugging Face"}
              </label>
              <Input
                id="huggingFaceToken"
                type="password"
                placeholder="hf_..."
                value={huggingFaceToken}
                onChange={(e) => setHuggingFaceToken(e.target.value)}
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
                  ? "Llama 2 models require a Hugging Face API token. You can get one for free at huggingface.co/settings/tokens." 
                  : "Los modelos Llama 2 requieren un token de API de Hugging Face. Puede obtener uno gratis en huggingface.co/settings/tokens."}
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
            onClick={() => onOpenChange(false)}
          >
            {language === "en" ? "Cancel" : "Cancelar"}
          </Button>
          <Button onClick={saveApiKey}>
            {language === "en" ? "Save" : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
