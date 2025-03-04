import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Send, User, AlertCircle, Loader2, RefreshCw, ExternalLink, WifiOff, Cpu } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateOfflineResponse, isOfflineModelReady, initOfflineModel } from "@/utils/offlineLLM";

interface AIHealthAssistantProps {
  language: "en" | "es";
  onBack: () => void;
  patientId?: string;
  model: string;
  provider: string;
  isOnline?: boolean;
  offlineMode?: "simulated" | "localLLM" | "none";
}

interface Message {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: any;
}

const getSampleResponse = (query: string, language: "en" | "es"): string => {
  const responses: Record<string, {en: string, es: string}> = {
    "hypertension": {
      en: "Hypertension, or high blood pressure, is a common condition where the long-term force of blood against your artery walls is high enough that it may eventually cause health problems. Blood pressure is determined by the amount of blood your heart pumps and the resistance to blood flow in your arteries. The more blood your heart pumps and the narrower your arteries, the higher your blood pressure.",
      es: "La hipertensión, o presión arterial alta, es una condición común donde la fuerza a largo plazo de la sangre contra las paredes de las arterias es lo suficientemente alta como para eventualmente causar problemas de salud. La presión arterial está determinada por la cantidad de sangre que bombea el corazón y la resistencia al flujo sanguíneo en las arterias."
    },
    "diabetes": {
      en: "Diabetes is a chronic health condition that affects how your body turns food into energy. Most of the food you eat is broken down into sugar (glucose) and released into your bloodstream. When your blood sugar goes up, it signals your pancreas to release insulin, which lets blood sugar into your body's cells for use as energy.",
      es: "La diabetes es una condición de salud crónica que afecta cómo su cuerpo convierte los alimentos en energía. La mayoría de los alimentos que consume se descomponen en azúcar (glucosa) y se liberan en el torrente sanguíneo. Cuando su nivel de azúcar en la sangre sube, indica a su páncreas que libere insulina."
    },
    "covid": {
      en: "COVID-19 is a respiratory illness caused by the SARS-CoV-2 virus. Common symptoms include fever, cough, and fatigue. If you're experiencing symptoms, please consider getting tested and consult with a healthcare professional.",
      es: "COVID-19 es una enfermedad respiratoria causada por el virus SARS-CoV-2. Los síntomas comunes incluyen fiebre, tos y fatiga. Si está experimentando síntomas, considere hacerse una prueba y consulte con un profesional de la salud."
    }
  };

  const lowercaseQuery = query.toLowerCase();
  
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowercaseQuery.includes(keyword)) {
      return response[language];
    }
  }

  return language === "en" 
    ? "I'm in offline mode with limited capabilities. Please try again when online, or ask about common health topics like hypertension, diabetes, or COVID-19."
    : "Estoy en modo sin conexión con capacidades limitadas. Por favor, inténtalo de nuevo cuando esté en línea, o pregunte sobre temas comunes de salud como hipertensión, diabetes o COVID-19.";
};

export const AIHealthAssistant = ({ 
  language, 
  onBack, 
  patientId,
  model,
  provider,
  isOnline = true,
  offlineMode = "simulated"
}: AIHealthAssistantProps) => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTroubleshootingDialog, setShowTroubleshootingDialog] = useState(false);
  const [showOfflineModeDialog, setShowOfflineModeDialog] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [offlineModeChoice, setOfflineModeChoice] = useState<"simulated" | "localLLM">(
    offlineMode === "localLLM" ? "localLLM" : "simulated"
  );
  const [isLoadingOfflineModel, setIsLoadingOfflineModel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const functions = getFunctions();

  useEffect(() => {
    const systemMessage: Message = {
      role: "system",
      content: language === "en" 
        ? "Hello! I'm your AI health assistant. How can I help you today?"
        : "¡Hola! Soy tu asistente de salud con IA. ¿Cómo puedo ayudarte hoy?",
      timestamp: serverTimestamp()
    };
    
    setMessages([systemMessage]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!patientId) return;
    
    try {
      const q = query(
        collection(db, "aiChats"),
        where("patientId", "==", patientId),
        orderBy("timestamp", "asc")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedMessages: Message[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          loadedMessages.push({
            id: doc.id,
            role: data.role,
            content: data.content,
            timestamp: data.timestamp
          });
        });
        
        if (loadedMessages.length > 0) {
          setMessages(loadedMessages);
        }
      });
      
      return () => unsubscribe();
    } catch (err) {
      console.error("Error loading chat history:", err);
      setError(language === "en" 
        ? "Failed to load chat history. Please try again."
        : "Error al cargar el historial de chat. Por favor, inténtalo de nuevo.");
    }
  }, [patientId, language]);

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
    
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: serverTimestamp()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    
    try {
      if (patientId) {
        await addDoc(collection(db, "aiChats"), {
          patientId,
          ...userMessage
        });
      }
      
      await handleAIRequest(input, [...messages, userMessage]);
      
    } catch (err: any) {
      console.error("Error in chat message handling:", err);
      setError(language === "en" 
        ? "Failed to send message. Please try again."
        : "Error al enviar el mensaje. Por favor, inténtalo de nuevo.");
    }
  };

  const handleAIRequest = async (userInput: string, conversationHistory: Message[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const shouldUseOfflineMode = !isOnline || isUsingFallback || offlineMode === "localLLM" || offlineMode === "simulated";
      
      if (shouldUseOfflineMode) {
        console.log(`Using offline mode: ${offlineMode}, isOnline: ${isOnline}, isUsingFallback: ${isUsingFallback}`);
        
        if (offlineMode === "localLLM" && isOfflineModelReady()) {
          await handleLocalLLMResponse(userInput, conversationHistory);
        } else {
          await handleSimulatedResponse(userInput);
        }
        return;
      }
      
      let apiKey = "";
      
      if (provider === "openai") {
        apiKey = localStorage.getItem("openai_api_key") || "";
      } else if (provider === "llama") {
        apiKey = localStorage.getItem("huggingface_token") || "";
      }
      
      if (!apiKey) {
        console.log("API key not found, using offline mode");
        setIsUsingFallback(true);
        
        if (offlineMode === "localLLM" && isOfflineModelReady()) {
          await handleLocalLLMResponse(userInput, conversationHistory);
        } else {
          await handleSimulatedResponse(userInput);
        }
        return;
      }
      
      const messageHistory = conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const aiChatFunction = httpsCallable(functions, 'aiChat');
      
      console.log(`Calling AI model: ${provider}/${model} with ${messageHistory.length} messages`);
      
      try {
        const result = await aiChatFunction({
          messages: messageHistory,
          model: model,
          provider: provider,
          language: language,
          apiKey: apiKey
        });
        
        const responseData = result.data as { response?: string };
        console.log("AI response received:", responseData);
        
        const aiResponse = responseData.response || (language === "en" 
          ? "I'm sorry, I couldn't generate a response." 
          : "Lo siento, no pude generar una respuesta.");
        
        const assistantMessage: Message = {
          role: "assistant",
          content: aiResponse,
          timestamp: serverTimestamp()
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        
        if (patientId) {
          await addDoc(collection(db, "aiChats"), {
            patientId,
            ...assistantMessage
          });
        }
      } catch (functionError) {
        console.error("Function error:", functionError);
        setIsUsingFallback(true);
        toast({
          title: language === "en" ? "Using offline mode" : "Usando modo sin conexión",
          description: language === "en" 
            ? "Switched to offline response mode due to service errors." 
            : "Cambiado a modo de respuesta sin conexión debido a errores de servicio.",
          variant: "default",
        });
        
        if (offlineMode === "localLLM" && isOfflineModelReady()) {
          await handleLocalLLMResponse(userInput, conversationHistory);
        } else {
          await handleSimulatedResponse(userInput);
        }
      }
    } catch (err: any) {
      console.error("Error in AI chat:", err);
      
      let errorMessage = err.message || (language === "en" 
        ? "Failed to get response from AI. Please try again."
        : "Error al obtener respuesta de la IA. Por favor, inténtalo de nuevo.");
        
      if (err.code === 'functions/internal') {
        errorMessage = language === "en" 
          ? "The AI service encountered an internal error. This could be due to high demand or service limitations."
          : "El servicio de IA encontró un error interno. Esto podría deberse a una alta demanda o limitaciones del servicio.";
      } else if (err.code === 'functions/invalid-argument') {
        errorMessage = language === "en" 
          ? "Invalid API key or model configuration. Please check your settings."
          : "Clave API o configuración de modelo inválida. Por favor, verifica tus ajustes.";
      } else if (err.code === 'functions/resource-exhausted') {
        errorMessage = language === "en"
          ? "API quota exceeded. Please try again later or use a different model."
          : "Cuota de API excedida. Por favor, intenta más tarde o usa un modelo diferente.";
      } else if (err.code === 'functions/unavailable') {
        errorMessage = language === "en"
          ? "AI service is temporarily unavailable. Please try again later."
          : "El servicio de IA no está disponible temporalmente. Por favor, inténtalo más tarde.";
      } else if (err.code === 'functions/unauthenticated') {
        errorMessage = language === "en"
          ? "Authentication error. Please check your API key in settings."
          : "Error de autenticación. Por favor, verifica tu clave API en ajustes.";
      }
      
      setError(errorMessage);
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: language === "en"
            ? "I'm sorry, I encountered an error. Please try again or check your connection."
            : "Lo siento, encontré un error. Por favor, inténtalo de nuevo o verifica tu conexión.",
          timestamp: serverTimestamp()
        }
      ]);
      
      setIsUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulatedResponse = async (userInput: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const aiResponse = getSampleResponse(userInput, language);
    
    const assistantMessage: Message = {
      role: "assistant",
      content: aiResponse,
      timestamp: serverTimestamp()
    };
    
    setMessages((prev) => [...prev, assistantMessage]);
    
    if (patientId) {
      await addDoc(collection(db, "aiChats"), {
        patientId,
        ...assistantMessage
      });
    }
  };

  const handleLocalLLMResponse = async (userInput: string, conversationHistory: Message[]) => {
    try {
      if (!isOfflineModelReady()) {
        setIsLoadingOfflineModel(true);
        
        toast({
          title: language === "en" ? "Loading Offline LLM" : "Cargando LLM sin conexión",
          description: language === "en" 
            ? "Preparing the local AI model. This may take a moment..." 
            : "Preparando el modelo de IA local. Esto puede tardar un momento...",
          variant: "default",
        });
        
        const success = await initOfflineModel();
        setIsLoadingOfflineModel(false);
        
        if (!success) {
          toast({
            title: language === "en" ? "Offline LLM Failed" : "Error en LLM sin conexión",
            description: language === "en" 
              ? "Could not initialize local AI model. Using simulated responses instead." 
              : "No se pudo inicializar el modelo de IA local. Usando respuestas simuladas en su lugar.",
            variant: "destructive",
          });
          
          await handleSimulatedResponse(userInput);
          return;
        }
      }
      
      const aiResponse = await generateOfflineResponse(userInput, language);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: serverTimestamp()
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      if (patientId) {
        await addDoc(collection(db, "aiChats"), {
          patientId,
          ...assistantMessage
        });
      }
    } catch (error) {
      console.error("Error using local LLM:", error);
      await handleSimulatedResponse(userInput);
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
      title: language === "en" ? "Switched to Offline Mode" : "Cambiado a Modo Sin Conexión",
      description: language === "en" 
        ? "Using simulated AI responses for common health questions" 
        : "Usando respuestas de IA simuladas para preguntas comunes de salud",
      variant: "default",
    });
    setError(null);
  };

  const handleOfflineModeChange = async () => {
    if (offlineModeChoice === "localLLM") {
      setIsLoadingOfflineModel(true);
      const success = await initOfflineModel();
      setIsLoadingOfflineModel(false);
      
      if (success) {
        toast({
          title: language === "en" ? "Offline LLM Ready" : "LLM sin conexión listo",
          description: language === "en" 
            ? "Local AI model loaded successfully" 
            : "Modelo de IA local cargado con éxito",
          variant: "default",
        });
      } else {
        toast({
          title: language === "en" ? "Offline LLM Failed" : "Error en LLM sin conexión",
          description: language === "en" 
            ? "Could not load local AI model. Using simulated responses instead." 
            : "No se pudo cargar el modelo de IA local. Usando respuestas simuladas en su lugar.",
          variant: "destructive",
        });
        setOfflineModeChoice("simulated");
      }
    }
    
    setShowOfflineModeDialog(false);
  };

  return (
    <div className="flex flex-col h-full">
      {(!isOnline || isUsingFallback) && (
        <Alert className="m-2 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle>
            {language === "en" ? "Offline Mode" : "Modo Sin Conexión"}
          </AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>
              {language === "en" 
                ? `You're currently using ${offlineMode === "localLLM" && isOfflineModelReady() ? "a local AI model" : "simplified AI responses"} with limited capabilities.`
                : `Actualmente estás usando ${offlineMode === "localLLM" && isOfflineModelReady() ? "un modelo de IA local" : "respuestas de IA simplificadas"} con capacidades limitadas.`}
            </p>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowOfflineModeDialog(true)}
              className="self-start"
            >
              {offlineMode === "localLLM" && isOfflineModelReady() ? <Cpu className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
              {language === "en" ? "Change Offline Mode" : "Cambiar Modo Sin Conexión"}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive" className="m-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {language === "en" ? "Error" : "Error"}
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
                {language === "en" ? "Retry" : "Reintentar"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleUseFallbackMode}
                className="h-7 text-xs"
              >
                {language === "en" ? "Use Offline Mode" : "Usar Modo Sin Conexión"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowTroubleshootingDialog(true)}
                className="h-7 text-xs"
              >
                {language === "en" ? "Troubleshooting" : "Solución de problemas"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <Card key={index} className={`max-w-[80%] ${message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "mr-auto"}`}>
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  {message.role === "assistant" ? (
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
            placeholder={language === "en" ? "Type your message..." : "Escribe tu mensaje..."}
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
          {isUsingFallback || !isOnline ? (
            <span className="flex items-center">
              {offlineMode === "localLLM" && isOfflineModelReady() ? (
                <>
                  <Cpu className="h-3 w-3 mr-1" />
                  {language === "en" ? "Using local LLM for offline responses" : "Usando LLM local para respuestas sin conexión"}
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  {language === "en" ? "Using simulated responses in offline mode" : "Usando respuestas simuladas en modo sin conexión"}
                </>
              )}
            </span>
          ) : (
            <span>
              {language === "en" 
                ? `Using ${provider === "openai" ? "OpenAI" : "Llama"} ${model} model`
                : `Usando modelo ${provider === "openai" ? "OpenAI" : "Llama"} ${model}`}
            </span>
          )}
        </p>
      </div>

      <Dialog open={showTroubleshootingDialog} onOpenChange={setShowTroubleshootingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "Troubleshooting" : "Solución de problemas"}
            </DialogTitle>
            <DialogDescription>
              {language === "en" 
                ? "Try these steps to resolve the issue:" 
                : "Intenta estos pasos para resolver el problema:"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                {language === "en" 
                  ? "Check your API key in settings (make sure it's valid and has not expired)"
                  : "Verifica tu clave API en ajustes (asegúrate de que sea válida y no haya expirado)"}
              </li>
              <li>
                {language === "en" 
                  ? "Check your internet connection"
                  : "Verifica tu conexión a internet"}
              </li>
              <li>
                {language === "en" 
                  ? "Try switching to a different AI model"
                  : "Intenta cambiar a un modelo de IA diferente"}
              </li>
              <li>
                {language === "en" 
                  ? "If using OpenAI, ensure your account has available credits"
                  : "Si estás usando OpenAI, asegúrate de que tu cuenta tenga créditos disponibles"}
              </li>
              <li>
                {language === "en" 
                  ? "Try again later - the AI service might be experiencing high demand"
                  : "Intenta más tarde - el servicio de IA podría estar experimentando alta demanda"}
              </li>
            </ol>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleUseFallbackMode}
            >
              {language === "en" ? "Use Offline Mode" : "Usar Modo Sin Conexión"}
            </Button>
            <Button onClick={() => setShowTroubleshootingDialog(false)}>
              {language === "en" ? "Close" : "Cerrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showOfflineModeDialog} onOpenChange={setShowOfflineModeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "Offline Mode Settings" : "Configuración del Modo Sin Conexión"}
            </DialogTitle>
            <DialogDescription>
              {language === "en" 
                ? "Choose how the assistant should work when offline:" 
                : "Elige cómo debe funcionar el asistente cuando esté sin conexión:"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <RadioGroup 
              value={offlineModeChoice} 
              onValueChange={(value) => setOfflineModeChoice(value as "simulated" | "localLLM")}
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
                <RadioGroupItem value="localLLM" id="localLLM" />
                <Label htmlFor="localLLM" className="cursor-pointer font-medium">
                  {language === "en" ? "Local AI Model" : "Modelo de IA Local"}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {language === "en" 
                  ? "Downloads and runs an AI model directly in your browser. More accurate but requires downloading the model (~50-100MB)."
                  : "Descarga y ejecuta un modelo de IA directamente en tu navegador. Más preciso pero requiere descargar el modelo (~50-100MB)."}
              </p>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOfflineModeDialog(false)}>
              {language === "en" ? "Cancel" : "Cancelar"}
            </Button>
            <Button onClick={handleOfflineModeChange} disabled={isLoadingOfflineModel}>
              {isLoadingOfflineModel ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {language === "en" ? "Save & Apply" : "Guardar y Aplicar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
