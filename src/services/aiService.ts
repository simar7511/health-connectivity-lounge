
import { AIMessage } from "./fakeAIService";
import { OfflineModeType } from "@/utils/offlineHelpers";
import { useToast } from "@/hooks/use-toast";

/**
 * A service to handle AI interactions without Firebase dependency
 */
export class AIService {
  private apiKey: string;
  private model: string;
  private language: "en" | "es";
  private offlineMode: OfflineModeType;
  private isOnline: boolean;
  private quotaExceeded: boolean = false;
  
  // In-memory storage for chat history
  private chatHistory: Record<string, AIMessage[]> = {};
  
  constructor(options: {
    apiKey?: string;
    model?: string;
    language?: "en" | "es";
    offlineMode?: OfflineModeType;
    isOnline?: boolean;
  } = {}) {
    this.apiKey = options.apiKey || localStorage.getItem("openai_api_key") || "";
    this.model = options.model || "gpt-4o";
    this.language = options.language || "en";
    this.offlineMode = options.offlineMode || "simulated";
    this.isOnline = options.isOnline !== undefined ? options.isOnline : true;
    
    console.log(`AI Service initialized: Model=${this.model}, Online=${this.isOnline}, Mode=${this.offlineMode}`);
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

  /**
   * Validate OpenAI API key format
   */
  private isValidOpenAIKey(apiKey: string): boolean {
    return (apiKey.startsWith('sk-') || apiKey.startsWith('sk-proj-')) && apiKey.length > 20;
  }

  /**
   * Check if quota is exceeded
   */
  isQuotaExceeded(): boolean {
    return this.quotaExceeded;
  }

  /**
   * Reset quota exceeded status - can be called after a new API key is set
   */
  resetQuotaStatus(): void {
    this.quotaExceeded = false;
    console.log('API quota status reset');
  }
  
  /**
   * Get current API status info
   */
  getApiStatus(): {
    hasValidKey: boolean,
    isOnline: boolean,
    offlineMode: OfflineModeType,
    quotaExceeded: boolean,
    model: string
  } {
    return {
      hasValidKey: this.isValidOpenAIKey(this.apiKey),
      isOnline: this.isOnline,
      offlineMode: this.offlineMode,
      quotaExceeded: this.quotaExceeded,
      model: this.model
    };
  }

  /**
   * Send a message to the AI and get a response
   */
  async sendMessage(
    message: string, 
    conversationId?: string,
    fullConversation: AIMessage[] = []
  ): Promise<AIMessage> {
    const chatId = conversationId || `chat-${Date.now()}`;
    
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date()
    };
    
    if (!this.chatHistory[chatId]) {
      this.chatHistory[chatId] = [];
    }
    
    this.chatHistory[chatId].push(userMessage);
    
    // Validate OpenAI key and online status
    const hasValidKey = this.isValidOpenAIKey(this.apiKey);
    
    console.log(`API Status - Key valid: ${hasValidKey}, Online: ${this.isOnline}, Quota Exceeded: ${this.quotaExceeded}, Mode: ${this.offlineMode}`);
    
    // Try OpenAI if we're online and have a valid key and no quota issues
    if (this.isOnline && hasValidKey && !this.quotaExceeded) {
      try {
        console.log('Attempting to use OpenAI API...');
        return await this.sendToOpenAI(message, chatId, fullConversation);
      } catch (error: any) {
        console.error('OpenAI API Error:', error);
        
        // Check for quota exceeded error
        if (error.message && error.message.includes('quota')) {
          console.log('API quota exceeded, switching to offline mode');
          this.quotaExceeded = true;
          
          // Create an error message to show to the user
          const errorMessage: AIMessage = {
            id: `error-${Date.now()}`,
            role: "system",
            content: this.language === "en"
              ? "⚠️ OpenAI API quota exceeded. The health assistant will continue functioning using simulated responses. Please update your API key in settings."
              : "⚠️ Cuota de API de OpenAI excedida. El asistente de salud continuará funcionando con respuestas simuladas. Por favor, actualice su clave API en configuración.",
            timestamp: new Date()
          };
          
          this.chatHistory[chatId].push(errorMessage);
        }
        
        return this.generateOfflineResponse(message, chatId);
      }
    } else {
      // Log reason for using offline mode
      if (!hasValidKey) {
        console.log('Using offline mode: Invalid API key');
      } else if (!this.isOnline) {
        console.log('Using offline mode: Device offline');
      } else if (this.quotaExceeded) {
        console.log('Using offline mode: API quota exceeded');
      }
      
      return this.generateOfflineResponse(message, chatId);
    }
  }
  
  /**
   * Send message to OpenAI API
   */
  private async sendToOpenAI(
    message: string,
    chatId: string,
    previousMessages: AIMessage[] = []
  ): Promise<AIMessage> {
    // Prepare conversation history for API
    const messageHistory = previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add system message to guide the AI based on language
    const systemMessage = {
      role: "system",
      content: this.language === "en" 
        ? "You are a pediatric health assistant. Provide helpful, evidence-based information about children's health, development, common conditions, and wellness. Include information on topics like child development, infant feeding, childhood vaccinations, common childhood illnesses, children's sleep, nutrition, and behavioral issues. Always clarify you're not providing medical advice and encourage seeking professional medical care when appropriate. Keep responses concise and parent-friendly."
        : "Eres un asistente de salud pediátrica. Proporciona información útil y basada en evidencia sobre la salud, el desarrollo, las afecciones comunes y el bienestar de los niños. Incluye información sobre temas como el desarrollo infantil, la alimentación infantil, las vacunas infantiles, las enfermedades infantiles comunes, el sueño de los niños, la nutrición y los problemas de comportamiento. Siempre aclara que no estás proporcionando consejo médico y anima a buscar atención médica profesional cuando sea apropiado. Mantén las respuestas concisas y amigables para los padres."
    };
    
    // Create array with system message and history for API
    const apiMessages = [
      systemMessage,
      ...messageHistory,
      { role: "user", content: message }
    ];
    
    console.log(`Sending request to OpenAI with API key: ${this.apiKey.substring(0, 7)}... and model: ${this.model}`);
    
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
      console.error("OpenAI API error response:", errorData);
      
      // Special handling for quota errors
      if (errorData.error?.code === "insufficient_quota") {
        this.quotaExceeded = true;
        throw new Error(`OpenAI API quota exceeded: ${errorData.error?.message || "Insufficient quota"}`);
      }
      
      throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`);
    }
    
    // Parse API response
    const responseData = await response.json();
    console.log("Received successful response from OpenAI");
    const aiContent = responseData.choices[0]?.message?.content || "No response generated.";
    
    // Create AI response message
    const aiResponse: AIMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: aiContent,
      timestamp: new Date()
    };
    
    // Store AI response in local history
    this.chatHistory[chatId].push(aiResponse);
    
    return aiResponse;
  }
  
  /**
   * Generate offline response from local data
   */
  private async generateOfflineResponse(
    message: string,
    chatId: string
  ): Promise<AIMessage> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Import offline helper function
    const { getSampleResponse } = await import('@/utils/offlineHelpers');
    
    console.log(`Using offline response in ${this.language} for message: "${message}"`);
    
    // Generate AI response using the sample responses
    const aiResponseContent = getSampleResponse(message, this.language);
    
    // Create AI response message
    const aiResponse: AIMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: aiResponseContent,
      timestamp: new Date()
    };
    
    // Store AI response in local history
    this.chatHistory[chatId].push(aiResponse);
    
    return aiResponse;
  }
  
  /**
   * Get the chat history from local memory
   */
  async getChatHistory(conversationId: string): Promise<AIMessage[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.chatHistory[conversationId] || [];
  }
  
  /**
   * Clear local chat history
   */
  async clearChat(conversationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.chatHistory[conversationId] = [];
  }
  
  /**
   * Set the API key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    
    // Reset quota exceeded flag when a new API key is set
    if (apiKey !== localStorage.getItem("openai_api_key")) {
      this.resetQuotaStatus();
    }
    
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
   * Update online status
   */
  setOnlineStatus(isOnline: boolean): void {
    this.isOnline = isOnline;
    console.log(`Online status set to: ${isOnline}`);
  }
  
  /**
   * Update offline mode
   */
  setOfflineMode(mode: OfflineModeType): void {
    this.offlineMode = mode;
    console.log(`Offline mode set to: ${mode}`);
  }
}

// Create and export a singleton instance
export const aiService = new AIService();
