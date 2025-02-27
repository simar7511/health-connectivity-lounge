
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Mic, Send, Bot, User, ArrowLeft, Loader2, AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { VoiceRecorder } from "@/components/symptom-checker/VoiceRecorder";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AIHealthAssistantProps {
  language: "en" | "es";
  onBack: () => void;
  patientId?: string;
  model?: string;
}

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

// Greeting messages based on language
const greetings = {
  en: "Hello! I'm your Health Assistant powered by AI. I can answer general health questions while you wait for your provider. How can I help you today?",
  es: "¡Hola! Soy tu Asistente de Salud potenciado por IA. Puedo responder preguntas generales sobre salud mientras esperas a tu proveedor. ¿Cómo puedo ayudarte hoy?"
};

// Common disclaimer based on language
const disclaimers = {
  en: "Please note that I provide general health information, not personalized medical advice. For urgent concerns, please contact your healthcare provider directly.",
  es: "Tenga en cuenta que proporciono información general de salud, no asesoramiento médico personalizado. Para asuntos urgentes, contacte directamente a su proveedor de atención médica."
};

// Error messages based on language
const errorMessages = {
  en: {
    quotaExceeded: "API quota exceeded. Please wait for your quota to reset or use a different API key.",
    invalidKey: "Invalid API key. Please check your API key and try again.",
    networkError: "Network error. Please check your internet connection and try again.",
    default: "An error occurred. Please try again."
  },
  es: {
    quotaExceeded: "Cuota de API excedida. Espere a que su cuota se restablezca o use una clave API diferente.",
    invalidKey: "Clave API inválida. Por favor, verifique su clave API e inténtelo de nuevo.",
    networkError: "Error de red. Compruebe su conexión a Internet e inténtelo de nuevo.",
    default: "Se produjo un error. Inténtelo de nuevo."
  }
};

// Fallback responses for when no API is available
const fallbackResponses = {
  en: {
    greeting: "Hello! I'm your basic Health Assistant. Since there's no API connection, I can only provide very limited responses to common health questions.",
    hypertension: "Hypertension, or high blood pressure, is a common condition where the long-term force of blood against your artery walls is high enough that it may eventually cause health problems. Blood pressure is determined by the amount of blood your heart pumps and the resistance to blood flow in your arteries. The more blood your heart pumps and the narrower your arteries, the higher your blood pressure. You can have hypertension for years without symptoms. Uncontrolled high blood pressure increases your risk of serious health problems, including heart attack and stroke. It's important to have regular blood pressure readings and follow your healthcare provider's advice.",
    diabetes: "Diabetes is a chronic health condition that affects how your body turns food into energy. Most of the food you eat is broken down into sugar (glucose) and released into your bloodstream. When your blood sugar goes up, it signals your pancreas to release insulin, which acts like a key to let the blood sugar into your body's cells for use as energy. With diabetes, your body either doesn't make enough insulin or can't use the insulin it makes as well as it should. When there isn't enough insulin or cells stop responding to insulin, too much blood sugar stays in your bloodstream, which over time can cause serious health problems such as heart disease, vision loss, and kidney disease.",
    covid: "COVID-19 is a respiratory illness caused by the SARS-CoV-2 virus. Common symptoms include fever, cough, shortness of breath, fatigue, muscle or body aches, headache, loss of taste or smell, sore throat, congestion, nausea, and diarrhea. The virus primarily spreads through respiratory droplets when an infected person coughs, sneezes, talks, or breathes. Protection measures include vaccination, wearing masks, maintaining physical distance, and frequent handwashing. If you suspect you have COVID-19, it's important to get tested and follow your healthcare provider's advice.",
    anxiety: "Anxiety is a normal emotion that causes increased alertness, fear, and physical signs, such as a rapid heart rate. However, when anxiety reactions become an on-going issue that interferes with daily life, it could indicate an anxiety disorder. Anxiety disorders can involve repeated episodes of sudden feelings of intense anxiety and fear that reach a peak within minutes (panic attacks). These feelings can interfere with daily activities and are difficult to control. Common anxiety disorders include generalized anxiety disorder, social anxiety disorder, and panic disorder. Treatment often involves psychotherapy, medication, or both.",
    depression: "Depression is a mood disorder that causes a persistent feeling of sadness and loss of interest. It affects how you feel, think, and behave and can lead to a variety of emotional and physical problems. Depression is more than just feeling sad or going through a rough patch; it's a serious mental health condition that requires understanding and treatment. Depression symptoms can vary from mild to severe and can include feeling sad or having a depressed mood, loss of interest in activities once enjoyed, changes in appetite, trouble sleeping or sleeping too much, loss of energy, feelings of worthlessness, difficulty thinking or making decisions, and thoughts of death or suicide. Many people with depression also have anxiety.",
    notSure: "I'm not sure how to respond to that question with my limited capabilities. Please try a more common health topic like hypertension, diabetes, COVID-19, anxiety, or depression. For more specific or detailed information, please use the API feature or consult with your healthcare provider."
  },
  es: {
    greeting: "¡Hola! Soy tu Asistente de Salud básico. Como no hay conexión con la API, solo puedo proporcionar respuestas muy limitadas a preguntas comunes sobre salud.",
    hypertension: "La hipertensión, o presión arterial alta, es una condición común donde la fuerza a largo plazo de la sangre contra las paredes de las arterias es lo suficientemente alta como para causar problemas de salud. La presión arterial está determinada por la cantidad de sangre que bombea el corazón y la resistencia al flujo sanguíneo en las arterias. Cuanta más sangre bombea el corazón y más estrechas son las arterias, mayor es la presión arterial. Puede tener hipertensión durante años sin síntomas. La presión arterial alta no controlada aumenta el riesgo de problemas de salud graves, incluidos ataques cardíacos y accidentes cerebrovasculares. Es importante tener lecturas regulares de la presión arterial y seguir los consejos de su proveedor de atención médica.",
    diabetes: "La diabetes es una afección de salud crónica que afecta la forma en que su cuerpo convierte los alimentos en energía. La mayoría de los alimentos que come se descomponen en azúcar (glucosa) y se liberan en el torrente sanguíneo. Cuando su nivel de azúcar en la sangre sube, le indica al páncreas que libere insulina, que actúa como una llave para permitir que el azúcar en la sangre entre en las células del cuerpo para usarla como energía. Con la diabetes, su cuerpo no produce suficiente insulina o no puede usar la insulina que produce tan bien como debería. Cuando no hay suficiente insulina o las células dejan de responder a la insulina, demasiada azúcar en la sangre permanece en el torrente sanguíneo, lo que con el tiempo puede causar problemas de salud graves como enfermedades cardíacas, pérdida de la visión y enfermedades renales.",
    covid: "COVID-19 es una enfermedad respiratoria causada por el virus SARS-CoV-2. Los síntomas comunes incluyen fiebre, tos, dificultad para respirar, fatiga, dolores musculares o corporales, dolor de cabeza, pérdida del gusto o del olfato, dolor de garganta, congestión, náuseas y diarrea. El virus se propaga principalmente a través de gotitas respiratorias cuando una persona infectada tose, estornuda, habla o respira. Las medidas de protección incluyen vacunación, uso de mascarillas, mantener la distancia física y lavarse las manos con frecuencia. Si sospecha que tiene COVID-19, es importante hacerse la prueba y seguir los consejos de su proveedor de atención médica.",
    anxiety: "La ansiedad es una emoción normal que causa mayor estado de alerta, miedo y signos físicos, como un ritmo cardíaco acelerado. Sin embargo, cuando las reacciones de ansiedad se convierten en un problema continuo que interfiere con la vida diaria, podría indicar un trastorno de ansiedad. Los trastornos de ansiedad pueden involucrar episodios repetidos de sentimientos repentinos de ansiedad intensa y miedo que alcanzan su punto máximo en minutos (ataques de pánico). Estos sentimientos pueden interferir con las actividades diarias y son difíciles de controlar. Los trastornos de ansiedad comunes incluyen el trastorno de ansiedad generalizada, el trastorno de ansiedad social y el trastorno de pánico. El tratamiento a menudo implica psicoterapia, medicación o ambos.",
    depression: "La depresión es un trastorno del estado de ánimo que causa un sentimiento persistente de tristeza y pérdida de interés. Afecta cómo se siente, piensa y se comporta, y puede conducir a una variedad de problemas emocionales y físicos. La depresión es más que simplemente sentirse triste o pasar por un momento difícil; es una condición de salud mental seria que requiere comprensión y tratamiento. Los síntomas de la depresión pueden variar de leves a graves y pueden incluir sentirse triste o tener un estado de ánimo deprimido, pérdida de interés en actividades que antes disfrutaba, cambios en el apetito, problemas para dormir o dormir demasiado, pérdida de energía, sentimientos de inutilidad, dificultad para pensar o tomar decisiones y pensamientos de muerte o suicidio. Muchas personas con depresión también tienen ansiedad.",
    notSure: "No estoy seguro de cómo responder a esa pregunta con mis capacidades limitadas. Por favor, intente un tema de salud más común como hipertensión, diabetes, COVID-19, ansiedad o depresión. Para información más específica o detallada, utilice la función de API o consulte con su proveedor de atención médica."
  }
};

export function AIHealthAssistant({ 
  language, 
  onBack, 
  patientId, 
  model = "gpt-3.5-turbo"
}: AIHealthAssistantProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useVoiceInput, setUseVoiceInput] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem("openai_api_key") || "");
  const [showAPIKeyInput, setShowAPIKeyInput] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentModel, setCurrentModel] = useState(model);
  const [useFallbackMode, setUseFallbackMode] = useState<boolean>(() => {
    return localStorage.getItem("use_fallback_mode") === "true";
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const auth = getAuth();
  const { toast } = useToast();

  // Add initial greeting message when component loads
  useEffect(() => {
    const initialMessage: Message = {
      id: "greeting",
      content: useFallbackMode ? fallbackResponses[language].greeting : greetings[language],
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    
    // Check if API key is stored in localStorage
    const storedKey = localStorage.getItem("openai_api_key");
    if (storedKey && !useFallbackMode) {
      setApiKey(storedKey);
      
      // Also get the model
      const storedModel = localStorage.getItem("openai_model");
      if (storedModel) {
        setCurrentModel(storedModel);
      }
    } else if (!useFallbackMode && !storedKey) {
      setShowAPIKeyInput(true);
    }
  }, [language, useFallbackMode]);

  // Effect to update the model when it changes from props
  useEffect(() => {
    setCurrentModel(model);
  }, [model]);

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load previous conversation if available
  useEffect(() => {
    if (!auth.currentUser || !patientId || useFallbackMode) return;

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
  }, [patientId, auth.currentUser, useFallbackMode]);

  const saveAPIKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("openai_api_key", apiKey);
      localStorage.setItem("openai_model", currentModel);
      
      setShowAPIKeyInput(false);
      setApiError(null);
      toast({
        title: language === "en" ? "Settings Saved" : "Configuración Guardada",
        description: language === "en" 
          ? "Your API settings have been saved."
          : "Tu configuración de API ha sido guardada.",
        variant: "default",
      });
    }
  };

  const toggleFallbackMode = (value: boolean) => {
    setUseFallbackMode(value);
    localStorage.setItem("use_fallback_mode", value.toString());
    
    // Reset messages with new greeting
    const initialMessage: Message = {
      id: "greeting",
      content: value ? fallbackResponses[language].greeting : greetings[language],
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    
    // Show API key input if switching from fallback to API mode
    if (!value && !apiKey) {
      setShowAPIKeyInput(true);
    } else {
      setShowAPIKeyInput(false);
    }
  };

  const callOpenAI = async (userMessage: string, previousMessages: Message[]) => {
    try {
      console.log(`Calling OpenAI API using model: ${currentModel}...`);
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: currentModel,
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

  const getFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("hypertension") || lowerMessage.includes("blood pressure") || 
        lowerMessage.includes("high blood") || lowerMessage.includes("hipertensión") || 
        lowerMessage.includes("presión arterial")) {
      return fallbackResponses[language].hypertension;
    } else if (lowerMessage.includes("diabetes") || lowerMessage.includes("sugar") || 
              lowerMessage.includes("glucose") || lowerMessage.includes("azúcar") || 
              lowerMessage.includes("glucosa")) {
      return fallbackResponses[language].diabetes;
    } else if (lowerMessage.includes("covid") || lowerMessage.includes("coronavirus") || 
              lowerMessage.includes("virus") || lowerMessage.includes("pandemic") || 
              lowerMessage.includes("pandemia")) {
      return fallbackResponses[language].covid;
    } else if (lowerMessage.includes("anxiety") || lowerMessage.includes("anxious") || 
              lowerMessage.includes("worry") || lowerMessage.includes("ansiedad") || 
              lowerMessage.includes("preocupación")) {
      return fallbackResponses[language].anxiety;
    } else if (lowerMessage.includes("depression") || lowerMessage.includes("depressed") || 
              lowerMessage.includes("sad") || lowerMessage.includes("depresión") || 
              lowerMessage.includes("triste")) {
      return fallbackResponses[language].depression;
    } else {
      return fallbackResponses[language].notSure;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Check if API key is available when not in fallback mode
    if (!apiKey && !useFallbackMode) {
      setShowAPIKeyInput(true);
      toast({
        title: language === "en" ? "API Key Required" : "Se Requiere Clave API",
        description: language === "en" 
          ? "Please enter your API key to continue." 
          : "Por favor, ingrese su clave API para continuar.",
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
      let aiResponseText = "";
      
      // Add to Firestore if not in fallback mode
      if (auth.currentUser && !useFallbackMode) {
        await addDoc(collection(db, "aiChatHistory"), {
          content: userMessage.content,
          sender: userMessage.sender,
          timestamp: serverTimestamp(),
          userId: patientId || auth.currentUser.uid,
        });
      }
      
      if (useFallbackMode) {
        // Use the fallback response system
        aiResponseText = getFallbackResponse(input) + " " + disclaimers[language];
      } else {
        // Call OpenAI API
        const aiResponse = await callOpenAI(input, messages);
        aiResponseText = aiResponse + " " + disclaimers[language];
      }
      
      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: aiResponseText,
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Add AI response to Firestore if not in fallback mode
      if (auth.currentUser && !useFallbackMode) {
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
      
      // Suggest fallback mode after error
      if (!useFallbackMode) {
        toast({
          title: language === "en" ? "Try Offline Mode" : "Probar Modo Offline",
          description: language === "en" 
            ? "You can switch to offline mode to use basic responses without requiring an API key." 
            : "Puede cambiar al modo offline para usar respuestas básicas sin necesitar una clave API.",
          variant: "default",
        });
      }
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

  const refreshPage = () => {
    window.location.reload();
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
            {!useFallbackMode && (
              <span className="ml-2 text-xs text-muted-foreground">
                (OpenAI - {currentModel})
              </span>
            )}
            {useFallbackMode && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({language === "en" ? "offline mode" : "modo offline"})
              </span>
            )}
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={refreshPage}
          title={language === "en" ? "Refresh" : "Actualizar"}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      {showAPIKeyInput ? (
        <CardContent className="flex-1 p-6 flex flex-col items-center justify-center gap-4">
          <div className="text-center max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-semibold">
              {language === "en" ? "OpenAI API Settings" : "Configuración API de OpenAI"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "en" 
                ? "Please enter your OpenAI API key to use the Health Assistant." 
                : "Por favor, ingrese su clave API de OpenAI para usar el Asistente de Salud."}
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
          
          <div className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between space-x-2 py-2">
              <Label htmlFor="offline-mode" className="text-base flex items-center gap-2">
                {language === "en" ? "Use Offline Mode" : "Usar Modo Offline"}
                <span className="text-xs text-muted-foreground">(no API key required)</span>
              </Label>
              <Switch
                id="offline-mode"
                checked={useFallbackMode}
                onCheckedChange={toggleFallbackMode}
              />
            </div>
            
            {!useFallbackMode && (
              <>
                <div className="space-y-2">
                  <label htmlFor="apiKey" className="text-sm font-medium">
                    {language === "en" ? "OpenAI API Key" : "Clave API de OpenAI"}
                  </label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="model" className="text-sm font-medium">
                    {language === "en" ? "Model" : "Modelo"}
                  </label>
                  <Select value={currentModel} onValueChange={setCurrentModel}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select model" : "Seleccionar modelo"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster, less quota)</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini (Balanced)</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o (Advanced, more quota)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={saveAPIKey} 
                  className="w-full"
                  disabled={!apiKey.trim()}
                >
                  {language === "en" ? "Save Settings" : "Guardar Configuración"}
                </Button>
                
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {language === "en" 
                    ? "You can get an API key from platform.openai.com. The key is stored locally in your browser and never sent to our servers." 
                    : "Puede obtener una clave API en platform.openai.com. La clave se almacena localmente en su navegador y nunca se envía a nuestros servidores."}
                </p>
              </>
            )}
            
            {useFallbackMode && (
              <div className="space-y-3">
                <Alert className="bg-primary/10 border-primary/20">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    {language === "en" 
                      ? "Offline mode uses pre-defined responses for common health topics without requiring an API key. Topics include: hypertension, diabetes, COVID-19, anxiety, and depression." 
                      : "El modo offline utiliza respuestas predefinidas para temas comunes de salud sin requerir una clave API. Los temas incluyen: hipertensión, diabetes, COVID-19, ansiedad y depresión."}
                  </AlertDescription>
                </Alert>
                
                <Button 
                  onClick={() => setShowAPIKeyInput(false)} 
                  className="w-full"
                >
                  {language === "en" ? "Continue with Offline Mode" : "Continuar con Modo Offline"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      ) : (
        <>
          <CardContent className="flex-1 p-4 overflow-hidden">
            {apiError && !useFallbackMode && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {language === "en" ? "API Error" : "Error de API"}
                </AlertTitle>
                <AlertDescription className="flex flex-col gap-2">
                  <span>{errorMessages[language][apiError as keyof typeof errorMessages.en]}</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleChangeAPIKey}
                      className="self-start"
                    >
                      {language === "en" ? "Change API Settings" : "Cambiar Configuración API"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleFallbackMode(true)}
                      className="self-start"
                    >
                      {language === "en" ? "Switch to Offline Mode" : "Cambiar a Modo Offline"}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {useFallbackMode && (
              <Alert className="mb-4 bg-primary/10 border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <AlertTitle>
                  {language === "en" ? "Offline Mode Active" : "Modo Offline Activo"}
                </AlertTitle>
                <AlertDescription className="flex flex-col gap-2">
                  <span>
                    {language === "en" 
                      ? "You're using offline mode with limited pre-defined responses. Try asking about: hypertension, diabetes, COVID-19, anxiety, or depression." 
                      : "Está utilizando el modo offline con respuestas predefinidas limitadas. Intente preguntar sobre: hipertensión, diabetes, COVID-19, ansiedad o depresión."}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => toggleFallbackMode(false)}
                    className="mt-1 self-start"
                  >
                    {language === "en" ? "Switch to API Mode" : "Cambiar a Modo API"}
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
