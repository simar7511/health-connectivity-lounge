
import * as functions from "firebase-functions";
import fetch from "node-fetch";

interface Message {
  role: string;
  content: string;
}

interface RequestData {
  messages: Message[];
  model: string;
  provider: string;
  language: string;
  apiKey: string;
}

// Handler for the AI chat Cloud Function
export const aiChatHandler = async (data: RequestData, context: functions.https.CallableContext) => {
  try {
    // Basic validation
    if (!data.messages || !data.model || !data.provider || !data.apiKey) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing required parameters"
      );
    }

    // Different handling based on the AI provider
    if (data.provider === "openai") {
      return await handleOpenAIChat(data);
    } else if (data.provider === "llama") {
      return await handleLlamaChat(data);
    } else {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `Unsupported provider: ${data.provider}`
      );
    }
  } catch (error: any) {
    console.error("AI chat error:", error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      "internal",
      error.message || "An unknown error occurred"
    );
  }
};

// Handle OpenAI chat completions
async function handleOpenAIChat(data: RequestData) {
  const { messages, model, apiKey } = data;
  
  const openaiEndpoint = "https://api.openai.com/v1/chat/completions";
  
  const response = await fetch(openaiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error("OpenAI API error:", error);
    
    if (response.status === 401) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Invalid API key"
      );
    } else if (response.status === 429) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        "OpenAI API rate limit exceeded"
      );
    }
    
    throw new functions.https.HttpsError(
      "internal",
      `OpenAI API error: ${error.error?.message || "Unknown error"}`
    );
  }
  
  const result = await response.json();
  
  return {
    response: result.choices[0].message.content,
    model: model,
    provider: "openai"
  };
}

// Handle Llama model via Hugging Face API
async function handleLlamaChat(data: RequestData) {
  const { messages, model, apiKey } = data;
  
  // Format messages for Llama models
  const prompt = formatLlamaPrompt(messages);
  
  const huggingFaceEndpoint = `https://api-inference.huggingface.co/models/${getLlamaModelId(model)}`;
  
  const response = await fetch(huggingFaceEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true
      }
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error("Hugging Face API error:", error);
    
    if (response.status === 401) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Invalid Hugging Face token"
      );
    } else if (response.status === 429) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        "Hugging Face API rate limit exceeded"
      );
    }
    
    throw new functions.https.HttpsError(
      "internal",
      `Hugging Face API error: ${error}`
    );
  }
  
  const result = await response.json();
  
  // Extract the generated text
  const generatedText = result[0]?.generated_text || result.generated_text;
  
  // Clean up the response to extract only the assistant's reply
  const cleanedResponse = extractLlamaResponse(generatedText, prompt);
  
  return {
    response: cleanedResponse,
    model: model,
    provider: "llama"
  };
}

// Format messages for Llama models
function formatLlamaPrompt(messages: Message[]): string {
  let prompt = "";
  
  messages.forEach((message) => {
    if (message.role === "system") {
      prompt += `<s>[INST] <<SYS>>\n${message.content}\n<</SYS>>\n\n`;
    } else if (message.role === "user") {
      if (prompt === "") {
        prompt += `<s>[INST] ${message.content} [/INST]`;
      } else {
        prompt += `[INST] ${message.content} [/INST]`;
      }
    } else if (message.role === "assistant") {
      prompt += ` ${message.content} </s>`;
    }
  });
  
  return prompt;
}

// Extract Llama's response from the generated text by removing the prompt
function extractLlamaResponse(generatedText: string, prompt: string): string {
  if (!generatedText) return "";
  
  // Remove the prompt from the beginning of the response
  let response = generatedText.substring(prompt.length).trim();
  
  // Clean up any trailing tags or markers
  response = response.replace(/<\/s>$/, "").trim();
  
  return response;
}

// Map model names to Hugging Face model IDs
function getLlamaModelId(model: string): string {
  const modelMap: {[key: string]: string} = {
    "llama-2-7b": "meta-llama/Llama-2-7b",
    "llama-2-13b": "meta-llama/Llama-2-13b",
    "llama-2-7b-chat": "meta-llama/Llama-2-7b-chat",
    "llama-2-13b-chat": "meta-llama/Llama-2-13b-chat"
  };
  
  return modelMap[model] || "meta-llama/Llama-2-7b-chat";
}
