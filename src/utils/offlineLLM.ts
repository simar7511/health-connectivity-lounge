
import { pipeline } from "@huggingface/transformers";

// Types for our offline language model
export interface OfflineModelConfig {
  modelName: string;
  modelSize: 'tiny' | 'small' | 'medium' | 'large';
  loaded: boolean;
}

// State of the offline model
let offlineModel: any = null;
let isModelLoading = false;
let modelConfig: OfflineModelConfig = {
  modelName: "onnx-community/llama-2-chat-7b-tiny-onnx",
  modelSize: 'tiny',
  loaded: false
};

/**
 * Initialize and load the offline LLM model
 */
export const initOfflineModel = async (
  config: Partial<OfflineModelConfig> = {}
): Promise<boolean> => {
  // If model is already loaded and we're not changing models, return true
  if (offlineModel && !config.modelName && modelConfig.loaded) {
    console.log("Offline model already loaded");
    return true;
  }

  if (isModelLoading) {
    console.log("Model is already loading");
    return false; // Already loading
  }

  try {
    isModelLoading = true;
    
    // Update config with any provided options
    modelConfig = {
      ...modelConfig,
      ...config,
      loaded: false
    };

    console.log(`Loading offline LLM model: ${modelConfig.modelName}...`);

    // Initialize the model using transformers.js
    // Use supported parameters from the package
    offlineModel = await pipeline(
      "text-generation",
      modelConfig.modelName,
      { 
        revision: "main",
        progress_callback: (progress: any) => {
          const percentage = typeof progress === 'number' ? progress : 0;
          console.log(`Model loading progress: ${Math.round(percentage * 100)}%`);
        }
      }
    );

    modelConfig.loaded = true;
    console.log("✅ Offline LLM model loaded successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to load offline LLM model:", error);
    modelConfig.loaded = false;
    offlineModel = null;
    return false;
  } finally {
    isModelLoading = false;
  }
};

/**
 * Generate a response using the offline LLM
 */
export const generateOfflineResponse = async (
  input: string,
  language: "en" | "es" = "en"
): Promise<string> => {
  if (!offlineModel || !modelConfig.loaded) {
    console.log("Offline model not loaded, returning fallback response");
    // Return fallback response if model is not loaded
    return language === "en" 
      ? "Offline LLM model is not loaded. Please try again later or check your settings."
      : "El modelo LLM sin conexión no está cargado. Inténtelo de nuevo más tarde o verifique su configuración.";
  }

  try {
    // Create a health-focused system prompt
    const systemPrompt = language === "en" 
      ? "You are a helpful AI health assistant. Provide concise and accurate health information. Remember you are not a doctor and should encourage users to seek professional medical advice for specific health concerns."
      : "Eres un asistente de salud de IA útil. Proporciona información de salud concisa y precisa. Recuerda que no eres un médico y debes animar a los usuarios a buscar consejo médico profesional para problemas de salud específicos.";
    
    // Format the prompt properly for the model
    const formattedPrompt = `<s>[INST] ${systemPrompt} [/INST]</s>
[INST] ${input} [/INST]`;

    console.log("Generating response with offline LLM...");
    
    // Generate response with the model
    const result = await offlineModel(formattedPrompt, {
      max_new_tokens: 500,
      temperature: 0.7,
      top_p: 0.95,
      do_sample: true
    });

    // Process the generated text
    const generatedText = result[0]?.generated_text || "";
    
    // Extract just the response portion (after the prompt)
    const responseText = generatedText
      .replace(formattedPrompt, "")
      .trim();
    
    return responseText || (language === "en" 
      ? "I couldn't generate a response. Please try rephrasing your question."
      : "No pude generar una respuesta. Intente reformular su pregunta.");
    
  } catch (error) {
    console.error("❌ Error generating response with offline LLM:", error);
    return language === "en"
      ? "I encountered an error while generating a response. Please try again later."
      : "Encontré un error al generar una respuesta. Por favor, inténtelo de nuevo más tarde.";
  }
};

/**
 * Check if the model is ready for use
 */
export const isOfflineModelReady = (): boolean => {
  return modelConfig.loaded && offlineModel !== null;
};

/**
 * Get the current offline model configuration
 */
export const getOfflineModelConfig = (): OfflineModelConfig => {
  return { ...modelConfig };
};

/**
 * Unload the model to free up memory
 */
export const unloadOfflineModel = (): void => {
  offlineModel = null;
  modelConfig.loaded = false;
  console.log("Offline LLM model unloaded");
};

/**
 * Get a simulated response for common health topics
 * This is used when the LLM model is not available
 */
export const getSampleResponse = (query: string, language: "en" | "es"): string => {
  const responses: Record<string, {en: string, es: string}> = {
    // Original responses
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
    },
    
    // Pediatric health and growth responses
    "growth milestones": {
      en: "Growth milestones vary by age: Newborns typically gain 5-7 oz per week for the first few months. By 4-6 months, most babies double their birth weight. By 1 year, they usually triple it. For toddlers, growth slows to 2-3 inches per year. Preschoolers (3-5 years) grow about 2 inches per year. School-age children (6-12) grow about 2-2.5 inches per year until puberty, when growth accelerates again. Regular pediatric check-ups help track your child's growth against standard charts.",
      es: "Los hitos de crecimiento varían según la edad: Los recién nacidos generalmente aumentan 140-200 gramos por semana durante los primeros meses. A los 4-6 meses, la mayoría de los bebés duplican su peso al nacer. Al año, generalmente lo triplican. Para los niños pequeños, el crecimiento se reduce a 5-7 cm por año. Los preescolares (3-5 años) crecen aproximadamente 5 cm por año. Los niños en edad escolar (6-12) crecen aproximadamente 5-6 cm por año hasta la pubertad, cuando el crecimiento se acelera nuevamente."
    },
    "child sleep": {
      en: "Sleep needs by age: Newborns (0-3 months): 14-17 hours throughout the day and night. Infants (4-12 months): 12-16 hours including naps. Toddlers (1-2 years): 11-14 hours including naps. Preschoolers (3-5 years): 10-13 hours, which may still include a nap. School-age children (6-12 years): 9-12 hours. Teenagers (13-18 years): 8-10 hours. Consistent bedtime routines help children develop healthy sleep habits. Signs of insufficient sleep include irritability, trouble focusing, and hyperactivity.",
      es: "Necesidades de sueño por edad: Recién nacidos (0-3 meses): 14-17 horas durante el día y la noche. Bebés (4-12 meses): 12-16 horas incluidas las siestas. Niños pequeños (1-2 años): 11-14 horas incluidas las siestas. Preescolares (3-5 años): 10-13 horas, que pueden incluir una siesta. Niños en edad escolar (6-12 años): 9-12 horas. Adolescentes (13-18 años): 8-10 horas. Las rutinas constantes a la hora de acostarse ayudan a los niños a desarrollar hábitos de sueño saludables."
    },
    "immune system": {
      en: "To boost your child's immune system: Ensure they eat a balanced diet rich in fruits, vegetables, proteins, and healthy fats. Maintain regular sleep schedules as sleep is crucial for immune function. Encourage physical activity for at least 60 minutes daily. Keep vaccinations up-to-date. Minimize excess sugar consumption. Practice good hygiene like regular handwashing. Manage stress through relaxing activities. Breastfeeding, if possible, provides important antibodies to infants. Note that occasional illness is normal and helps build a stronger immune system over time.",
      es: "Para fortalecer el sistema inmunológico de tu hijo: Asegúrate de que coma una dieta equilibrada rica en frutas, verduras, proteínas y grasas saludables. Mantén horarios regulares de sueño, ya que el sueño es crucial para la función inmune. Fomenta la actividad física durante al menos 60 minutos diarios. Mantén las vacunas al día. Minimiza el consumo excesivo de azúcar. Practica una buena higiene como lavarse las manos regularmente. Gestiona el estrés a través de actividades relajantes."
    },
    "healthy weight": {
      en: "To determine if your child is at a healthy weight, pediatricians use BMI (Body Mass Index) charts specific to age and gender. During regular check-ups, your doctor will plot your child's measurements and track their growth curve over time. Consistent growth along their established curve is typically more important than a single measurement. Healthy habits are more crucial than numbers: focus on offering nutritious foods, limiting processed foods and sugary drinks, encouraging regular physical activity, and modeling healthy eating behaviors. If you're concerned about your child's weight, consult with their pediatrician rather than putting them on a restrictive diet.",
      es: "Para determinar si su hijo tiene un peso saludable, los pediatras utilizan tablas de IMC (Índice de Masa Corporal) específicas para la edad y el género. Durante los chequeos regulares, su médico trazará las medidas de su hijo y seguirá su curva de crecimiento a lo largo del tiempo. El crecimiento constante a lo largo de su curva establecida es típicamente más importante que una sola medición. Los hábitos saludables son más cruciales que los números."
    },
    "wellness check": {
      en: "Recommended wellness check-up schedule: Birth to 12 months: Check-ups at 1, 2, 4, 6, 9, and 12 months. Ages 1-2: Check-ups at 15, 18, and 24 months. Ages 3-6: Annual check-ups. Ages 7-18: Annual check-ups. These visits include tracking growth, development assessments, screenings, immunizations, and addressing parental concerns. More frequent visits may be needed for children with chronic conditions or developmental concerns. Regular dental check-ups should begin around age 1 and continue every 6 months. Vision screenings are usually done at well-visits but comprehensive eye exams may be recommended starting around age 3-5.",
      es: "Calendario recomendado de chequeos de bienestar: Nacimiento a 12 meses: Chequeos a 1, 2, 4, 6, 9 y 12 meses. Edades 1-2: Chequeos a los 15, 18 y 24 meses. Edades 3-6: Chequeos anuales. Edades 7-18: Chequeos anuales. Estas visitas incluyen seguimiento del crecimiento, evaluaciones del desarrollo, exámenes, inmunizaciones y abordar las preocupaciones de los padres. Es posible que se necesiten visitas más frecuentes para niños con afecciones crónicas o problemas de desarrollo."
    },
    "fever": {
      en: "For children, fever is typically defined as a temperature of 100.4°F (38°C) or higher. How to manage: For babies under 3 months with any fever, contact your doctor immediately. For older children, focus on comfort rather than normalizing temperature. Dress in light clothing and ensure they're not overheated. Offer fluids frequently to prevent dehydration. Acetaminophen or ibuprofen (for children over 6 months) may be given according to package instructions. When to seek medical attention: fever in an infant under 3 months, fever above 102.2°F in a child 3-36 months that persists, fever above 104°F in any child, fever with rash, neck stiffness, severe headache, breathing difficulty, unusual drowsiness, or persistent vomiting.",
      es: "Para los niños, la fiebre se define típicamente como una temperatura de 38°C o más alta. Cómo manejarla: Para bebés menores de 3 meses con cualquier fiebre, contacte a su médico inmediatamente. Para niños mayores, concéntrese en la comodidad en lugar de normalizar la temperatura. Vista con ropa ligera y asegúrese de que no estén sobrecalentados. Ofrezca líquidos frecuentemente para prevenir la deshidratación."
    },
    "rash": {
      en: "Childhood rashes are common and have many causes. Common types include: Diaper rash (treat with barrier creams and frequent changes), Heat rash (keep area cool and dry), Eczema (treat with moisturizers and avoid triggers), Contact dermatitis (identify and avoid the irritant), Viral rashes like those from chickenpox or hand-foot-mouth disease. When to seek medical attention: If the rash is accompanied by fever, if it appears purple or like tiny red spots that don't blanch when pressed, if your child seems very ill or lethargic, if the rash is severely painful, if it appears shortly after starting a new medication, or if it's widespread and worsening rapidly.",
      es: "Las erupciones infantiles son comunes y tienen muchas causas. Los tipos comunes incluyen: Dermatitis del pañal (tratar con cremas de barrera y cambios frecuentes), Sarpullido por calor (mantener el área fresca y seca), Eczema (tratar con humectantes y evitar desencadenantes), Dermatitis de contacto (identificar y evitar el irritante), Erupciones virales como las de la varicela o la enfermedad de mano-pie-boca."
    }
  };

  const lowercaseQuery = query.toLowerCase();
  
  // Check for specific pediatric health topics
  if (lowercaseQuery.includes("growth") || lowercaseQuery.includes("milestones")) {
    return responses["growth milestones"][language];
  }
  if (lowercaseQuery.includes("sleep") && (lowercaseQuery.includes("child") || lowercaseQuery.includes("kid") || lowercaseQuery.includes("baby"))) {
    return responses["child sleep"][language];
  }
  if (lowercaseQuery.includes("immune") || (lowercaseQuery.includes("boost") && lowercaseQuery.includes("system"))) {
    return responses["immune system"][language];
  }
  if (lowercaseQuery.includes("weight") && (lowercaseQuery.includes("child") || lowercaseQuery.includes("kid") || lowercaseQuery.includes("healthy"))) {
    return responses["healthy weight"][language];
  }
  if ((lowercaseQuery.includes("wellness") || lowercaseQuery.includes("check-up") || lowercaseQuery.includes("checkup")) && 
      (lowercaseQuery.includes("child") || lowercaseQuery.includes("kid") || lowercaseQuery.includes("often"))) {
    return responses["wellness check"][language];
  }
  if (lowercaseQuery.includes("fever") || (lowercaseQuery.includes("temperature") && lowercaseQuery.includes("high"))) {
    return responses["fever"][language];
  }
  if (lowercaseQuery.includes("rash")) {
    return responses["rash"][language];
  }
  
  // Check for the original topics
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowercaseQuery.includes(keyword)) {
      return response[language];
    }
  }

  return language === "en" 
    ? "I'm in offline mode with limited capabilities. Please try again when online, or ask about common health topics like children's growth milestones, sleep needs, immune system boosting, healthy weight, or wellness check-ups."
    : "Estoy en modo sin conexión con capacidades limitadas. Por favor, inténtalo de nuevo cuando esté en línea, o pregunte sobre temas comunes de salud como hitos de crecimiento infantil, necesidades de sueño, fortalecimiento del sistema inmunológico, peso saludable o chequeos de bienestar.";
};
