
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Send, User, AlertCircle, Loader2, RefreshCw, Settings } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, getDocs, limit } from "firebase/firestore";
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

// Pre-defined offline responses for basic questions
const OFFLINE_RESPONSES = {
  en: {
    greeting: "Hello! I'm your AI assistant (offline mode). How can I help you?",
    appointment: "To book an appointment, please go to the Appointments section once you're back online.",
    form: "I can help you fill out forms once you're back online. Please check your connection.",
    medical: "I can't provide medical advice in offline mode. Please consult with a healthcare professional.",
    fallback: "I'm sorry, I can't help with that in offline mode. Please try again when you're online."
  },
  es: {
    greeting: "¡Hola! Soy tu asistente de IA (modo sin conexión). ¿Cómo puedo ayudarte?",
    appointment: "Para reservar una cita, ve a la sección de Citas cuando vuelvas a estar en línea.",
    form: "Puedo ayudarte a completar formularios cuando vuelvas a estar en línea. Por favor, verifica tu conexión.",
    medical: "No puedo proporcionar asesoramiento médico en modo sin conexión. Por favor, consulta con un profesional de la salud.",
    fallback: "Lo siento, no puedo ayudar con eso en modo sin conexión. Por favor, inténtalo de nuevo cuando estés en línea."
  }
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
  const [conversationContext, setConversationContext] = useState<string>("");
  const [apiCallCount, setApiCallCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const functions = getFunctions();
  const MAX_API_CALLS = 50; // Set a reasonable limit to prevent overuse
  const MAX_RETRIES = 3;

  // Initialize system message based on language
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

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Load conversation history from Firestore
  useEffect(() => {
    if (!patientId) return;
    
    try {
      const q = query(
        collection(db, "aiChats"),
        where("patientId", "==", patientId),
        orderBy("timestamp", "desc"),
        limit(15) // Limit to recent messages for context
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
        
        // Reverse to get chronological order
        if (loadedMessages.length > 0) {
          setMessages(loadedMessages.reverse());
          
          // Build conversation context from previous messages
          const contextBuilder = loadedMessages
            .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join("\n");
          
          setConversationContext(contextBuilder);
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

  // Function to determine the appropriate offline response
  const getOfflineResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    const responses = language === "en" ? OFFLINE_RESPONSES.en : OFFLINE_RESPONSES.es;
    
    if (input.includes("appointment") || input.includes("book") || input.includes("cita") || input.includes("reservar")) {
      return responses.appointment;
    } else if (input.includes("form") || input.includes("fill") || input.includes("formulario") || input.includes("llenar")) {
      return responses.form;
    } else if (input.includes("doctor") || input.includes("medical") || input.includes("health") || input.includes("médico") || input.includes("salud")) {
      return responses.medical;
    }
    
    return responses.fallback;
  };

  // Handle retry of last user message
  const handleRetry = useCallback(() => {
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
        
        // Call handleAIRequest with the last user message
        handleAIRequest(userMessage.content, newMessages);
      }
    }
  }, [messages]);

  // Handle sending a new message
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
      
      if (!isOnline) {
        // Handle offline mode with predefined responses
        const offlineResponse = getOfflineResponse(input);
        const assistantMessage: Message = {
          role: "assistant",
          content: offlineResponse,
          timestamp: serverTimestamp()
        };
        
        setTimeout(() => {
          setMessages((prev) => [...prev, assistantMessage]);
          if (patientId) {
            addDoc(collection(db, "aiChats"), {
              patientId,
              ...assistantMessage
            });
          }
        }, 1000); // Simulate thinking time
        
        return;
      }
      
      await handleAIRequest(input, [...messages, userMessage]);
      
    } catch (err: any) {
      console.error("Error in chat message handling:", err);
      setError(language === "en" 
        ? "Failed to send message. Please try again."
        : "Error al enviar el mensaje. Por favor, inténtalo de nuevo.");
    }
  };

  // Main function to handle AI requests with fallback and retry logic
  const handleAIRequest = async (userInput: string, conversationHistory: Message[], currentRetry = 0) => {
    if (apiCallCount >= MAX_API_CALLS) {
      setError(language === "en"
        ? "You've reached the maximum number of AI requests for this session. Please try again later."
        : "Has alcanzado el número máximo de solicitudes de IA para esta sesión. Por favor, inténtalo más tarde.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Automatically select API key from environment or local storage
      let apiKey = "";
      let currentProvider = provider;
      let currentModel = model;
      
      // Try to get API key from environment first (if configured in Firebase functions)
      const getEnvApiKey = httpsCallable(functions, 'getApiKey');
      try {
        const envResult = await getEnvApiKey({ provider: currentProvider });
        // @ts-ignore - handle environment API key response
        if (envResult.data && envResult.data.apiKey) {
          // @ts-ignore
          apiKey = envResult.data.apiKey;
          console.log(`Using environment API key for ${currentProvider}`);
        }
      } catch (envError) {
        console.log("No environment API key available, falling back to local storage");
      }
      
      // If no environment API key, try local storage
      if (!apiKey) {
        if (currentProvider === "openai") {
          apiKey = localStorage.getItem("openai_api_key") || "";
        } else if (currentProvider === "llama") {
          apiKey = localStorage.getItem("huggingface_token") || "";
        }
      }
      
      // If still no API key and we haven't tried fallback yet, switch providers
      if (!apiKey && currentRetry === 0) {
        // Try the alternative provider
        currentProvider = currentProvider === "openai" ? "llama" : "openai";
        currentModel = currentProvider === "openai" ? "gpt-4o" : "llama-2-7b-chat";
        
        console.log(`No API key for ${provider}, trying ${currentProvider} instead`);
        
        if (currentProvider === "openai") {
          apiKey = localStorage.getItem("openai_api_key") || "";
        } else {
          apiKey = localStorage.getItem("huggingface_token") || "";
        }
        
        // If we still don't have an API key, show error
        if (!apiKey) {
          throw new Error(language === "en" 
            ? "API keys not configured. Please set up API keys in settings."
            : "Claves API no configuradas. Por favor, configura las claves API en ajustes.");
        }
      }
      
      if (!apiKey) {
        throw new Error(language === "en" 
          ? "API key not found. Please configure it in settings."
          : "Clave API no encontrada. Por favor, configúrala en ajustes.");
      }
      
      // Prepare messages with conversation context
      const messageHistory = conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add conversation memory to provide context
      if (conversationContext && messageHistory.length > 2) {
        messageHistory.unshift({
          role: "system",
          content: `Previous conversation context:\n${conversationContext}\n\nPlease continue the conversation naturally.`
        });
      }
      
      // Add medical disclaimer to system instructions
      messageHistory.unshift({
        role: "system",
        content: language === "en"
          ? "You are a helpful AI assistant providing health information. IMPORTANT: Always clarify that you are not a doctor and cannot provide medical diagnoses. For any serious medical concerns, advise users to consult a healthcare professional."
          : "Eres un asistente de IA útil que proporciona información de salud. IMPORTANTE: Siempre aclara que no eres un médico y no puedes proporcionar diagnósticos médicos. Para cualquier problema médico grave, aconseja a los usuarios que consulten a un profesional de la salud."
      });
      
      // Use Firebase Cloud Functions for AI chat
      const aiChatFunction = httpsCallable(functions, 'aiChat');
      
      console.log(`Calling AI model: ${currentProvider}/${currentModel} with ${messageHistory.length} messages`);
      
      const response = await aiChatFunction({
        messages: messageHistory,
        model: currentModel,
        provider: currentProvider,
        language: language,
        apiKey: apiKey
      });
      
      console.log("AI response received:", response.data);
      setApiCallCount(prev => prev + 1);
      
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
      
      // Update conversation context with new messages
      setConversationContext(prev => 
        `${prev}\nUser: ${userInput}\nAssistant: ${aiResponse}`
      );
      
    } catch (err: any) {
      console.error("Error in AI chat:", err);
      
      // Log error to Firestore for admin notification
      try {
        await addDoc(collection(db, "aiErrors"), {
          error: err.message || "Unknown error",
          provider,
          model,
          timestamp: serverTimestamp(),
          patientId
        });
      } catch (logErr) {
        console.error("Failed to log error:", logErr);
      }
      
      // Attempt retry with alternative model if available
      if (currentRetry < MAX_RETRIES) {
        console.log(`Retry attempt ${currentRetry + 1} of ${MAX_RETRIES}`);
        
        // Switch provider if first retry
        const fallbackProvider = provider === "openai" ? "llama" : "openai";
        const fallbackModel = fallbackProvider === "openai" ? "gpt-4o" : "llama-2-7b-chat";
        
        setIsLoading(false);
        return handleAIRequest(userInput, conversationHistory, currentRetry + 1);
      }
      
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

  return (
    <div className="flex flex-col h-full">
      {!isOnline && (
        <Alert className="m-2 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle>
            {language === "en" ? "Offline Mode" : "Modo Sin Conexión"}
          </AlertTitle>
          <AlertDescription>
            {language === "en" 
              ? "You're currently offline. Using local AI model with limited capabilities."
              : "Actualmente estás sin conexión. Usando modelo de IA local con capacidades limitadas."}
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
        <p className="text-xs text-muted-foreground mt-2 flex justify-between items-center">
          <span>
            {language === "en" 
              ? `Using ${provider === "openai" ? "OpenAI" : "Llama"} ${model} model`
              : `Usando modelo ${provider === "openai" ? "OpenAI" : "Llama"} ${model}`}
          </span>
          <span>
            {apiCallCount > 0 && `${apiCallCount}/${MAX_API_CALLS}`}
          </span>
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
            <Button onClick={() => setShowTroubleshootingDialog(false)}>
              {language === "en" ? "Close" : "Cerrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
