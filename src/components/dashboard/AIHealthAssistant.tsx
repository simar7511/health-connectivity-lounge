
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Send, User, AlertCircle, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface AIHealthAssistantProps {
  language: "en" | "es";
  onBack: () => void;
  patientId?: string;
  model: string;
  provider: string;
  isOnline?: boolean;
}

interface Message {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: any;
}

// Sample response for offline mode or when service is unavailable
const getSampleResponse = (query: string, language: "en" | "es"): string => {
  // Sample health-related responses
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

  // Look for keywords in the query
  const lowercaseQuery = query.toLowerCase();
  
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowercaseQuery.includes(keyword)) {
      return response[language];
    }
  }

  // Default response if no keywords match
  return language === "en" 
    ? "I'm in offline mode with limited capabilities. Please try again when online, or ask about common health topics like hypertension, diabetes, or COVID-19."
    : "Estoy en modo sin conexión con capacidades limitadas. Por favor, inténtelo de nuevo cuando esté en línea, o pregunte sobre temas comunes de salud como hipertensión, diabetes o COVID-19.";
};

export const AIHealthAssistant = ({ 
  language, 
  onBack, 
  patientId,
  model,
  provider,
  isOnline = true
}: AIHealthAssistantProps) => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTroubleshootingDialog, setShowTroubleshootingDialog] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
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
      // Find the last user message to retry
      const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.role === "user");
      if (lastUserMessageIndex >= 0) {
        const actualIndex = messages.length - 1 - lastUserMessageIndex;
        const userMessage = messages[actualIndex];
        
        // Remove any subsequent assistant messages
        const newMessages = messages.slice(0, actualIndex + 1);
        setMessages(newMessages);
        setRetryCount(prev => prev + 1);
        
        // Call handleSend with the last user message
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
      // If offline or using fallback mode, use the local response generator
      if (!isOnline || isUsingFallback) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        
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
        
        return;
      }
      
      let apiKey = "";
      
      if (provider === "openai") {
        apiKey = localStorage.getItem("openai_api_key") || "";
      } else if (provider === "llama") {
        apiKey = localStorage.getItem("huggingface_token") || "";
      }
      
      if (!apiKey) {
        throw new Error(language === "en" 
          ? "API key not found. Please configure it in settings."
          : "Clave API no encontrada. Por favor, configúrala en ajustes.");
      }
      
      const messageHistory = conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Use Firebase Cloud Functions instead of direct API call
      const aiChatFunction = httpsCallable(functions, 'aiChat');
      
      console.log(`Calling AI model: ${provider}/${model} with ${messageHistory.length} messages`);
      
      try {
        const response = await aiChatFunction({
          messages: messageHistory,
          model: model,
          provider: provider,
          language: language,
          apiKey: apiKey
        });
        
        console.log("AI response received:", response.data);
        
        // @ts-ignore - handle the response data structure
        const aiResponse = response.data?.response || (language === "en" 
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
        // If the cloud function fails, fall back to local response
        if (retryCount > 0) {
          setIsUsingFallback(true);
          toast({
            title: language === "en" ? "Using offline mode" : "Usando modo sin conexión",
            description: language === "en" 
              ? "Switched to offline response mode due to service errors." 
              : "Cambiado a modo de respuesta sin conexión debido a errores de servicio.",
            variant: "default",
          });
          await handleAIRequest(userInput, conversationHistory);
        } else {
          throw functionError;
        }
      }
    } catch (err: any) {
      console.error("Error in AI chat:", err);
      
      let errorMessage = err.message || (language === "en" 
        ? "Failed to get response from AI. Please try again."
        : "Error al obtener respuesta de la IA. Por favor, inténtalo de nuevo.");
        
      // Enhanced error handling with specific error messages
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
      title: language === "en" ? "Switched to Offline Mode" : "Cambiado a Modo Sin Conexión",
      description: language === "en" 
        ? "Using simulated AI responses for common health questions" 
        : "Usando respuestas de IA simuladas para preguntas comunes de salud",
      variant: "default",
    });
    setError(null);
  };

  return (
    <div className="flex flex-col h-full">
      {(!isOnline || isUsingFallback) && (
        <Alert className="m-2 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle>
            {language === "en" ? "Offline Mode" : "Modo Sin Conexión"}
          </AlertTitle>
          <AlertDescription>
            {language === "en" 
              ? "You're currently using simplified AI responses with limited capabilities."
              : "Actualmente estás usando respuestas de IA simplificadas con capacidades limitadas."}
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
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {isUsingFallback ? (
            <span>
              {language === "en" ? "Using offline mode with simulated responses" : "Usando modo sin conexión con respuestas simuladas"}
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
    </div>
  );
};

