import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, KeyRound, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Default API keys (empty - will prompt user to enter them)
const DEFAULT_OPENAI_API_KEY = "";
const DEFAULT_HUGGINGFACE_TOKEN = "";

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
  const [apiKey, setApiKey] = useState(() => {
    const savedKey = localStorage.getItem("openai_api_key");
    return savedKey ? "••••••••••••••••••••••••••" : "";
  });
  const [newApiKey, setNewApiKey] = useState("");
  const [huggingFaceToken, setHuggingFaceToken] = useState(() => {
    const savedToken = localStorage.getItem("huggingface_token");
    return savedToken ? "••••••••••••••••••••••••••" : "";
  });
  const [newHuggingFaceToken, setNewHuggingFaceToken] = useState("");
  const [showResetKeySection, setShowResetKeySection] = useState(false);

  // Update API key based on provider
  useEffect(() => {
    if (provider === "openai") {
      const savedKey = localStorage.getItem("openai_api_key");
      setApiKey(savedKey ? "••••••••••••••••••••••••••" : "");
    } else if (provider === "llama") {
      const savedToken = localStorage.getItem("huggingface_token");
      setHuggingFaceToken(savedToken ? "••••••••••••••••••••••••••" : "");
    }
    
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

  const saveApiKey = () => {
    // Validate OpenAI API key
    if (provider === "openai") {
      if (newApiKey) {
        if (!newApiKey.startsWith("sk-") && !newApiKey.startsWith("sk-proj-")) {
          toast({
            title: language === "en" ? "Invalid API Key" : "Clave API inválida",
            description: language === "en" 
              ? "OpenAI API keys should start with 'sk-' or 'sk-proj-'"
              : "Las claves API de OpenAI deben comenzar con 'sk-' o 'sk-proj-'",
            variant: "destructive",
          });
          return;
        }
        // Save new OpenAI key
        localStorage.setItem("openai_api_key", newApiKey);
        setApiKey("••••••••••••••••••••••••••");
        setNewApiKey("");
      } else if (!localStorage.getItem("openai_api_key")) {
        toast({
          title: language === "en" ? "Error" : "Error",
          description: language === "en" 
            ? "API key cannot be empty for OpenAI."
            : "La clave API no puede estar vacía para OpenAI.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate Hugging Face token
    if (provider === "llama") {
      if (newHuggingFaceToken) {
        if (!newHuggingFaceToken.startsWith("hf_")) {
          toast({
            title: language === "en" ? "Invalid Token" : "Token inválido",
            description: language === "en" 
              ? "Hugging Face tokens should start with 'hf_'"
              : "Los tokens de Hugging Face deben comenzar con 'hf_'",
            variant: "destructive",
          });
          return;
        }
        // Save new Hugging Face token
        localStorage.setItem("huggingface_token", newHuggingFaceToken);
        setHuggingFaceToken("••••••••••••••••••••••••••");
        setNewHuggingFaceToken("");
      } else if (!localStorage.getItem("huggingface_token")) {
        toast({
          title: language === "en" ? "Error" : "Error",
          description: language === "en" 
            ? "Hugging Face token cannot be empty for Llama 2 models."
            : "El token de Hugging Face no puede estar vacío para los modelos Llama 2.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Save model and provider preferences
    localStorage.setItem(`${provider}_model`, model);
    localStorage.setItem("ai_provider", provider);
    
    // Close dialog and notify user
    onOpenChange(false);
    setShowResetKeySection(false);
    toast({
      title: language === "en" ? "Settings Saved" : "Configuración Guardada",
      description: language === "en" 
        ? "Your AI settings have been updated successfully."
        : "Tu configuración de IA ha sido actualizada con éxito.",
    });
  };

  const resetApiKey = () => {
    if (provider === "openai") {
      localStorage.removeItem("openai_api_key");
      setApiKey("");
      setNewApiKey("");
    } else if (provider === "llama") {
      localStorage.removeItem("huggingface_token");
      setHuggingFaceToken("");
      setNewHuggingFaceToken("");
    }
    
    toast({
      title: language === "en" ? "API Key Reset" : "Clave API Reiniciada",
      description: language === "en" 
        ? "Your API key has been removed. Please enter a new one."
        : "Tu clave API ha sido eliminada. Por favor, ingresa una nueva.",
    });
    
    setShowResetKeySection(false);
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
                <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                <SelectItem value="llama">Llama 2 (Offline Capable)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {provider === "openai" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="apiKey" className="text-sm font-medium">
                  {language === "en" ? "OpenAI API Key" : "Clave API de OpenAI"}
                </label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowResetKeySection(!showResetKeySection)}
                  className="h-7 text-xs"
                >
                  {language === "en" ? "Reset Key" : "Reiniciar Clave"}
                </Button>
              </div>
              
              {showResetKeySection && (
                <Alert variant="destructive" className="mb-2">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertDescription>
                    {language === "en" 
                      ? "This will delete your stored API key. Are you sure?" 
                      : "Esto eliminará tu clave API almacenada. ¿Estás seguro?"}
                    <div className="mt-2 flex gap-2">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={resetApiKey}
                        className="h-7 text-xs"
                      >
                        {language === "en" ? "Yes, Delete Key" : "Sí, Eliminar Clave"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowResetKeySection(false)} 
                        className="h-7 text-xs"
                      >
                        {language === "en" ? "Cancel" : "Cancelar"}
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              {!showResetKeySection && (
                <>
                  {apiKey ? (
                    <div className="space-y-2">
                      <Input
                        value={apiKey}
                        readOnly
                        className="bg-muted font-mono"
                      />
                      <p className="text-xs text-muted-foreground">
                        {language === "en" 
                          ? "To change your API key, enter a new one below:" 
                          : "Para cambiar tu clave API, ingresa una nueva a continuación:"}
                      </p>
                    </div>
                  ) : (
                    <Alert className="bg-primary/10 border-primary/20 mb-2">
                      <KeyRound className="h-4 w-4 text-primary" />
                      <AlertDescription>
                        {language === "en" 
                          ? "Please enter your OpenAI API key below to enable GPT-4o" 
                          : "Por favor, ingresa tu clave API de OpenAI para habilitar GPT-4o"}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Input
                    id="newApiKey"
                    type="password"
                    placeholder={language === "en" ? "Enter new API key (sk-...)" : "Ingresa nueva clave API (sk-...)"}
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                    className="font-mono"
                  />
                </>
              )}
            </div>
          )}
          
          {provider === "llama" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="huggingFaceToken" className="text-sm font-medium">
                  {language === "en" ? "Hugging Face API Token" : "Token de API de Hugging Face"}
                </label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowResetKeySection(!showResetKeySection)}
                  className="h-7 text-xs"
                >
                  {language === "en" ? "Reset Token" : "Reiniciar Token"}
                </Button>
              </div>
              
              {showResetKeySection && (
                <Alert variant="destructive" className="mb-2">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertDescription>
                    {language === "en" 
                      ? "This will delete your stored token. Are you sure?" 
                      : "Esto eliminará tu token almacenado. ¿Estás seguro?"}
                    <div className="mt-2 flex gap-2">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={resetApiKey}
                        className="h-7 text-xs"
                      >
                        {language === "en" ? "Yes, Delete Token" : "Sí, Eliminar Token"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowResetKeySection(false)} 
                        className="h-7 text-xs"
                      >
                        {language === "en" ? "Cancel" : "Cancelar"}
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              {!showResetKeySection && (
                <>
                  {huggingFaceToken ? (
                    <div className="space-y-2">
                      <Input
                        value={huggingFaceToken}
                        readOnly
                        className="bg-muted font-mono"
                      />
                      <p className="text-xs text-muted-foreground">
                        {language === "en" 
                          ? "To change your token, enter a new one below:" 
                          : "Para cambiar tu token, ingresa uno nuevo a continuación:"}
                      </p>
                    </div>
                  ) : (
                    <Alert className="bg-primary/10 border-primary/20 mb-2">
                      <KeyRound className="h-4 w-4 text-primary" />
                      <AlertDescription>
                        {language === "en" 
                          ? "Please enter your Hugging Face token below to enable Llama 2" 
                          : "Por favor, ingresa tu token de Hugging Face para habilitar Llama 2"}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Input
                    id="newHuggingFaceToken"
                    type="password"
                    placeholder={language === "en" ? "Enter new token (hf_...)" : "Ingresa nuevo token (hf_...)"}
                    value={newHuggingFaceToken}
                    onChange={(e) => setNewHuggingFaceToken(e.target.value)}
                    className="font-mono"
                  />
                </>
              )}
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
            onClick={() => {
              onOpenChange(false);
              setShowResetKeySection(false);
            }}
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
