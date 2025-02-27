
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Mic, Send, Bot, User, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { VoiceRecorder } from "@/components/symptom-checker/VoiceRecorder";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

// Error messages based on language
const errorMessages = {
  en: {
    quotaExceeded: "OpenAI API quota exceeded. Please try again later or use a different API key.",
    invalidKey: "Invalid API key. Please check your API key and try again.",
    networkError: "Network error. Please check your internet connection and try again.",
    default: "An error occurred. Please try again."
  },
  es: {
    quotaExceeded: "Cuota de API de OpenAI excedida. Intente de nuevo más tarde o use una clave API diferente.",
    invalidKey: "Clave API inválida. Por favor, verifique su clave API e inténtelo de nuevo.",
    networkError: "Error de red. Compruebe su conexión a Internet e inténtelo de nuevo.",
    default: "Se produjo un error. Inténtelo de nuevo."
  }
};

export function AIHealthAssistant({ language, onBack, patientId }: AIHealthAssistantProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useVoiceInput, setUseVoiceInput] = useState(false);
  const [openAIKey, setOpenAIKey] = useState<string>("");
  const [showAPIKeyInput, setShowAPIKeyInput] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
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
    
    // Check if OpenAI API key is stored in localStorage
    const storedKey = localStorage.getItem("openai_api_key");
    if (storedKey) {
      setOpenAIKey(storedKey);
    } else {
      setShowAPIKeyInput(true);
    }
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

  const saveAPIKey = () => {
    if (openAIKey.trim()) {
      localStorage.setItem("openai_api_key", openAIKey);
      setShowAPIKeyInput(false);
      setApiError(null);
      toast({
        title: language === "en" ? "API Key Saved" : "Clave API Guardada",
        description: language === "en" 
          ? "Your OpenAI API key has been saved for this session."
          : "Tu clave API de OpenAI ha sido guardada para esta sesión.",
        variant: "default",
      });
    }
  };

  const callOpenAI = async (userMessage: string, previousMessages: Message[]) => {
    try {
      console.log("Calling OpenAI API...");
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAIKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: language === "en" 
                ? "You are a friendly, helpful health assistant. Provide general health information and advice while making it clear you are not a substitute for professional medical advice. Always be considerate to patient concerns, avoid medical jargon, and include reminders to seek professional care for serious symptoms or urgent conditions."
                : "Eres un asistente de salud amigable y útil. Proporciona información general de salud y consejos, dejando claro que no eres un sustituto del consejo médico profesional. Sé siempre considerado con las preocupaciones del paciente, evita la jerga médica e incluye recordatorios para buscar atención profesional para síntomas graves o condiciones urgentes."
            },
            ...previousMessages.map(msg => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.content
            })),
            { role: "user", content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      // Check for specific error status codes
      if (!response.ok) {
        console.error("OpenAI API error:", response.status, response.statusText);
        
        // Parse the error response if possible
        const errorData = await response.json().catch(() => null);
        console.log("Error data:", errorData);
        
        if (response.status === 429) {
          // Rate limit or quota exceeded
          setApiError("quotaExceeded");
          throw new Error("API request rate limit or quota exceeded");
        } else if (response.status === 401) {
          // Invalid API key
          setApiError("invalidKey");
          throw new Error("Invalid API key");
        } else {
          setApiError("default");
          throw new Error(`API request failed with status ${response.status}`);
        }
      }

      // Clear any previous errors
      setApiError(null);
      
      const data = await response.json();
      console.log("OpenAI API response:", data);
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      
      // Set appropriate error message if not already set
      if (!apiError) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
          setApiError("networkError");
        } else {
          setApiError("default");
        }
      }
      
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Check if API key is available
    if (!openAIKey) {
      setShowAPIKeyInput(true);
      toast({
        title: language === "en" ? "API Key Required" : "Se Requiere Clave API",
        description: language === "en" 
          ? "Please enter your OpenAI API key to continue." 
          : "Por favor, ingrese su clave API de OpenAI para continuar.",
        variant: "destructive",
      });
      return;
    }
    
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
    setApiError(null); // Clear previous errors
    
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
      
      // Call OpenAI directly
      const aiResponse = await callOpenAI(input, messages);
      const aiResponseText = aiResponse + " " + disclaimers[language];
      
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
      
      // Display error message to user
      const errorKey = apiError || "default";
      toast({
        title: language === "en" ? "Error" : "Error",
        description: errorMessages[language][errorKey as keyof typeof errorMessages.en],
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangeAPIKey = () => {
    setShowAPIKeyInput(true);
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
      
      {showAPIKeyInput ? (
        <CardContent className="flex-1 p-6 flex flex-col items-center justify-center gap-4">
          <div className="text-center max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-semibold">
              {language === "en" ? "OpenAI API Key Required" : "Se Requiere Clave API de OpenAI"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "en" 
                ? "Please enter your OpenAI API key to use the Health Assistant. Your key will be stored locally in your browser." 
                : "Por favor, ingrese su clave API de OpenAI para usar el Asistente de Salud. Su clave se almacenará localmente en su navegador."}
            </p>
          </div>
          
          {apiError && (
            <Alert variant="destructive" className="my-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {language === "en" ? "API Error" : "Error de API"}
              </AlertTitle>
              <AlertDescription>
                {errorMessages[language][apiError as keyof typeof errorMessages.en]}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="w-full max-w-md space-y-2">
            <Input
              type="password"
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              placeholder={language === "en" ? "sk-..." : "sk-..."}
              className="w-full"
            />
            <Button 
              onClick={saveAPIKey} 
              className="w-full"
              disabled={!openAIKey.trim()}
            >
              {language === "en" ? "Save API Key" : "Guardar Clave API"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4 max-w-md text-center">
            {language === "en" 
              ? "You can get an API key from OpenAI's website. This key will only be stored in your browser and is never sent to our servers." 
              : "Puede obtener una clave API en el sitio web de OpenAI. Esta clave solo se almacenará en su navegador y nunca se enviará a nuestros servidores."}
          </p>
        </CardContent>
      ) : (
        <>
          <CardContent className="flex-1 p-4 overflow-hidden">
            {apiError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {language === "en" ? "API Error" : "Error de API"}
                </AlertTitle>
                <AlertDescription className="flex flex-col gap-2">
                  <span>{errorMessages[language][apiError as keyof typeof errorMessages.en]}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleChangeAPIKey}
                    className="mt-1 self-start"
                  >
                    {language === "en" ? "Change API Key" : "Cambiar Clave API"}
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
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
        </>
      )}
    </Card>
  );
}
