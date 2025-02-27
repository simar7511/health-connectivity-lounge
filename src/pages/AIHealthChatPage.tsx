
import { useState, useEffect } from "react";
import { AIHealthAssistant } from "@/components/dashboard/AIHealthAssistant";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { GlobeIcon } from "lucide-react";

export const AIHealthChatPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [language, setLanguage] = useState<"en" | "es">(() => {
    return (sessionStorage.getItem("preferredLanguage") as "en" | "es") || "en";
  });
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") || "");

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
      setShowApiDialog(false);
      toast({
        title: language === "en" ? "API Key Saved" : "Clave API Guardada",
        description: language === "en" 
          ? "Your OpenAI API key has been updated."
          : "Tu clave API de OpenAI ha sido actualizada.",
      });
      window.location.reload(); // Reload to refresh the component with the new API key
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
        >
          {language === "en" ? "Change API Key" : "Cambiar Clave API"}
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <AIHealthAssistant 
          language={language} 
          onBack={handleBack}
          patientId={patientId}
        />
      </div>

      <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "OpenAI API Key" : "Clave API de OpenAI"}
            </DialogTitle>
            <DialogDescription>
              {language === "en" 
                ? "Enter your OpenAI API key to use the Health Assistant." 
                : "Ingrese su clave API de OpenAI para usar el Asistente de Salud."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {language === "en" 
                ? "You can get an API key from the OpenAI website. This key is stored locally in your browser."
                : "Puede obtener una clave API en el sitio web de OpenAI. Esta clave se almacena localmente en su navegador."}
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
