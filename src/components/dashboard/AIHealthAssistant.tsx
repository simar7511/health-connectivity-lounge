
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Send, User, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from "firebase/firestore";

// Add isOnline prop to the component
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial system message based on language
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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Load chat history if patientId is provided
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

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: serverTimestamp()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);
    
    try {
      // Save user message to Firestore if patientId exists
      if (patientId) {
        await addDoc(collection(db, "aiChats"), {
          patientId,
          ...userMessage
        });
      }
      
      // Determine which API to use based on connectivity
      let apiUrl = "/api/ai-chat";
      let apiKey = "";
      
      if (!isOnline) {
        // Use local model when offline
        apiUrl = "/api/local-ai-chat";
        apiKey = localStorage.getItem("huggingface_token") || "";
      } else if (provider === "openai") {
        apiKey = localStorage.getItem("openai_api_key") || "";
      } else if (provider === "llama") {
        apiKey = localStorage.getItem("huggingface_token") || "";
      }
      
      if (!apiKey) {
        throw new Error(language === "en" 
          ? "API key not found. Please configure it in settings."
          : "Clave API no encontrada. Por favor, configúrala en ajustes.");
      }
      
      // Prepare conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add user's latest message
      conversationHistory.push({
        role: "user",
        content: input
      });
      
      // Make API request
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          messages: conversationHistory,
          model: model,
          provider: provider,
          language: language
        })
      });
      
      if (!response.ok) {
        throw new Error(language === "en" 
          ? `Server error: ${response.status}`
          : `Error del servidor: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Create assistant message
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || (language === "en" ? "I'm sorry, I couldn't generate a response." : "Lo siento, no pude generar una respuesta."),
        timestamp: serverTimestamp()
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Save assistant message to Firestore if patientId exists
      if (patientId) {
        await addDoc(collection(db, "aiChats"), {
          patientId,
          ...assistantMessage
        });
      }
    } catch (err: any) {
      console.error("Error in AI chat:", err);
      setError(err.message || (language === "en" 
        ? "Failed to get response from AI. Please try again."
        : "Error al obtener respuesta de la IA. Por favor, inténtalo de nuevo."));
      
      // Add error message to chat
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
      {/* Connection status indicator */}
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
      
      {/* Error message */}
      {error && (
        <Alert variant="destructive" className="m-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {language === "en" ? "Error" : "Error"}
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Chat messages */}
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
      
      {/* Input area */}
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
          {language === "en" 
            ? `Using ${provider === "openai" ? "OpenAI" : "Llama"} ${model} model`
            : `Usando modelo ${provider === "openai" ? "OpenAI" : "Llama"} ${model}`}
        </p>
      </div>
    </div>
  );
};
