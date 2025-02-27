
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Mic, Send, Bot, User, ArrowLeft, Loader2, AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/lib/firebase";
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
  provider?: string;
}

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

// Hugging Face Spaces API URL - replace with your deployed Space URL when you have it
// For direct Hugging Face Inference API (bypass Spaces)
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/meta-llama";

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

// System prompts by provider and language
const systemPrompts = {
  openai: {
    en: "You are a friendly, helpful health assistant. Provide general health information and advice while making it clear you are not a substitute for professional medical advice. Always be considerate to patient concerns, avoid medical jargon, and include reminders to seek professional care for serious symptoms or urgent conditions.",
    es: "Eres un asistente de salud amigable y útil. Proporciona información general de salud y consejos, dejando claro que no eres un sustituto del consejo médico profesional. Sé siempre considerado con las preocupaciones del paciente, evita la jerga médica e incluye recordatorios para buscar atención profesional para síntomas graves o condiciones urgentes."
  },
  llama: {
    en: "You are a friendly, helpful health assistant powered by Llama 2. Provide general health information and advice while making it clear you are not a substitute for professional medical advice. Always be considerate to patient concerns, avoid medical jargon, and include reminders to seek professional care for serious symptoms or urgent conditions. Keep your responses focused on factual health information, and if you're unsure about something, acknowledge that limitation.",
    es: "Eres un asistente de salud amigable y útil impulsado por Llama 2. Proporciona información general de salud y consejos, dejando claro que no eres un sustituto del consejo médico profesional. Sé siempre considerado con las preocupaciones del paciente, evita la jerga médica e incluye recordatorios para buscar atención profesional para síntomas graves o condiciones urgentes. Mantén tus respuestas centradas en información de salud factual, y si no estás seguro de algo, reconoce esa limitación."
  }
};

// Error messages based on language
const errorMessages = {
  en: {
    quotaExceeded: "API quota exceeded. Please try again later or use a different provider.",
    invalidKey: "Invalid API key. Please check your API key and try again.",
    networkError: "Network error. Please check your internet connection and try again.",
    llamaError: "Error connecting to Llama 2 API. Please try again later or switch to test mode.",
    llamaModelLoading: "The Llama 2 model is currently loading. This may take a minute for the first request. Please try again.",
    llamaAuthError: "Authentication error with Hugging Face API. Please enter a valid Hugging Face API token in settings.",
    rateLimit: "You've reached the rate limit for API requests. Please wait a moment before trying again or switch to test mode.",
    serverError: "The AI server is experiencing issues. Please try again later or switch to test mode.",
    corsError: "CORS error when trying to access the API. Try using the direct Hugging Face Inference API instead.",
    default: "An error occurred. Please try again or switch to test mode."
  },
  es: {
    quotaExceeded: "Cuota de API excedida. Intente nuevamente más tarde o use un proveedor diferente.",
    invalidKey: "Clave API inválida. Por favor, verifique su clave API e inténtelo de nuevo.",
    networkError: "Error de red. Compruebe su conexión a Internet e inténtelo de nuevo.",
    llamaError: "Error al conectar con la API de Llama 2. Por favor, inténtelo de nuevo más tarde o cambie al modo de prueba.",
    llamaModelLoading: "El modelo Llama 2 está cargando actualmente. Esto puede tardar un minuto para la primera solicitud. Por favor, inténtelo de nuevo.",
    llamaAuthError: "Error de autenticación con la API de Hugging Face. Por favor, ingrese un token válido de API de Hugging Face en la configuración.",
    rateLimit: "Ha alcanzado el límite de frecuencia para las solicitudes de API. Espere un momento antes de intentarlo de nuevo o cambie al modo de prueba.",
    serverError: "El servidor de IA está experimentando problemas. Inténtelo de nuevo más tarde o cambie al modo de prueba.",
    corsError: "Error CORS al intentar acceder a la API. Intente usar la API de inferencia directa de Hugging Face.",
    default: "Se produjo un error. Inténtelo de nuevo o cambie al modo de prueba."
  }
};

// Mock responses for testing without API
const mockResponses = {
  en: {
    default: "I understand you're asking about {TOPIC}. This is a simulated response because the app is in test mode. In a real scenario with a working API connection, you would receive a detailed response from an AI model. For now, you can use the offline mode to get basic information about common health topics.",
    hypertension: "Hypertension, or high blood pressure, is when the pressure in your blood vessels is consistently too high. It's often called a 'silent killer' because it typically has no symptoms but can lead to serious health problems like heart disease and stroke if left untreated. Regular monitoring, a healthy diet low in sodium, regular exercise, limiting alcohol, not smoking, and sometimes medication are key to managing hypertension.",
    diabetes: "Diabetes is a condition where your body either doesn't produce enough insulin or can't effectively use the insulin it produces. This results in high blood sugar levels, which can lead to various health complications over time. There are several types, including Type 1 (autoimmune), Type 2 (related to lifestyle factors), and gestational diabetes (during pregnancy). Management includes monitoring blood sugar, medication or insulin therapy, a balanced diet, and regular physical activity.",
    covid: "COVID-19 is caused by the SARS-CoV-2 virus and primarily affects the respiratory system. Symptoms can range from mild (like fever, cough, fatigue) to severe (difficulty breathing, chest pain). Vaccination has proven effective in reducing the risk of severe illness and hospitalization. If you suspect you have COVID-19, getting tested and isolating yourself to prevent spreading it to others is important.",
    stress: "Stress is your body's natural response to pressure or threats. While some stress can be motivating, chronic stress can negatively impact your physical and mental health. Managing stress often involves techniques like deep breathing, meditation, regular physical activity, adequate sleep, and maintaining social connections. If stress is significantly affecting your daily life, speaking with a healthcare professional might be beneficial.",
    nutrition: "A balanced diet is crucial for maintaining good health. It should include a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. Limiting processed foods, added sugars, and excessive sodium is also important. Everyone's nutritional needs vary based on factors like age, gender, activity level, and overall health status. Consulting with a dietitian can provide personalized guidance for your specific needs."
  },
  es: {
    default: "Entiendo que estás preguntando sobre {TOPIC}. Esta es una respuesta simulada porque la aplicación está en modo de prueba. En un escenario real con una conexión API funcionando, recibirías una respuesta detallada de un modelo de IA. Por ahora, puedes usar el modo offline para obtener información básica sobre temas comunes de salud.",
    hypertension: "La hipertensión, o presión arterial alta, es cuando la presión en los vasos sanguíneos es consistentemente demasiado alta. A menudo se le llama un 'asesino silencioso' porque típicamente no tiene síntomas pero puede llevar a problemas de salud graves como enfermedades cardíacas y accidentes cerebrovasculares si no se trata. El monitoreo regular, una dieta saludable baja en sodio, ejercicio regular, limitar el alcohol, no fumar, y a veces medicamentos son clave para manejar la hipertensión.",
    diabetes: "La diabetes es una condición donde tu cuerpo no produce suficiente insulina o no puede usar efectivamente la insulina que produce. Esto resulta en niveles altos de azúcar en la sangre, lo que puede llevar a varias complicaciones de salud con el tiempo. Hay varios tipos, incluyendo Tipo 1 (autoinmune), Tipo 2 (relacionado con factores de estilo de vida), y diabetes gestacional (durante el embarazo). El manejo incluye monitorear el azúcar en la sangre, medicamentos o terapia de insulina, una dieta balanceada, y actividad física regular.",
    covid: "COVID-19 es causado por el virus SARS-CoV-2 y afecta principalmente al sistema respiratorio. Los síntomas pueden variar desde leves (como fiebre, tos, fatiga) hasta severos (dificultad para respirar, dolor en el pecho). La vacunación ha demostrado ser efectiva en reducir el riesgo de enfermedad grave y hospitalización. Si sospechas que tienes COVID-19, hacerte una prueba y aislarte para prevenir contagiar a otros es importante.",
    stress: "El estrés es la respuesta natural de tu cuerpo a la presión o amenazas. Mientras que algo de estrés puede ser motivador, el estrés crónico puede impactar negativamente tu salud física y mental. Manejar el estrés a menudo involucra técnicas como respiración profunda, meditación, actividad física regular, sueño adecuado, y mantener conexiones sociales. Si el estrés está afectando significativamente tu vida diaria, hablar con un profesional de la salud podría ser beneficioso.",
    nutrition: "Una dieta balanceada es crucial para mantener una buena salud. Debe incluir una variedad de frutas, verduras, granos enteros, proteínas magras, y grasas saludables. Limitar alimentos procesados, azúcares añadidos, y sodio excesivo también es importante. Las necesidades nutricionales de cada persona varían basadas en factores como edad, género, nivel de actividad, y estado de salud general. Consultar con un dietista puede proporcionar orientación personalizada para tus necesidades específicas."
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
  model = "llama-2-7b",
  provider = "llama"
}: AIHealthAssistantProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useVoiceInput, setUseVoiceInput] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem(`${provider}_api_key`) || "";
  });
  const [huggingFaceToken, setHuggingFaceToken] = useState<string>(() => {
    return localStorage.getItem("huggingface_token") || "";
  });
  const [showAPIKeyInput, setShowAPIKeyInput] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentModel, setCurrentModel] = useState(model);
  const [currentProvider, setCurrentProvider] = useState(provider);
  const [useFallbackMode, setUseFallbackMode] = useState<boolean>(() => {
    return localStorage.getItem("use_fallback_mode") === "true";
  });
  const [useTestMode, setUseTestMode] = useState<boolean>(() => {
    return localStorage.getItem("use_test_mode") === "true";
  });
  const [useDirectAPI, setUseDirectAPI] = useState<boolean>(() => {
    return localStorage.getItem("use_direct_api") === "true";
  });
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const auth = getAuth();
  const { toast } = useToast();

  // Update provider and model
  useEffect(() => {
    setCurrentProvider(provider);
    setCurrentModel(model);
    
    // Update API key when provider changes
    const key = localStorage.getItem(`${provider}_api_key`) || "";
    setApiKey(key);
  }, [provider, model]);

  // Add initial greeting message when component loads
  useEffect(() => {
    const initialMessage: Message = {
      id: "greeting",
      content: useFallbackMode ? fallbackResponses[language].greeting : greetings[language],
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    
    // Check if API key is needed and available
    const needsOpenAIKey = currentProvider === "openai" && !apiKey;
    const needsHuggingFaceToken = currentProvider === "llama" && !huggingFaceToken;
    
    if ((needsOpenAIKey || needsHuggingFaceToken) && !useFallbackMode && !useTestMode) {
      setShowAPIKeyInput(true);
    }
  }, [language, useFallbackMode, useTestMode, currentProvider, apiKey, huggingFaceToken]);

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

  // Auto-switch to test mode after multiple consecutive errors
  useEffect(() => {
    if (consecutiveErrors >= 3 && !useTestMode && !useFallbackMode) {
      toast({
        title: language === "en" ? "Switching to Test Mode" : "Cambiando a Modo de Prueba",
        description: language === "en" 
          ? "After multiple connection errors, we're switching to test mode automatically." 
          : "Después de múltiples errores de conexión, estamos cambiando al modo de prueba automáticamente.",
      });
      toggleTestMode(true);
      setConsecutiveErrors(0);
    }
  }, [consecutiveErrors, useTestMode, useFallbackMode, language, toast]);

  const saveAPIKey = () => {
    if (currentProvider === "openai" && !apiKey.trim()) {
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "API key cannot be empty for OpenAI."
          : "La clave API no puede estar vacía para OpenAI.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentProvider === "llama" && !huggingFaceToken.trim()) {
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "Hugging Face token cannot be empty for Llama models."
          : "El token de Hugging Face no puede estar vacío para los modelos Llama.",
        variant: "destructive",
      });
      return;
    }
    
    // Save API keys
    if (currentProvider === "openai") {
      localStorage.setItem("openai_api_key", apiKey);
    } else if (currentProvider === "llama") {
      localStorage.setItem("huggingface_token", huggingFaceToken);
    }
    
    // Save model preferences
    localStorage.setItem(`${currentProvider}_model`, currentModel);
    localStorage.setItem("ai_provider", currentProvider);
    localStorage.setItem("use_direct_api", useDirectAPI.toString());
    
    setShowAPIKeyInput(false);
    setApiError(null);
    toast({
      title: language === "en" ? "Settings Saved" : "Configuración Guardada",
      description: language === "en" 
        ? "Your AI settings have been saved."
        : "Tu configuración de IA ha sido guardada.",
      variant: "default",
    });
  };

  const toggleFallbackMode = (value: boolean) => {
    setUseFallbackMode(value);
    localStorage.setItem("use_fallback_mode", value.toString());
    
    if (value) {
      // If enabling fallback mode, disable test mode
      setUseTestMode(false);
      localStorage.setItem("use_test_mode", "false");
    }
    
    // Reset messages with new greeting
    const initialMessage: Message = {
      id: "greeting",
      content: value ? fallbackResponses[language].greeting : greetings[language],
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    
    // Show API key input if switching from fallback to API mode
    const needsOpenAIKey = currentProvider === "openai" && !apiKey;
    const needsHuggingFaceToken = currentProvider === "llama" && !huggingFaceToken;
    
    if (!value && (needsOpenAIKey || needsHuggingFaceToken) && !useTestMode) {
      setShowAPIKeyInput(true);
    } else {
      setShowAPIKeyInput(false);
    }
    
    // Reset consecutive errors
    setConsecutiveErrors(0);
  };

  const toggleTestMode = (value: boolean) => {
    setUseTestMode(value);
    localStorage.setItem("use_test_mode", value.toString());
    
    if (value) {
      // If enabling test mode, disable fallback mode
      setUseFallbackMode(false);
      localStorage.setItem("use_fallback_mode", "false");
    }
    
    // Reset messages with standard greeting
    const initialMessage: Message = {
      id: "greeting",
      content: greetings[language],
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
    
    setShowAPIKeyInput(false);
    
    // Reset consecutive errors
    setConsecutiveErrors(0);
  };

  const toggleDirectAPI = (value: boolean) => {
    setUseDirectAPI(value);
    localStorage.setItem("use_direct_api", value.toString());
    
    // If we change API mode, clear any existing errors
    setApiError(null);
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
              content: systemPrompts.openai[language]
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
      setConsecutiveErrors(0);
      
      const data = await response.json();
      console.log("OpenAI API response:", data);
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      
      // Increment consecutive errors
      setConsecutiveErrors(prev => prev + 1);
      
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

  const callHuggingFaceInferenceAPI = async (userMessage: string, previousMessages: Message[], modelName: string) => {
    try {
      console.log(`Calling Hugging Face Inference API using model: ${modelName}...`);

      // Construct conversation history for the API
      let prompt = systemPrompts.llama[language] + "\n\n";
      
      for (const msg of previousMessages) {
        if (msg.sender === "user") {
          prompt += "Human: " + msg.content + "\n";
        } else {
          prompt += "Assistant: " + msg.content + "\n";
        }
      }
      
      prompt += "Human: " + userMessage + "\nAssistant:";
      
      console.log("Sending prompt to Hugging Face Inference API");

      // Make sure we have the right model path
      const modelPath = `/${modelName}`;
      
      // Call the Hugging Face Inference API directly
      const response = await fetch(`${HUGGINGFACE_API_URL}${modelPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${huggingFaceToken}`
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false
          }
        }),
      });

      // Log response status for debugging
      console.log("Hugging Face API response status:", response.status);

      if (!response.ok) {
        console.error("Hugging Face API error:", response.status, response.statusText);
        
        // Parse the error response
        let errorMessage = "";
        try {
          const errorData = await response.json();
          console.log("Error data:", errorData);
          errorMessage = errorData.error || "";
        } catch (e) {
          console.log("Failed to parse error response as JSON");
          errorMessage = await response.text();
          console.log("Error text:", errorMessage);
        }
        
        // Handle different error types
        if (response.status === 429) {
          setApiError("rateLimit");
          throw new Error("Rate limit exceeded");
        } else if (response.status === 401 || response.status === 403) {
          setApiError("llamaAuthError");
          throw new Error("Authentication error with Hugging Face API");
        } else if (response.status >= 500) {
          setApiError("serverError");
          throw new Error("Server error");
        } else {
          setApiError("llamaError");
          throw new Error(`API request failed: ${errorMessage}`);
        }
      }

      // Clear previous errors on success
      setApiError(null);
      setConsecutiveErrors(0);
      
      // Parse the response
      const data = await response.json();
      console.log("Hugging Face API response:", data);
      
      if (Array.isArray(data) && data.length > 0) {
        if (typeof data[0] === "string") {
          return data[0].trim();
        } else if (data[0].generated_text) {
          return data[0].generated_text.trim();
        }
      } else if (data.generated_text) {
        return data.generated_text.trim();
      }
      
      // If we couldn't find a response in the expected format
      console.error("Unexpected Hugging Face API response format:", data);
      throw new Error("Unexpected response format from Hugging Face API");
      
    } catch (error) {
      console.error("Error calling Hugging Face Inference API:", error);
      
      // Increment consecutive errors
      setConsecutiveErrors(prev => prev + 1);
      
      // Set appropriate error message
      if (!apiError) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
          setApiError("networkError");
        } else {
          setApiError("llamaError");
        }
      }
      
      throw error;
    }
  };

  const getMockResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("hypertension") || lowerMessage.includes("blood pressure") || 
        lowerMessage.includes("high blood") || lowerMessage.includes("hipertensión") || 
        lowerMessage.includes("presión arterial")) {
      return mockResponses[language].hypertension;
    } else if (lowerMessage.includes("diabetes") || lowerMessage.includes("sugar") || 
              lowerMessage.includes("glucose") || lowerMessage.includes("azúcar") || 
              lowerMessage.includes("glucosa")) {
      return mockResponses[language].diabetes;
    } else if (lowerMessage.includes("covid") || lowerMessage.includes("coronavirus") || 
              lowerMessage.includes("virus") || lowerMessage.includes("pandemic") || 
              lowerMessage.includes("pandemia")) {
      return mockResponses[language].covid;
    } else if (lowerMessage.includes("stress") || lowerMessage.includes("anxiety") || 
              lowerMessage.includes("tension") || lowerMessage.includes("estrés") || 
              lowerMessage.includes("ansiedad")) {
      return mockResponses[language].stress;
    } else if (lowerMessage.includes("nutrition") || lowerMessage.includes("diet") || 
              lowerMessage.includes("food") || lowerMessage.includes("nutrición") || 
              lowerMessage.includes("dieta") || lowerMessage.includes("alimentación")) {
      return mockResponses[language].nutrition;
    } else {
      return mockResponses[language].default.replace("{TOPIC}", userMessage);
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

  const saveMessageToFirestore = async (message: Message) => {
    if (!auth.currentUser) return;
    
    try {
      await addDoc(collection(db, "aiChatHistory"), {
        content: message.content,
        sender: message.sender,
        timestamp: serverTimestamp(),
        userId: patientId || auth.currentUser.uid,
      });
    } catch (error) {
      console.error("Error saving message to Firestore:", error);
      // Continue even if Firestore save fails
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Check if API key is needed and available
    const needsOpenAIKey = currentProvider === "openai" && !apiKey;
    const needsHuggingFaceToken = currentProvider === "llama" && !huggingFaceToken;
    
    if ((needsOpenAIKey || needsHuggingFaceToken) && !useFallbackMode && !useTestMode) {
      setShowAPIKeyInput(true);
      toast({
        title: language === "en" ? "API Key Required" : "Se Requiere Clave API",
        description: currentProvider === "openai" 
          ? (language === "en" 
              ? "Please enter your OpenAI API key to continue." 
              : "Por favor, ingrese su clave API de OpenAI para continuar.")
          : (language === "en"
              ? "Please enter your Hugging Face API token to continue."
              : "Por favor, ingrese su token de API de Hugging Face para continuar."),
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
      
      // Save user message to Firestore
      await saveMessageToFirestore(userMessage);
      
      if (useFallbackMode) {
        // Use the fallback response system
        aiResponseText = getFallbackResponse(input) + " " + disclaimers[language];
      } else if (useTestMode) {
        // Use the mock response system
        // Add a slight delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        aiResponseText = getMockResponse(input) + " " + disclaimers[language];
      } else if (currentProvider === "openai") {
        // Call OpenAI API
        const aiResponse = await callOpenAI(input, messages);
        aiResponseText = aiResponse + " " + disclaimers[language];
      } else if (currentProvider === "llama") {
        // Use direct Hugging Face Inference API (better for avoiding CORS issues)
        const aiResponse = await callHuggingFaceInferenceAPI(input, messages, currentModel);
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
      
      // Save AI response to Firestore
      await saveMessageToFirestore(aiMessage);
      
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Check for CORS errors
      if (
        error instanceof TypeError && 
        error.message.includes("fetch") && 
        (error.message.includes("CORS") || error.message.includes("cors"))
      ) {
        setApiError("corsError");
      }
      
      // Display error message to user
      const errorKey = apiError || "default";
      toast({
        title: language === "en" ? "Error" : "Error",
        description: errorMessages[language][errorKey as keyof typeof errorMessages.en],
        variant: "destructive",
      });
      
      // Suggest test mode or fallback mode after error
      if (!useTestMode && !useFallbackMode) {
        toast({
          title: language === "en" ? "Try Test Mode" : "Probar Modo de Prueba",
          description: language === "en" 
            ? "You can switch to test mode to use simulated responses without requiring a working API connection." 
            : "Puede cambiar al modo de prueba para usar respuestas simuladas sin necesitar una conexión API funcionando.",
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

  const getProviderDisplayName = () => {
    if (currentProvider === "openai") return "OpenAI";
    if (currentProvider === "llama") return "Llama 2";
    return currentProvider;
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
            {!useFallbackMode && !useTestMode && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({getProviderDisplayName()} - {currentModel})
              </span>
            )}
            {useFallbackMode && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({language === "en" ? "offline mode" : "modo offline"})
              </span>
            )}
            {useTestMode && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({language === "en" ? "test mode" : "modo de prueba"})
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
              {language === "en" ? "AI Settings" : "Configuración de IA"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "en" 
                ? "Choose your AI provider and settings." 
                : "Elija su proveedor de IA y configuración."}
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
            <div className="space-y-2">
              <div className="flex items-center justify-between space-x-2 py-2">
                <Label htmlFor="test-mode" className="text-base flex items-center gap-2">
                  {language === "en" ? "Use Test Mode" : "Usar Modo de Prueba"}
                  <span className="text-xs text-muted-foreground">(simulated responses)</span>
                </Label>
                <Switch
                  id="test-mode"
                  checked={useTestMode}
                  onCheckedChange={toggleTestMode}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 py-2">
                <Label htmlFor="offline-mode" className="text-base flex items-center gap-2">
                  {language === "en" ? "Use Offline Mode" : "Usar Modo Offline"}
                  <span className="text-xs text-muted-foreground">(predefined responses)</span>
                </Label>
                <Switch
                  id="offline-mode"
                  checked={useFallbackMode}
                  onCheckedChange={toggleFallbackMode}
                />
              </div>
            </div>
            
            {!useFallbackMode && !useTestMode && (
              <>
                <div className="space-y-2">
                  <label htmlFor="provider" className="text-sm font-medium">
                    {language === "en" ? "AI Provider" : "Proveedor de IA"}
                  </label>
                  <Select value={currentProvider} onValueChange={setCurrentProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select provider" : "Seleccionar proveedor"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llama">Llama 2 (Requires Hugging Face token)</SelectItem>
                      <SelectItem value="openai">OpenAI (Requires API Key)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {currentProvider === "openai" && (
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
                )}
                
                {currentProvider === "llama" && (
                  <div className="space-y-2">
                    <label htmlFor="huggingFaceToken" className="text-sm font-medium">
                      {language === "en" ? "Hugging Face API Token" : "Token de API de Hugging Face"}
                    </label>
                    <Input
                      id="huggingFaceToken"
                      type="password"
                      value={huggingFaceToken}
                      onChange={(e) => setHuggingFaceToken(e.target.value)}
                      placeholder="hf_..."
                      className="w-full"
                    />
                  </div>
                )}
                
                {currentProvider === "openai" && (
                  <div className="space-y-2">
                    <label htmlFor="model" className="text-sm font-medium">
                      {language === "en" ? "Model" : "Modelo"}
                    </label>
                    <Select value={currentModel} onValueChange={setCurrentModel}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === "en" ? "Select model" : "Seleccionar modelo"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {currentProvider === "llama" && (
                  <div className="space-y-2">
                    <label htmlFor="model" className="text-sm font-medium">
                      {language === "en" ? "Llama 2 Model" : "Modelo Llama 2"}
                    </label>
                    <Select value={currentModel} onValueChange={setCurrentModel}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === "en" ? "Select model" : "Seleccionar modelo"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="llama-2-7b">Llama 2 (7B parameters)</SelectItem>
                        <SelectItem value="llama-2-13b">Llama 2 (13B parameters)</SelectItem>
                        <SelectItem value="llama-2-7b-chat">Llama 2 Chat (7B parameters)</SelectItem>
                        <SelectItem value="llama-2-13b-chat">Llama 2 Chat (13B parameters)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {currentProvider === "llama" && (
                  <Alert className="bg-primary/10 border-primary/20">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <AlertDescription>
                      {language === "en" 
                        ? "Llama 2 models require a Hugging Face API token. You can get one for free at huggingface.co/settings/tokens." 
                        : "Los modelos Llama 2 requieren un token de API de Hugging Face. Puede obtener uno gratis en huggingface.co/settings/tokens."}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  onClick={saveAPIKey} 
                  className="w-full"
                  disabled={(currentProvider === "openai" && !apiKey.trim()) || (currentProvider === "llama" && !huggingFaceToken.trim())}
                >
                  {language === "en" ? "Save Settings" : "Guardar Configuración"}
                </Button>
                
                {currentProvider === "openai" && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {language === "en" 
                      ? "You can get an API key from platform.openai.com. The key is stored locally in your browser." 
                      : "Puede obtener una clave API en platform.openai.com. La clave se almacena localmente en su navegador."}
                  </p>
                )}
                
                {currentProvider === "llama" && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {language === "en" 
                      ? "Get a Hugging Face API token at huggingface.co/settings/tokens. The token is stored locally in your browser." 
                      : "Obtenga un token de API de Hugging Face en huggingface.co/settings/tokens. El token se almacena localmente en su navegador."}
                  </p>
                )}
              </>
            )}
            
            {(useTestMode || useFallbackMode) && (
              <Button 
                onClick={() => setShowAPIKeyInput(false)} 
                className="w-full"
              >
                {language === "en" ? "Continue" : "Continuar"}
              </Button>
            )}
            
            {useTestMode && (
              <Alert className="bg-primary/10 border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <AlertDescription>
                  {language === "en" 
                    ? "Test mode provides simulated AI responses without requiring an API connection. This is perfect for testing the application." 
                    : "El modo de prueba proporciona respuestas de IA simuladas sin requerir una conexión API. Esto es perfecto para probar la aplicación."}
                </AlertDescription>
              </Alert>
            )}
            
            {useFallbackMode && (
              <Alert className="bg-primary/10 border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <AlertDescription>
                  {language === "en" 
                    ? "Offline mode uses pre-defined responses for common health topics without requiring an API connection. Topics include: hypertension, diabetes, COVID-19, anxiety, and depression." 
                    : "El modo offline utiliza respuestas predefinidas para temas comunes de salud sin requerir una conexión API. Los temas incluyen: hipertensión, diabetes, COVID-19, ansiedad y depresión."}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      ) : (
        <>
          <CardContent className="flex-1 p-4 overflow-hidden">
            {apiError && !useFallbackMode && !useTestMode && (
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
                      {language === "en" ? "Change AI Settings" : "Cambiar Configuración de IA"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleTestMode(true)}
                      className="self-start"
                    >
                      {language === "en" ? "Switch to Test Mode" : "Cambiar a Modo de Prueba"}
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
            
            {currentProvider === "llama" && !useFallbackMode && !useTestMode && (
              <Alert className="mb-4 bg-primary/10 border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <AlertTitle>
                  {language === "en" ? "Using Llama 2" : "Usando Llama 2"}
                </AlertTitle>
                <AlertDescription>
                  {language === "en" 
                    ? "You're using Llama 2 via Hugging Face API. Response times may vary based on model size. If you experience slow responses, try using a smaller model or switch to test mode." 
                    : "Está utilizando Llama 2 a través de la API de Hugging Face. Los tiempos de respuesta pueden variar según el tamaño del modelo. Si experimenta respuestas lentas, intente usar un modelo más pequeño o cambie al modo de prueba."}
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
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleTestMode(true)}
                      className="self-start"
                    >
                      {language === "en" ? "Switch to Test Mode" : "Cambiar a Modo de Prueba"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        toggleFallbackMode(false);
                        handleChangeAPIKey();
                      }}
                      className="self-start"
                    >
                      {language === "en" ? "Change AI Settings" : "Cambiar Configuración de IA"}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {useTestMode && (
              <Alert className="mb-4 bg-primary/10 border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <AlertTitle>
                  {language === "en" ? "Test Mode Active" : "Modo de Prueba Activo"}
                </AlertTitle>
                <AlertDescription className="flex flex-col gap-2">
                  <span>
                    {language === "en" 
                      ? "You're using test mode with simulated AI responses. No API connection is required. You can ask about any health topic." 
                      : "Está utilizando el modo de prueba con respuestas de IA simuladas. No se requiere conexión API. Puede preguntar sobre cualquier tema de salud."}
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleFallbackMode(true)}
                      className="self-start"
                    >
                      {language === "en" ? "Switch to Offline Mode" : "Cambiar a Modo Offline"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        toggleTestMode(false);
                        handleChangeAPIKey();
                      }}
                      className="self-start"
                    >
                      {language === "en" ? "Change AI Settings" : "Cambiar Configuración de IA"}
                    </Button>
                  </div>
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
