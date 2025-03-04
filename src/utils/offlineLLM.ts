
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
  if (offlineModel && !config.modelName) {
    return true; // Model already loaded
  }

  if (isModelLoading) {
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
    offlineModel = await pipeline(
      "text-generation",
      modelConfig.modelName,
      { 
        quantized: true, // Use quantized model for smaller size
        progress_callback: (progress) => {
          console.log(`Model loading progress: ${Math.round(progress * 100)}%`);
        }
      }
    );

    modelConfig.loaded = true;
    console.log("✅ Offline LLM model loaded successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to load offline LLM model:", error);
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
