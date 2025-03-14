
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Send, User, AlertCircle, Loader2, RefreshCw, ExternalLink, WifiOff, Cpu, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateOfflineResponse, isOfflineModelReady, initOfflineModel, getOfflineModelConfig, getSampleResponse, OfflineModeType } from "@/utils/offlineHelpers";
import { FakeAIService, AIMessage } from "@/services/fakeAIService";
import { AIService } from "@/services/aiService";

interface AIHealthAssistantProps {
  language: "en" | "es";
  onBack: () => void;
  patientId?: string;
  model: string;
  provider: string;
  isOnline?: boolean;
  offlineMode?: OfflineModeType;
  aiService?: AIService;
  quotaExceeded?: boolean;
}

export const AIHealthAssistant = ({ 
  language, 
  onBack, 
  patientId,
  model,
  provider,
  isOnline = true,
  offlineMode = "simulated",
  aiService,
  quotaExceeded = false
}: AIHealthAssistantProps) => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTroubleshootingDialog, setShowTroubleshootingDialog] = useState(false);
  const [showOfflineModeDialog, setShowOfflineModeDialog] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [offlineModeChoice, setOfflineModeChoice] = useState<OfflineModeType>(
    offlineMode === "localLLM" ? "localLLM" : "simulated"
  );
  const [isLoadingOfflineModel, setIsLoadingOfflineModel] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<"en" | "es">(language);
  const [usingOpenAI, setUsingOpenAI] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationId = `chat-${patientId || 'default'}`;
  
  const localAiService = useRef(
    aiService || new FakeAIService({ 
      model, 
      language,
      apiKey: localStorage.getItem(`${provider}_api_key`) || ""
    })
  ).current;

  useEffect(() => {
    const storedApiKey = localStorage.getItem(`${provider}_api_key`) || "";
    const isValidKey = storedApiKey && (storedApiKey.startsWith("sk-") || storedApiKey.startsWith("sk-proj-"));
    
    // Track if we're using OpenAI
    setUsingOpenAI(isValidKey && isOnline && !quotaExceeded);
    
    if (isValidKey) {
      localAiService.setApiKey(storedApiKey);
      
      if (isOnline && !quotaExceeded) {
        console.log("Using OpenAI API for responses");
        toast({
          title: detectedLanguage === "en" ? "Using OpenAI" : "Usando OpenAI",
          description: detectedLanguage === "en" 
            ? "Using OpenAI for enhanced health assistant responses" 
            : "Usando OpenAI para respuestas mejoradas del asistente de salud",
        });
      } else if (quotaExceeded) {
        console.log("OpenAI API quota exceeded, using offline mode");
        setIsUsingFallback(true);
      } else {
        console.log("OpenAI API key found but using offline mode due to connectivity");
      }
    } else {
      console.log("Using simulated responses (no valid OpenAI API key)");
    }
  }, [provider, isOnline, detectedLanguage, localAiService, toast, quotaExceeded]);

  useEffect(() => {
    // Update when quota status changes
    if (quotaExceeded) {
      setIsUsingFallback(true);
      setUsingOpenAI(false);
    }
  }, [quotaExceeded]);

  useEffect(() => {
    console.log(`Language preference changed to: ${language}`);
    localAiService.setLanguage(language);
    setDetectedLanguage(language);
  }, [language, localAiService]);

  useEffect(() => {
    localAiService.setModel(model);
  }, [model, localAiService]);

  useEffect(() => {
    const welcomeMessage = language === "en" 
      ? "Welcome to your Health Assistant! I can provide information on various health topics including pediatric health such as child development, infant feeding, childhood vaccinations, common childhood illnesses, children's sleep, nutrition, and behavioral issues. While I'm not a substitute for professional medical advice, I can offer general guidance based on current health guidelines. How can I assist with your health questions today?"
      : "¡Bienvenido a tu Asistente de Salud! Puedo proporcionar información sobre varios temas de salud incluyendo salud pediátrica como desarrollo infantil, alimentación de bebés, vacunas infantiles, enfermedades infantiles comunes, sueño de los niños, nutrición y problemas de comportamiento. Aunque no soy un sustituto del consejo médico profesional, puedo ofrecer orientación general basada en las pautas de salud actuales. ¿Cómo puedo ayudarte con tus preguntas de salud hoy?";
    
    const systemMessage: AIMessage = {
      role: "system",
      content: welcomeMessage,
      timestamp: new Date()
    };
    
    setMessages([systemMessage]);
    
    if (patientId) {
      loadChatHistory();
    }
  }, [language, patientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await localAiService.getChatHistory(conversationId);
      if (history.length > 0) {
        setMessages(history);
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
      setError(detectedLanguage === "en" 
        ? "Failed to load chat history. Please try again."
        : "Error al cargar el historial de chat. Por favor, inténtalo de nuevo.");
    }
  };

  const handleRetry = () => {
    setError(null);
    if (messages.length > 1) {
      const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.role === "user");
      if (lastUserMessageIndex >= 0) {
        const actualIndex = messages.length - 1 - lastUserMessageIndex;
        const userMessage = messages[actualIndex];
        
        const newMessages = messages.slice(0, actualIndex + 1);
        setMessages(newMessages);
        setRetryCount(prev => prev + 1);
        
        handleAIRequest(userMessage.content, newMessages);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    let inputDetectedLang: "en" | "es" = language;
    
    if ('detectLanguage' in localAiService) {
      inputDetectedLang = localAiService.detectLanguage(input);
    }
    
    setDetectedLanguage(inputDetectedLang);
    
    const userMessage: AIMessage = {
      role: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    
    try {
      await handleAIRequest(input, [...messages, userMessage]);
    } catch (err: any) {
      console.error("Error in chat message handling:", err);
      setError(detectedLanguage === "en" 
        ? "Failed to send message. Please try again."
        : "Error al enviar el mensaje. Por favor, inténtalo de nuevo.");
    }
  };

  const handleAIRequest = async (userInput: string, conversationHistory: AIMessage[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Using provider: ${provider}, model: ${model}, isOnline: ${isOnline}, detected language: ${detectedLanguage}, quota exceeded: ${quotaExceeded}`);
      
      const apiKey = localStorage.getItem(`${provider}_api_key`);
      if (provider === "openai" && apiKey && (apiKey.startsWith("sk-") || apiKey.startsWith("sk-proj-")) && isOnline && !quotaExceeded) {
        localAiService.setApiKey(apiKey);
        console.log("Using OpenAI API for response");
      } else {
        if (quotaExceeded) {
          console.log("Using offline mode due to quota exceeded");
        } else {
          console.log("Using offline/simulated mode for response");
        }
      }
      
      const aiResponse = await localAiService.sendMessage(userInput, conversationId, conversationHistory);
      
      // If we get a system message about quota, it should be displayed as is
      if (aiResponse.role === "system" && aiResponse.content.includes("quota exceeded")) {
        setMessages((prev) => [...prev, aiResponse]);
        toast({
          title: detectedLanguage === "en" ? "API Quota Exceeded" : "Cuota de API Excedida",
          description: detectedLanguage === "en" 
            ? "Using simulated responses. Please update your API key in settings." 
            : "Usando respuestas simuladas. Por favor, actualiza tu clave API en configuración.",
          variant: "destructive",
        });
      } else {
        setMessages((prev) => [...prev, aiResponse]);
      }
      
      // If this is a response from the API, check if it worked
      if ('getApiStatus' in localAiService) {
        const status = localAiService.getApiStatus();
        if (status.quotaExceeded) {
          setUsingOpenAI(false);
          setIsUsingFallback(true);
        }
      }
    } catch (err: any) {
      console.error("Error in AI chat:", err);
      
      let errorMessage = err.message || (detectedLanguage === "en" 
        ? "Failed to get response from AI. Please try again."
        : "Error al obtener respuesta de la IA. Por favor, inténtalo de nuevo.");
        
      setError(errorMessage);
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: detectedLanguage === "en"
            ? "I'm sorry, I encountered an error. Please try again or check your connection."
            : "Lo siento, encontré un error. Por favor, inténtalo de nuevo o verifica tu conexión.",
          timestamp: new Date()
        }
      ]);
      
      setIsUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUseFallbackMode = () => {
    setIsUsingFallback(true);
    toast({
      title: detectedLanguage === "en" ? "Switched to Offline Mode" : "Cambiado a Modo Sin Conexión",
      description: detectedLanguage === "en" 
        ? "Using simulated AI responses for common health questions" 
        : "Usando respuestas de IA simuladas para preguntas comunes de salud",
      variant: "default",
    });
    setError(null);
  };

  const handleOfflineModeChange = async () => {
    setShowOfflineModeDialog(false);
  };

  const getInputPlaceholder = () => {
    return detectedLanguage === "en" 
      ? "Ask a health question..." 
      : "Haz una pregunta de salud...";
  };

  return (
    <div className="flex flex-col h-full">
      {quotaExceeded && (
        <Alert className="m-2 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle>
            {detectedLanguage === "en" ? "API Quota Exceeded" : "Cuota de API Excedida"}
          </AlertTitle>
          <AlertDescription>
            {detectedLanguage === "en" 
              ? "Your OpenAI API quota has been exceeded. Using offline mode with simulated responses. Please update your API key in settings."
              : "Tu cuota de API de OpenAI ha sido excedida. Usando modo sin conexión con respuestas simuladas. Por favor, actualiza tu clave API en configuración."}
          </AlertDescription>
        </Alert>
      )}
      
      {(!isOnline || isUsingFallback) && !quotaExceeded && (
        <Alert className="m-2 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle>
            {detectedLanguage === "en" ? "Health Assistant" : "Asistente de Salud"}
          </AlertTitle>
          <AlertDescription>
            {detectedLanguage === "en" 
              ? "I can provide general health information on various topics, including pediatric health. For personal medical advice, please consult a healthcare professional."
              : "Puedo proporcionar información general de salud sobre varios temas, incluyendo salud pediátrica. Para consejos médicos personales, consulte a un profesional de la salud."}
          </AlertDescription>
        </Alert>
      )}
      
      {usingOpenAI && isOnline && !quotaExceeded && (
        <Alert className="m-2 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle>
            {detectedLanguage === "en" ? "OpenAI Enhanced" : "Mejorado con OpenAI"}
          </AlertTitle>
          <AlertDescription>
            {detectedLanguage === "en" 
              ? "Using OpenAI for enhanced health assistant responses with the latest medical knowledge."
              : "Usando OpenAI para respuestas mejoradas del asistente de salud con los conocimientos médicos más recientes."}
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive" className="m-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {detectedLanguage === "en" ? "Error" : "Error"}
          </AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <div>{error}</div>
            <div className="flex gap-2 mt-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry} 
                className="h-7 text-xs"
                disabled={isLoading}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                {detectedLanguage === "en" ? "Retry" : "Reintentar"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowTroubleshootingDialog(true)}
                className="h-7 text-xs"
              >
                {detectedLanguage === "en" ? "Troubleshooting" : "Solución de problemas"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <Card key={index} className={`max-w-[80%] ${
              message.role === "user" 
                ? "ml-auto bg-primary text-primary-foreground" 
                : message.role === "system" && message.content.includes("quota exceeded")
                  ? "mr-auto bg-destructive text-destructive-foreground"
                  : "mr-auto"
            }`}>
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  {message.role === "assistant" || message.role === "system" ? (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  ) : message.role === "user" ? (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  ) : null}
                  <div className="space-y-1">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder={getInputPlaceholder()}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isLoadingOfflineModel}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading || isLoadingOfflineModel || !input.trim()}>
            {isLoading || isLoadingOfflineModel ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          <span className="flex items-center">
            <Bot className="h-3 w-3 mr-1" />
            {detectedLanguage === "en" 
              ? "Health Assistant - For general health information only. Not a substitute for professional medical advice."
              : "Asistente de Salud - Solo para información general de salud. No sustituye el consejo médico profesional."}
          </span>
        </p>
      </div>

      <Dialog open={showTroubleshootingDialog} onOpenChange={setShowTroubleshootingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {detectedLanguage === "en" ? "Troubleshooting" : "Solución de problemas"}
            </DialogTitle>
            <DialogDescription>
              {detectedLanguage === "en" 
                ? "Try these steps to resolve the issue:" 
                : "Intenta estos pasos para resolver el problema:"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                {detectedLanguage === "en" 
                  ? "Check your API key in settings (make sure it's valid and has not expired)"
                  : "Verifica tu clave API en ajustes (asegúrate de que sea válida y no haya expirado)"}
              </li>
              <li>
                {detectedLanguage === "en" 
                  ? "Check your internet connection"
                  : "Verifica tu conexión a internet"}
              </li>
              <li>
                {detectedLanguage === "en" 
                  ? "Try switching to a different AI model"
                  : "Intenta cambiar a un modelo de IA diferente"}
              </li>
              <li>
                {detectedLanguage === "en" 
                  ? "If the issue persists, try using the offline mode"
                  : "Si el problema persiste, intenta usar el modo sin conexión"}
              </li>
            </ol>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTroubleshootingDialog(false)}>
              {detectedLanguage === "en" ? "Close" : "Cerrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showOfflineModeDialog} onOpenChange={setShowOfflineModeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {detectedLanguage === "en" ? "Offline Mode Settings" : "Configuración del Modo Sin Conexión"}
            </DialogTitle>
            <DialogDescription>
              {detectedLanguage === "en" 
                ? "Choose how the assistant should work when offline:" 
                : "Elige cómo debe funcionar el asistente cuando esté sin conexión:"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <RadioGroup 
              value={offlineModeChoice} 
              onValueChange={(value) => setOfflineModeChoice(value as OfflineModeType)}
            >
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="simulated" id="simulated" />
                <Label htmlFor="simulated" className="cursor-pointer font-medium">
                  {detectedLanguage === "en" ? "Simulated Responses" : "Respuestas Simuladas"}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6 mb-4">
                {detectedLanguage === "en" 
                  ? "Uses pre-defined responses for common health questions. Fast and no download required."
                  : "Utiliza respuestas predefinidas para preguntas comunes de salud. Rápido y sin necesidad de descarga."}
              </p>
              
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="localLLM" id="localLLM" />
                <Label htmlFor="localLLM" className="cursor-pointer font-medium">
                  {detectedLanguage === "en" ? "Local AI Model" : "Modelo de IA Local"}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {detectedLanguage === "en" 
                  ? "This option is currently unavailable in this version."
                  : "Esta opción no está disponible actualmente en esta versión."}
              </p>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOfflineModeDialog(false)}>
              {detectedLanguage === "en" ? "Cancel" : "Cancelar"}
            </Button>
            <Button onClick={() => setShowOfflineModeDialog(false)}>
              {detectedLanguage === "en" ? "Save & Apply" : "Guardar y Aplicar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
