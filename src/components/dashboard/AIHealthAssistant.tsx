
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

// Medical knowledge base with common questions and answers
const medicalKnowledgeBase = {
  en: [
    {
      keywords: ["fever", "temperature", "high temperature"],
      response: "For fever management: 1) Stay hydrated 2) Rest 3) Consider over-the-counter medications like acetaminophen or ibuprofen following package instructions 4) Seek medical attention if fever exceeds 103°F (39.4°C) in adults, is accompanied by severe headache, unusual skin rash, neck stiffness, or persists longer than 3 days."
    },
    {
      keywords: ["cold", "flu", "cough", "sore throat"],
      response: "For cold and flu symptoms: 1) Rest as much as possible 2) Stay hydrated 3) Use over-the-counter medications to relieve symptoms 4) Consider throat lozenges for sore throat 5) Use a humidifier 6) Seek medical attention if symptoms worsen or don't improve after 7-10 days."
    },
    {
      keywords: ["headache", "migraine", "head pain"],
      response: "For headache management: 1) Rest in a quiet, dark room 2) Apply a cool compress to your forehead 3) Stay hydrated 4) Consider over-the-counter pain relievers 5) For recurrent or severe headaches, please consult with your healthcare provider."
    },
    {
      keywords: ["rash", "skin", "itchy", "itching"],
      response: "For skin rashes: 1) Avoid scratching 2) Apply a cool compress 3) Use over-the-counter hydrocortisone cream for itching 4) Take an antihistamine if appropriate 5) Seek medical attention if the rash is widespread, painful, blistering, or accompanied by fever."
    },
    {
      keywords: ["stomach", "nausea", "vomiting", "diarrhea"],
      response: "For stomach issues: 1) Stay hydrated with small sips of water or electrolyte solutions 2) Avoid solid foods until feeling better 3) Gradually reintroduce bland foods 4) Seek medical attention if symptoms persist beyond 2 days, or if there's severe pain, high fever, or signs of dehydration."
    },
    {
      keywords: ["medication", "medicine", "prescription", "drug"],
      response: "For medication safety: 1) Always take medications as prescribed 2) Don't stop medication without consulting your provider 3) Store medications properly 4) Be aware of potential interactions 5) Contact your provider if you experience unexpected side effects."
    },
    {
      keywords: ["emergency", "urgent", "severe", "911"],
      response: "If you're experiencing a medical emergency such as severe chest pain, difficulty breathing, severe bleeding, or signs of stroke, please call 911 or go to the nearest emergency room immediately. This AI assistant cannot provide emergency assistance."
    }
  ],
  es: [
    {
      keywords: ["fiebre", "temperatura", "temperatura alta"],
      response: "Para el manejo de la fiebre: 1) Manténgase hidratado 2) Descanse 3) Considere medicamentos de venta libre como acetaminofén o ibuprofeno siguiendo las instrucciones del paquete 4) Busque atención médica si la fiebre supera los 39.4°C en adultos, está acompañada de dolor de cabeza intenso, erupción cutánea inusual, rigidez en el cuello o persiste más de 3 días."
    },
    {
      keywords: ["resfriado", "gripe", "tos", "dolor de garganta"],
      response: "Para síntomas de resfriado y gripe: 1) Descanse lo más posible 2) Manténgase hidratado 3) Use medicamentos de venta libre para aliviar los síntomas 4) Considere pastillas para la garganta 5) Use un humidificador 6) Busque atención médica si los síntomas empeoran o no mejoran después de 7-10 días."
    },
    {
      keywords: ["dolor de cabeza", "migraña", "dolor en la cabeza"],
      response: "Para el manejo del dolor de cabeza: 1) Descanse en una habitación tranquila y oscura 2) Aplique una compresa fría en la frente 3) Manténgase hidratado 4) Considere analgésicos de venta libre 5) Para dolores de cabeza recurrentes o severos, consulte con su proveedor de atención médica."
    },
    {
      keywords: ["erupción", "piel", "picazón", "comezón"],
      response: "Para erupciones cutáneas: 1) Evite rascarse 2) Aplique una compresa fría 3) Use crema de hidrocortisona de venta libre para la picazón 4) Tome un antihistamínico si es apropiado 5) Busque atención médica si la erupción es generalizada, dolorosa, con ampollas o acompañada de fiebre."
    },
    {
      keywords: ["estómago", "náusea", "vómito", "diarrea"],
      response: "Para problemas estomacales: 1) Manténgase hidratado con pequeños sorbos de agua o soluciones electrolíticas 2) Evite alimentos sólidos hasta sentirse mejor 3) Reintroduzca gradualmente alimentos blandos 4) Busque atención médica si los síntomas persisten más de 2 días, o si hay dolor intenso, fiebre alta o signos de deshidratación."
    },
    {
      keywords: ["medicamento", "medicina", "receta", "fármaco"],
      response: "Para seguridad con medicamentos: 1) Siempre tome los medicamentos según lo prescrito 2) No deje de tomar medicamentos sin consultar a su proveedor 3) Almacene los medicamentos adecuadamente 4) Esté atento a posibles interacciones 5) Contacte a su proveedor si experimenta efectos secundarios inesperados."
    },
    {
      keywords: ["emergencia", "urgente", "grave", "911"],
      response: "Si está experimentando una emergencia médica como dolor intenso en el pecho, dificultad para respirar, sangrado severo o signos de derrame cerebral, llame al 911 o vaya a la sala de emergencias más cercana inmediatamente. Este asistente de IA no puede proporcionar asistencia de emergencia."
    }
  ]
};

// Default responses when no match is found in the knowledge base
const defaultResponses = {
  en: [
    "I'm not able to provide specific medical advice about your condition. Please consider reaching out to your healthcare provider for personalized guidance.",
    "This question might require personalized medical insight. I recommend discussing this with your healthcare provider for the most accurate guidance.",
    "For this particular concern, it would be best to consult with your healthcare provider who knows your medical history.",
    "While I can provide general health information, your specific question would be better addressed by your healthcare provider.",
    "I'd recommend discussing this with your healthcare provider who can give you personalized advice based on your medical history."
  ],
  es: [
    "No puedo proporcionar consejos médicos específicos sobre su condición. Por favor, considere comunicarse con su proveedor de atención médica para obtener orientación personalizada.",
    "Esta pregunta podría requerir conocimiento médico personalizado. Le recomiendo que hable con su proveedor de atención médica para obtener la orientación más precisa.",
    "Para esta preocupación en particular, sería mejor consultar con su proveedor de atención médica que conoce su historial médico.",
    "Si bien puedo proporcionar información general sobre salud, su pregunta específica sería mejor abordada por su proveedor de atención médica.",
    "Le recomendaría hablar de esto con su proveedor de atención médica, quien puede darle consejos personalizados basados en su historial médico."
  ]
};

// Greeting messages based on language
const greetings = {
  en: "Hello! I'm your Health Assistant. I can answer general health questions while you wait for your provider. How can I help you today?",
  es: "¡Hola! Soy tu Asistente de Salud. Puedo responder preguntas generales sobre salud mientras esperas a tu proveedor. ¿Cómo puedo ayudarte hoy?"
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

  const findResponseInKnowledgeBase = (query: string): string | null => {
    const queryLower = query.toLowerCase();
    const kb = medicalKnowledgeBase[language];
    
    for (const item of kb) {
      if (item.keywords.some(keyword => queryLower.includes(keyword))) {
        return item.response;
      }
    }
    
    return null;
  };

  const getDefaultResponse = (): string => {
    const responses = defaultResponses[language];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  };

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
      
      // Find response in knowledge base or get default response
      let responseText = findResponseInKnowledgeBase(input);
      
      if (!responseText) {
        responseText = getDefaultResponse() + " " + disclaimers[language];
      }
      
      // Simulate AI processing delay
      setTimeout(async () => {
        const aiMessage: Message = {
          id: Date.now().toString(),
          content: responseText as string,
          sender: "ai",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsProcessing(false);
        
        // Add AI response to Firestore
        if (auth.currentUser) {
          await addDoc(collection(db, "aiChatHistory"), {
            content: aiMessage.content,
            sender: aiMessage.sender,
            timestamp: serverTimestamp(),
            userId: patientId || auth.currentUser.uid,
          });
        }
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsProcessing(false);
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "Failed to send message. Please try again." 
          : "No se pudo enviar el mensaje. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
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
            {language === "en" ? "Health Assistant" : "Asistente de Salud"}
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
