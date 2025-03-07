
// This file simulates different ways of handling offline AI responses
// We'll expand this to include actual WebLLM capabilities in the future

// Types for offline mode selection
export type OfflineModeType = "none" | "simulated" | "localLLM";

// Configuration for the offline model
interface OfflineModelConfig {
  modelName: string;
  tokenizer: string;
  quantized: boolean;
  modelSize: string;
}

let offlineModelReady = false;
let offlineModelConfig: OfflineModelConfig = {
  modelName: "Tiny Health Assistant",
  tokenizer: "llama",
  quantized: true,
  modelSize: "7B"
};

/**
 * Check if the offline model is ready
 */
export function isOfflineModelReady(): boolean {
  return offlineModelReady;
}

/**
 * Get the configuration for the offline model
 */
export function getOfflineModelConfig(): OfflineModelConfig {
  return offlineModelConfig;
}

/**
 * Initialize the offline language model
 * In a real implementation, this would load a WebLLM model
 */
export async function initOfflineModel(): Promise<boolean> {
  console.log("Initializing offline LLM model...");
  
  // Simulate a delay for model loading
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Simulate successful model loading
    offlineModelReady = true;
    console.log("Offline model initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize offline model:", error);
    offlineModelReady = false;
    return false;
  }
}

/**
 * Generate a response using the offline model
 * This is a simulation - in a real implementation, this would
 * pass the input to a WebLLM model
 */
export async function generateOfflineResponse(
  input: string,
  language: "en" | "es" = "en"
): Promise<string> {
  if (!offlineModelReady) {
    throw new Error("Offline model not initialized");
  }
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a simulated response based on the input
  return getSampleResponse(input, language);
}

/**
 * Get a sample response based on the input text
 * This is used for the simulated response mode
 */
export function getSampleResponse(input: string, language: "en" | "es" = "en"): string {
  const lowerInput = input.toLowerCase();
  
  // Sample responses in English and Spanish
  const responses: Record<string, Record<"en" | "es", string>> = {
    greeting: {
      en: "Hello! I'm your AI health assistant. How can I help you today?",
      es: "¡Hola! Soy tu asistente de salud con IA. ¿Cómo puedo ayudarte hoy?"
    },
    headache: {
      en: "Headaches can have many causes including stress, dehydration, lack of sleep, or eye strain. For occasional headaches, rest, hydration, and over-the-counter pain relievers may help. If you're experiencing severe or recurring headaches, it's best to consult with a healthcare provider.",
      es: "Los dolores de cabeza pueden tener muchas causas, incluyendo estrés, deshidratación, falta de sueño o fatiga visual. Para dolores de cabeza ocasionales, descanso, hidratación y analgésicos de venta libre pueden ayudar. Si experimenta dolores de cabeza severos o recurrentes, es mejor consultar con un proveedor de atención médica."
    },
    fever: {
      en: "Fever is often a sign that your body is fighting an infection. Rest, staying hydrated, and taking acetaminophen or ibuprofen can help reduce fever. If your temperature exceeds 103°F (39.4°C), lasts more than three days, or is accompanied by severe symptoms, please seek medical attention.",
      es: "La fiebre es a menudo una señal de que tu cuerpo está combatiendo una infección. Descansar, mantenerse hidratado y tomar acetaminofén o ibuprofeno puede ayudar a reducir la fiebre. Si tu temperatura excede los 39.4°C (103°F), dura más de tres días o está acompañada de síntomas graves, busca atención médica."
    },
    cold: {
      en: "Common cold symptoms include runny nose, sore throat, cough, and mild fever. Rest, staying hydrated, and over-the-counter cold medications can help manage symptoms. Most colds resolve within 7-10 days. If symptoms worsen or persist longer, consider consulting a healthcare provider.",
      es: "Los síntomas del resfriado común incluyen secreción nasal, dolor de garganta, tos y fiebre leve. Descansar, mantenerse hidratado y medicamentos para el resfriado de venta libre pueden ayudar a manejar los síntomas. La mayoría de los resfriados se resuelven en 7-10 días. Si los síntomas empeoran o persisten por más tiempo, considera consultar a un proveedor de atención médica."
    },
    stress: {
      en: "Managing stress is important for overall health. Consider techniques like deep breathing, meditation, regular exercise, and ensuring adequate sleep. Creating boundaries, practicing mindfulness, and seeking support from friends, family, or professionals can also be beneficial for stress management.",
      es: "Manejar el estrés es importante para la salud general. Considera técnicas como respiración profunda, meditación, ejercicio regular y asegurar un sueño adecuado. Crear límites, practicar la atención plena y buscar apoyo de amigos, familiares o profesionales también puede ser beneficioso para el manejo del estrés."
    },
    diet: {
      en: "A balanced diet typically includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. It's recommended to limit processed foods, added sugars, and excessive salt. Staying hydrated by drinking plenty of water is also important for overall health.",
      es: "Una dieta equilibrada típicamente incluye una variedad de frutas, verduras, granos enteros, proteínas magras y grasas saludables. Se recomienda limitar los alimentos procesados, azúcares añadidos y sal excesiva. Mantenerse hidratado bebiendo suficiente agua también es importante para la salud general."
    },
    exercise: {
      en: "Regular physical activity offers many health benefits including improved cardiovascular health, stronger muscles and bones, better weight management, and enhanced mood. Aim for at least 150 minutes of moderate-intensity exercise per week, along with muscle-strengthening activities twice a week.",
      es: "La actividad física regular ofrece muchos beneficios para la salud, incluyendo mejor salud cardiovascular, músculos y huesos más fuertes, mejor manejo del peso y estado de ánimo mejorado. Intenta realizar al menos 150 minutos de ejercicio de intensidad moderada por semana, junto con actividades de fortalecimiento muscular dos veces por semana."
    },
    pregnancy: {
      en: "During pregnancy, it's important to attend regular prenatal checkups, maintain a balanced diet, stay hydrated, and get adequate rest. Prenatal vitamins, gentle exercise (as approved by your healthcare provider), and avoiding harmful substances are also key aspects of prenatal care. Always consult with your healthcare provider for personalized guidance.",
      es: "Durante el embarazo, es importante asistir a chequeos prenatales regulares, mantener una dieta equilibrada, mantenerse hidratada y descansar adecuadamente. Las vitaminas prenatales, ejercicio suave (según lo aprobado por tu proveedor de atención médica) y evitar sustancias dañinas también son aspectos clave del cuidado prenatal. Siempre consulta con tu proveedor de atención médica para orientación personalizada."
    }
  };
  
  // Match input with appropriate response
  if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hola")) {
    return responses.greeting[language];
  } else if (lowerInput.includes("headache") || lowerInput.includes("dolor de cabeza")) {
    return responses.headache[language];
  } else if (lowerInput.includes("fever") || lowerInput.includes("fiebre")) {
    return responses.fever[language];
  } else if (lowerInput.includes("cold") || lowerInput.includes("resfriado")) {
    return responses.cold[language];
  } else if (lowerInput.includes("stress") || lowerInput.includes("estrés")) {
    return responses.stress[language];
  } else if (lowerInput.includes("diet") || lowerInput.includes("dieta") || lowerInput.includes("eat") || lowerInput.includes("comer")) {
    return responses.diet[language];
  } else if (lowerInput.includes("exercise") || lowerInput.includes("ejercicio")) {
    return responses.exercise[language];
  } else if (lowerInput.includes("pregnancy") || lowerInput.includes("embarazo")) {
    return responses.pregnancy[language];
  }
  
  // Default response
  return language === "en"
    ? "I'm sorry, I don't have specific information about that. For personalized health advice, please consult with a healthcare professional."
    : "Lo siento, no tengo información específica sobre eso. Para consejos de salud personalizados, por favor consulta con un profesional de la salud.";
}
