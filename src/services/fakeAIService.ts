
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
 * Fully offline AI service with no external dependencies
 * This service operates completely offline with no Firebase or external API calls
 */
export class FakeAIService {
  private apiKey: string;
  private model: string;
  private language: "en" | "es";
  
  constructor(options: AIServiceOptions = {}) {
    this.apiKey = options.apiKey || "fake-api-key-12345";
    this.model = options.model || "gpt-4o-fake";
    this.language = options.language || "en";
  }
  
  /**
   * Offline simulation of sending a message to an AI and getting a response
   * No external calls are made - all processing happens locally
   */
  async sendMessage(
    message: string, 
    conversationId?: string,
    fullConversation: AIMessage[] = []
  ): Promise<AIMessage> {
    if (!this.apiKey || this.apiKey === "invalid-key") {
      throw new Error("Invalid API key");
    }
    
    // Create conversation ID if not provided
    const chatId = conversationId || `chat-${Date.now()}`;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, API_DELAY));
    
    // Create user message
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date()
    };
    
    // Store in local chat history (no Firebase)
    if (!chatHistory[chatId]) {
      chatHistory[chatId] = [];
    }
    
    chatHistory[chatId].push(userMessage);
    
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
    chatHistory[chatId].push(aiResponse);
    
    return aiResponse;
  }
  
  /**
   * Get the chat history from local memory (no Firebase)
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
  }
  
  /**
   * Set the AI model
   */
  setModel(model: string): void {
    this.model = model;
  }
  
  /**
   * Set the language
   */
  setLanguage(language: "en" | "es"): void {
    this.language = language;
  }
}

// Create and export a singleton instance with no dependencies on Firebase
export const fakeAIService = new FakeAIService();
