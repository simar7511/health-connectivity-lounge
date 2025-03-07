
// This is a simplified offline LLM implementation for the health assistant
// It provides basic offline capabilities when the main AI service is unavailable

import { transformers } from '@xenova/transformers';

// Define the OfflineModeType as a proper TypeScript type
export type OfflineModeType = "localLLM" | "simulated" | "none";

// Track the model loading state
let modelLoadingPromise: Promise<boolean> | null = null;
let isModelLoaded = false;
let pipeline: any = null;

// Configuration for the offline model
const MODEL_CONFIG = {
  modelName: "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
  quantized: true,
  maxLength: 100,
  temperature: 0.7,
  topK: 50,
  topP: 0.9
};

/**
 * Checks if the offline model is ready to use
 */
export const isOfflineModelReady = (): boolean => {
  return isModelLoaded && pipeline !== null;
};

/**
 * Initializes the offline model
 * @returns Promise<boolean> - Whether initialization was successful
 */
export const initOfflineModel = async (): Promise<boolean> => {
  if (isModelLoaded) {
    return true;
  }

  if (modelLoadingPromise) {
    try {
      return await modelLoadingPromise;
    } catch (error) {
      console.error("Error waiting for model to load:", error);
      return false;
    }
  }

  try {
    modelLoadingPromise = (async () => {
      try {
        // Show progress in console
        console.log("Loading offline language model...");
        
        // Use a smaller model for offline use
        const { pipeline: pipelineFunc } = await transformers;
        pipeline = await pipelineFunc('text-classification', MODEL_CONFIG.modelName, {
          quantized: MODEL_CONFIG.quantized
        });
        
        console.log("Offline language model loaded successfully");
        isModelLoaded = true;
        return true;
      } catch (error) {
        console.error("Failed to load offline language model:", error);
        isModelLoaded = false;
        pipeline = null;
        return false;
      }
    })();
    
    return await modelLoadingPromise;
  } catch (error) {
    console.error("Error initializing offline model:", error);
    isModelLoaded = false;
    modelLoadingPromise = null;
    return false;
  }
};

/**
 * Gets the configuration of the offline model
 */
export const getOfflineModelConfig = () => {
  return {
    ...MODEL_CONFIG,
    isLoaded: isModelLoaded
  };
};

/**
 * Generates a response using the offline model
 * @param query - The user's query
 * @param language - The language to respond in
 * @returns Promise<string> - The generated response
 */
export const generateOfflineResponse = async (
  query: string,
  language: "en" | "es" = "en"
): Promise<string> => {
  if (!isOfflineModelReady()) {
    try {
      const success = await initOfflineModel();
      if (!success) {
        return getSampleResponse(query, language);
      }
    } catch (error) {
      console.error("Error initializing model for response:", error);
      return getSampleResponse(query, language);
    }
  }

  try {
    // For a real implementation, this would use the model to generate text
    // Since we're using a classification model as an example, we'll just use it to
    // determine sentiment and then return a canned response based on that
    const result = await pipeline(query);
    
    // Get the sentiment from the classification result
    const sentiment = result[0].label;
    
    if (sentiment === 'POSITIVE') {
      return language === "en"
        ? "I'm glad to hear that! Based on my offline analysis, your question seems positive. I can provide more detailed information when online connectivity is restored."
        : "¡Me alegra escuchar eso! Según mi análisis sin conexión, tu pregunta parece positiva. Puedo proporcionar información más detallada cuando se restablezca la conectividad.";
    } else {
      return language === "en"
        ? "I understand your concern. Based on my offline analysis, I'd like to address your question more thoroughly when online connectivity is restored. In the meantime, is there anything specific I can help clarify?"
        : "Entiendo tu preocupación. Según mi análisis sin conexión, me gustaría abordar tu pregunta más a fondo cuando se restablezca la conectividad. Mientras tanto, ¿hay algo específico que pueda ayudarte a aclarar?";
    }
  } catch (error) {
    console.error("Error generating offline response:", error);
    return getSampleResponse(query, language);
  }
};

/**
 * Gets a sample response for common health queries
 * @param query - The user's query
 * @param language - The language to respond in
 * @returns string - A sample response
 */
export const getSampleResponse = (
  query: string,
  language: "en" | "es" = "en"
): string => {
  const lowerQuery = query.toLowerCase();
  
  // Check for common health topics in the query
  if (lowerQuery.includes("headache") || lowerQuery.includes("dolor de cabeza")) {
    return language === "en"
      ? "Headaches can be caused by various factors including stress, dehydration, lack of sleep, or eye strain. For occasional headaches, rest, hydration, and over-the-counter pain relievers may help. If headaches are severe, persistent, or accompanied by other symptoms, please consult a healthcare provider."
      : "Los dolores de cabeza pueden ser causados por varios factores, incluyendo estrés, deshidratación, falta de sueño o fatiga visual. Para dolores de cabeza ocasionales, descanso, hidratación y analgésicos de venta libre pueden ayudar. Si los dolores de cabeza son severos, persistentes o están acompañados de otros síntomas, consulte a un proveedor de atención médica.";
  }
  
  if (lowerQuery.includes("sleep") || lowerQuery.includes("insomnia") || lowerQuery.includes("dormir") || lowerQuery.includes("insomnio")) {
    return language === "en"
      ? "Good sleep hygiene includes maintaining a regular sleep schedule, creating a restful environment, limiting screen time before bed, and avoiding caffeine and large meals close to bedtime. Adults typically need 7-9 hours of sleep per night. If you're experiencing persistent sleep problems, consider consulting a healthcare provider."
      : "Una buena higiene del sueño incluye mantener un horario regular de sueño, crear un ambiente tranquilo, limitar el tiempo de pantalla antes de acostarse y evitar la cafeína y las comidas abundantes cerca de la hora de dormir. Los adultos típicamente necesitan 7-9 horas de sueño por noche. Si experimenta problemas persistentes de sueño, considere consultar a un proveedor de atención médica.";
  }
  
  if (lowerQuery.includes("stress") || lowerQuery.includes("anxiety") || lowerQuery.includes("estrés") || lowerQuery.includes("ansiedad")) {
    return language === "en"
      ? "Managing stress and anxiety can involve regular physical activity, relaxation techniques like deep breathing or meditation, maintaining social connections, and ensuring adequate rest. If stress or anxiety is interfering with daily activities, consider speaking with a mental health professional for additional support and strategies."
      : "El manejo del estrés y la ansiedad puede involucrar actividad física regular, técnicas de relajación como respiración profunda o meditación, mantener conexiones sociales y asegurar un descanso adecuado. Si el estrés o la ansiedad interfieren con las actividades diarias, considere hablar con un profesional de salud mental para obtener apoyo y estrategias adicionales.";
  }
  
  if (lowerQuery.includes("diet") || lowerQuery.includes("nutrition") || lowerQuery.includes("dieta") || lowerQuery.includes("nutrición")) {
    return language === "en"
      ? "A balanced diet typically includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. It's generally recommended to limit processed foods, added sugars, and excessive sodium. Individual nutritional needs can vary based on factors like age, sex, activity level, and health conditions. For personalized dietary advice, consider consulting with a registered dietitian."
      : "Una dieta equilibrada típicamente incluye una variedad de frutas, verduras, granos integrales, proteínas magras y grasas saludables. Generalmente se recomienda limitar los alimentos procesados, azúcares añadidos y sodio excesivo. Las necesidades nutricionales individuales pueden variar según factores como edad, sexo, nivel de actividad y condiciones de salud. Para consejos dietéticos personalizados, considere consultar con un dietista registrado.";
  }
  
  if (lowerQuery.includes("exercise") || lowerQuery.includes("workout") || lowerQuery.includes("ejercicio") || lowerQuery.includes("entrenamiento")) {
    return language === "en"
      ? "Regular physical activity offers numerous health benefits, including improved cardiovascular health, stronger muscles and bones, better weight management, and enhanced mental well-being. Adults are generally recommended to aim for at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous activity per week, along with muscle-strengthening activities twice weekly. Always start gradually and consider your individual health status."
      : "La actividad física regular ofrece numerosos beneficios para la salud, incluyendo mejor salud cardiovascular, músculos y huesos más fuertes, mejor control de peso y bienestar mental mejorado. Generalmente se recomienda que los adultos busquen al menos 150 minutos de actividad aeróbica de intensidad moderada o 75 minutos de actividad vigorosa por semana, junto con actividades de fortalecimiento muscular dos veces por semana. Siempre comience gradualmente y considere su estado de salud individual.";
  }
  
  // Default response if no specific topic is matched
  return language === "en"
    ? "I'm currently operating in offline mode with limited capabilities. I can provide general health information, but for personalized advice, please consult a healthcare professional. Once online connectivity is restored, I'll be able to provide more detailed and specific information."
    : "Actualmente estoy operando en modo sin conexión con capacidades limitadas. Puedo proporcionar información general sobre salud, pero para consejos personalizados, consulte a un profesional de la salud. Una vez que se restablezca la conectividad en línea, podré proporcionar información más detallada y específica.";
};
