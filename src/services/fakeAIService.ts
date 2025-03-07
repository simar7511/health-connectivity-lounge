
import { getSampleResponse } from "@/utils/offlineHelpers";

// Types
export interface AIMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

interface AIServiceOptions {
  apiKey?: string;
  model?: string;
  language?: "en" | "es";
}

// Simulated delay for API calls (ms)
const API_DELAY = 1000;

// Simple in-memory storage for chat history (no Firebase)
const chatHistory: Record<string, AIMessage[]> = {};

/**
 * AI service that can operate in offline mode or connect to OpenAI API
 * This service can work with or without an API key
 */
export class FakeAIService {
  private apiKey: string;
  private model: string;
  private language: "en" | "es";
  
  constructor(options: AIServiceOptions = {}) {
    this.apiKey = options.apiKey || "";
    this.model = options.model || "health-assistant-model";
    this.language = options.language || "en";
  }
  
  /**
   * Send a message to the AI and get a response
   * If a valid OpenAI API key is provided, it will use the OpenAI API
   * Otherwise, it falls back to offline simulation
   */
  async sendMessage(
    message: string, 
    conversationId?: string,
    fullConversation: AIMessage[] = []
  ): Promise<AIMessage> {
    // Create conversation ID if not provided
    const chatId = conversationId || `chat-${Date.now()}`;
    
    // Auto-detect language from message
    const detectedLanguage = this.detectLanguage(message);
    
    // Create user message
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date()
    };
    
    // Store in local chat history
    if (!chatHistory[chatId]) {
      chatHistory[chatId] = [];
    }
    
    chatHistory[chatId].push(userMessage);
    
    // Check if we have a valid OpenAI API key (starts with "sk-")
    const isValidOpenAIKey = this.apiKey && this.apiKey.startsWith("sk-");
    
    if (isValidOpenAIKey) {
      try {
        // Attempt to use OpenAI API
        return await this.sendToOpenAI(message, chatId, fullConversation, detectedLanguage);
      } catch (error) {
        console.error("Error with OpenAI API:", error);
        // Fallback to offline mode if OpenAI API fails
        return this.generateOfflineResponse(message, chatId, detectedLanguage);
      }
    } else {
      // Use offline mode
      return this.generateOfflineResponse(message, chatId, detectedLanguage);
    }
  }
  
  /**
   * Send message to OpenAI API
   */
  private async sendToOpenAI(
    message: string,
    chatId: string,
    previousMessages: AIMessage[] = [],
    responseLanguage: "en" | "es"
  ): Promise<AIMessage> {
    // Prepare conversation history for API
    const messageHistory = previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add system message to guide the AI based on language
    const systemMessage = {
      role: "system",
      content: responseLanguage === "en" 
        ? "You are a pediatric health assistant. Provide helpful, evidence-based information about children's health, development, common conditions, and wellness. Include information on topics like child development, infant feeding, childhood vaccinations, common childhood illnesses, children's sleep, nutrition, and behavioral issues. Always clarify you're not providing medical advice and encourage seeking professional medical care when appropriate. Keep responses concise and parent-friendly."
        : "Eres un asistente de salud pediátrica. Proporciona información útil y basada en evidencia sobre la salud, el desarrollo, las afecciones comunes y el bienestar de los niños. Incluye información sobre temas como el desarrollo infantil, la alimentación infantil, las vacunas infantiles, las enfermedades infantiles comunes, el sueño de los niños, la nutrición y los problemas de comportamiento. Siempre aclara que no estás proporcionando consejo médico y anima a buscar atención médica profesional cuando sea apropiado. Mantén las respuestas concisas y amigables para los padres."
    };
    
    // Create array with system message and history for API
    const apiMessages = [
      systemMessage,
      ...messageHistory,
      { role: "user", content: message }
    ];
    
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model.startsWith("gpt") ? this.model : "gpt-4o",
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 1000,
      })
    });
    
    // Check for API errors
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`);
    }
    
    // Parse API response
    const responseData = await response.json();
    const aiContent = responseData.choices[0]?.message?.content || "No response generated.";
    
    // Create AI response message
    const aiResponse: AIMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: aiContent,
      timestamp: new Date()
    };
    
    // Store AI response in local history
    chatHistory[chatId].push(aiResponse);
    
    return aiResponse;
  }
  
  /**
   * Generate offline response (when no API key or API call fails)
   */
  private async generateOfflineResponse(
    message: string,
    chatId: string,
    responseLanguage: "en" | "es"
  ): Promise<AIMessage> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, API_DELAY));
    
    console.log(`Using offline response in ${responseLanguage} for message: "${message}"`);
    
    // Generate AI response using the sample responses
    const aiResponseContent = getSampleResponse(message, responseLanguage);
    
    // Create AI response message
    const aiResponse: AIMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: aiResponseContent,
      timestamp: new Date()
    };
    
    // Store AI response in local history
    chatHistory[chatId].push(aiResponse);
    
    return aiResponse;
  }
  
  /**
   * Get the chat history from local memory
   */
  async getChatHistory(conversationId: string): Promise<AIMessage[]> {
    await new Promise(resolve => setTimeout(resolve, API_DELAY / 2));
    return chatHistory[conversationId] || [];
  }
  
  /**
   * Clear local chat history
   */
  async clearChat(conversationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, API_DELAY / 2));
    chatHistory[conversationId] = [];
  }
  
  /**
   * Set the API key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    console.log(`API key ${apiKey ? "set" : "cleared"}: ${apiKey ? apiKey.substring(0, 5) + "..." : ""}`);
  }
  
  /**
   * Set the AI model
   */
  setModel(model: string): void {
    this.model = model;
    console.log(`Model set to: ${model}`);
  }
  
  /**
   * Set the language
   */
  setLanguage(language: "en" | "es"): void {
    this.language = language;
    console.log(`Language set to: ${language}`);
  }
  
  /**
   * Detect language of text
   * Uses simple pattern matching for Spanish characters and common Spanish words
   */
  detectLanguage(text: string): "en" | "es" {
    // Spanish patterns: accented characters and common Spanish words
    const spanishPatterns = /[áéíóúüñ¿¡]|(\b(hola|como|qué|donde|cuando|por qué|gracias|salud|español|si|no|ayuda|dia|bien|quien)\b)/i;
    
    const isSpanish = spanishPatterns.test(text);
    console.log(`Language detection for "${text.substring(0, 20)}...": ${isSpanish ? "Spanish" : "English"}`);
    
    return isSpanish ? "es" : "en";
  }
}

// Create and export a singleton instance
export const fakeAIService = new FakeAIService();
