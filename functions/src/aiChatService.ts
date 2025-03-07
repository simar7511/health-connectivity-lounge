
import * as functions from "firebase-functions";
import fetch from "node-fetch";
import * as dotenv from "dotenv";

// Initialize dotenv to load environment variables
dotenv.config();

// Get the OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Firebase Cloud Function that handles AI chat requests
 */
export const aiChat = functions.https.onCall(async (data, context) => {
  try {
    // Validate authentication if user is not authenticated
    if (!context.auth && !context.app) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated to use this feature."
      );
    }

    // Extract data from the request
    const { messages, model = "gpt-4o", provider = "openai", language = "en" } = data;

    // Validate required parameters
    if (!messages || !Array.isArray(messages)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Messages must be provided as an array."
      );
    }

    let response;

    if (provider === "openai") {
      // Using OpenAI API
      if (!OPENAI_API_KEY) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "OpenAI API key not configured."
        );
      }

      // Prepare system prompt to guide AI behavior
      const systemMessage = {
        role: "system", 
        content: language === "en" 
          ? "You are an AI health assistant designed to provide clear, evidence-based health information. Your goal is to help users understand general health topics, symptoms, wellness tips, and lifestyle advice in a supportive and non-diagnostic manner. Always clarify that you are not a substitute for professional medical advice and encourage users to seek a healthcare provider for personalized concerns. Keep responses brief, user-friendly, and easy to understand, avoiding unnecessary medical jargon."
          : "Eres un asistente de salud de IA diseñado para proporcionar información de salud clara y basada en evidencia. Tu objetivo es ayudar a los usuarios a comprender temas generales de salud, síntomas, consejos de bienestar y consejos de estilo de vida de manera solidaria y no diagnóstica. Siempre aclara que no eres un sustituto del consejo médico profesional y anima a los usuarios a buscar un proveedor de atención médica para consultas personalizadas. Mantén las respuestas breves, fáciles de usar y fáciles de entender, evitando la jerga médica innecesaria."
      };

      // Include the system message if not already present
      const processedMessages = messages[0]?.role === "system" 
        ? messages 
        : [systemMessage, ...messages];

      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          messages: processedMessages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      const responseData = await response.json();

      if (responseData.error) {
        console.error("OpenAI API error:", responseData.error);
        throw new functions.https.HttpsError(
          "internal",
          `OpenAI API error: ${responseData.error.message || "Unknown error"}`
        );
      }

      return {
        response: responseData.choices[0]?.message?.content || "No response generated."
      };
    } else if (provider === "llama") {
      // Handle Llama model from local proxy or another service
      throw new functions.https.HttpsError(
        "unimplemented",
        "Llama models are only available in offline mode."
      );
    } else {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `Unsupported provider: ${provider}`
      );
    }
  } catch (error) {
    console.error("AI Chat error:", error);
    throw new functions.https.HttpsError(
      "internal",
      error instanceof Error ? error.message : "Unknown error in AI Chat function"
    );
  }
});
