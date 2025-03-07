
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertOctagon, Check, Globe, Key, Settings } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { OfflineModeType } from "@/utils/offlineHelpers";

interface AISettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: "en" | "es";
  provider: string;
  setProvider: (provider: string) => void;
  model: string;
  setModel: (model: string) => void;
  offlineMode: OfflineModeType;
  setOfflineMode: (mode: OfflineModeType) => void;
  updateApiKey?: (key: string) => void;
  quotaExceeded?: boolean;
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
  setOfflineMode,
  updateApiKey,
  quotaExceeded = false
}: AISettingsDialogProps) => {
  const [activeTab, setActiveTab] = useState<"general" | "api">("general");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(`${provider}_api_key`) || "");

  const handleSave = () => {
    // Save API key if provided and different from stored
    if (updateApiKey && apiKey !== localStorage.getItem(`${provider}_api_key`)) {
      updateApiKey(apiKey);
    }
    
    // Close dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === "en" ? "AI Health Assistant Settings" : "Configuración del Asistente de Salud IA"}
          </DialogTitle>
          <DialogDescription>
            {language === "en" 
              ? "Configure how the AI Health Assistant functions" 
              : "Configura cómo funciona el Asistente de Salud IA"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-2">
          <ToggleGroup type="single" value={activeTab} onValueChange={(value) => setActiveTab(value as "general" | "api")}>
            <ToggleGroupItem value="general">
              <Settings className="h-4 w-4 mr-2" />
              {language === "en" ? "General" : "General"}
            </ToggleGroupItem>
            <ToggleGroupItem value="api">
              <Key className="h-4 w-4 mr-2" />
              {language === "en" ? "API" : "API"}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        {activeTab === "general" && (
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model">
                {language === "en" ? "AI Model" : "Modelo de IA"}
              </Label>
              <Select 
                value={model} 
                onValueChange={setModel}
              >
                <SelectTrigger id="model">
                  <SelectValue placeholder={language === "en" ? "Select model" : "Seleccionar modelo"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">OpenAI GPT-4o</SelectItem>
                  <SelectItem value="gpt-4o-mini">OpenAI GPT-4o-mini</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {language === "en" 
                  ? "GPT-4o is more accurate but may be slower. GPT-4o-mini is faster but less accurate." 
                  : "GPT-4o es más preciso pero puede ser más lento. GPT-4o-mini es más rápido pero menos preciso."}
              </p>
            </div>
            
            <div className="space-y-2 pt-4">
              <Label>
                {language === "en" ? "Offline Mode Behavior" : "Comportamiento del Modo Sin Conexión"}
              </Label>
              <RadioGroup 
                value={offlineMode} 
                onValueChange={(value) => setOfflineMode(value as OfflineModeType)}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="simulated" id="simulated" />
                  <Label htmlFor="simulated" className="cursor-pointer font-medium">
                    {language === "en" ? "Simulated Responses" : "Respuestas Simuladas"}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6 mb-4">
                  {language === "en" 
                    ? "Uses pre-defined responses for common health questions. Fast and no download required."
                    : "Utiliza respuestas predefinidas para preguntas comunes de salud. Rápido y sin necesidad de descarga."}
                </p>
                
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="localLLM" id="localLLM" disabled />
                  <Label htmlFor="localLLM" className="cursor-pointer font-medium text-muted-foreground">
                    {language === "en" ? "Local AI Model (Coming Soon)" : "Modelo de IA Local (Próximamente)"}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  {language === "en" 
                    ? "This option will be available in a future update."
                    : "Esta opción estará disponible en una actualización futura."}
                </p>
              </RadioGroup>
            </div>
          </div>
        )}
        
        {activeTab === "api" && (
          <div className="py-4 space-y-4">
            {quotaExceeded && (
              <Alert variant="destructive">
                <AlertOctagon className="h-4 w-4" />
                <AlertTitle>
                  {language === "en" ? "API Quota Exceeded" : "Cuota de API Excedida"}
                </AlertTitle>
                <AlertDescription>
                  {language === "en" 
                    ? "Your OpenAI API quota has been exceeded. Please enter a new API key." 
                    : "Tu cuota de API de OpenAI ha sido excedida. Por favor, ingresa una nueva clave API."}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="provider">
                {language === "en" ? "AI Provider" : "Proveedor de IA"}
              </Label>
              <Select 
                value={provider} 
                onValueChange={setProvider}
                disabled={true}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder={language === "en" ? "Select provider" : "Seleccionar proveedor"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey">
                {language === "en" ? "API Key" : "Clave API"}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={language === "en" ? "Enter your API key" : "Ingresa tu clave API"}
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {language === "en" 
                  ? "Your API key is stored locally on your device and never sent to our servers." 
                  : "Tu clave API se almacena localmente en tu dispositivo y nunca se envía a nuestros servidores."}
              </p>
            </div>
            
            <div className="space-y-2 pt-2">
              <p className="text-sm">
                {language === "en" 
                  ? "To get an API key, visit OpenAI and sign up for an account." 
                  : "Para obtener una clave API, visita OpenAI y regístrate para una cuenta."}
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  {language === "en" ? "Get API Key" : "Obtener Clave API"}
                </a>
              </Button>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {language === "en" ? "Cancel" : "Cancelar"}
          </Button>
          <Button onClick={handleSave}>
            {language === "en" ? "Save" : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
