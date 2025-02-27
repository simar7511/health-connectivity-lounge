
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Mic, Send, StopCircle, Bot, User, ArrowLeft, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { VoiceRecorder } from "@/components/symptom-checker/VoiceRecorder";

interface AIHealthAssistantProps {
  language: "en" | "es";
  onBack: () => void;
  patientId?: string;
}

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

// Greeting messages based on language
const greetings = {
  en: "Hello! I'm your Health Assistant powered by GPT-4. I can answer general health questions while you wait for your provider. How can I help you today?",
  es: "¡Hola! Soy tu Asistente de Salud potenciado por GPT-4. Puedo responder preguntas generales sobre salud mientras esperas a tu proveedor. ¿Cómo puedo ayudarte hoy?"
};

// Common disclaimer based on language
const disclaimers = {
  en: "Please note that I provide general health information, not personalized medical advice. For urgent concerns, please contact your healthcare provider directly.",
  es: "Tenga en cuenta que proporciono información general de salud, no asesoramiento médico personalizado. Para asuntos urgentes, contacte directamente a su proveedor de atención médica."
};

export function AIHealthAssistant({ language, onBack, patientId }: AIHealthAssistantProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useVoiceInput, setUseVoiceInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const auth = getAuth();
  const { toast } = useToast();

  // Add initial greeting message when component loads
  useEffect(() => {
    const initialMessage: Message = {
      id: "greeting",
      content: greetings[language],
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [language]);

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load previous conversation if available
  useEffect(() => {
    if (!auth.currentUser || !patientId) return;

    const q = query(
      collection(db, "aiChatHistory"),
      where("userId", "==", patientId || auth.currentUser.uid),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        loadedMessages.push({
          id: doc.id,
          content: data.content,
          sender: data.sender,
          timestamp: data.timestamp.toDate(),
        });
      });

      if (loadedMessages.length > 0) {
        setMessages(loadedMessages);
      }
    });

    return () => unsubscribe();
  }, [patientId, auth.currentUser]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    
    try {
      // Add to Firestore
      if (auth.currentUser) {
        await addDoc(collection(db, "aiChatHistory"), {
          content: userMessage.content,
          sender: userMessage.sender,
          timestamp: serverTimestamp(),
          userId: patientId || auth.currentUser.uid,
        });
      }
      
      // Call the OpenAI GPT-4 API through our edge function
      const response = await fetch("/api/ai-health-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          language: language,
          previousMessages: messages.map(msg => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText = data.response + " " + disclaimers[language];
      
      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: aiResponseText,
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Add AI response to Firestore
      if (auth.currentUser) {
        await addDoc(collection(db, "aiChatHistory"), {
          content: aiMessage.content,
          sender: aiMessage.sender,
          timestamp: serverTimestamp(),
          userId: patientId || auth.currentUser.uid,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "Failed to send message. Please try again." 
          : "No se pudo enviar el mensaje. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = (fieldName: string, voiceText: string) => {
    setInput(voiceText);
    setUseVoiceInput(false);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 border-b flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-lg flex items-center">
            <Bot className="mr-2 h-5 w-5 text-primary" />
            {language === "en" ? "Health Assistant (GPT-4)" : "Asistente de Salud (GPT-4)"}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="h-[calc(100%-1rem)]">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`p-1 rounded-full ${
                      message.sender === "user" ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="h-6 w-6 text-primary" />
                    ) : (
                      <Bot className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString(language === "en" ? "en-US" : "es", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="p-1 rounded-full bg-muted">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div className="rounded-lg p-3 bg-muted text-foreground">
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <p className="text-sm">
                        {language === "en" ? "Thinking..." : "Pensando..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="border-t p-3 gap-2">
        {useVoiceInput ? (
          <div className="w-full">
            <VoiceRecorder
              language={language}
              fieldName="message"
              onVoiceInput={handleVoiceInput}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUseVoiceInput(false)}
              className="mt-2 w-full"
            >
              {language === "en" ? "Cancel" : "Cancelar"}
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setUseVoiceInput(true)}
              className="shrink-0"
            >
              <Mic className="h-5 w-5" />
            </Button>
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  language === "en"
                    ? "Type your health question..."
                    : "Escriba su pregunta de salud..."
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || isProcessing}
                onClick={handleSendMessage}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
