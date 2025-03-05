
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";

// Define the request data type
export interface RequestData {
  messages: Array<{role: string, content: string}>;
  model: string;
  provider: string;
  language: string;
  apiKey?: string;
}

// Function handler for AI chat
export const aiChatHandler = async (
  request: functions.https.CallableRequest<RequestData>
) => {
  try {
    const data = request.data;
    
    if (!data || !data.messages || !data.model || !data.provider) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields: messages, model, provider'
      );
    }

    // Choose the appropriate AI provider
    if (data.provider === 'openai') {
      return await handleOpenAIRequest(data);
    } else if (data.provider === 'llama') {
      return await handleLlamaRequest(data);
    } else {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Unsupported provider: ${data.provider}`
      );
    }
  } catch (error: any) {
    console.error('Error in AI chat handler:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'An unknown error occurred',
      error
    );
  }
};

// Handler for OpenAI requests
async function handleOpenAIRequest(data: RequestData) {
  try {
    // Replace with actual OpenAI API endpoint
    const apiKey = data.apiKey || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: data.model,
        messages: data.messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${error}`);
    }
    
    const result = await response.json();
    return {
      response: result.choices[0].message.content,
      model: data.model,
      provider: data.provider
    };
  } catch (error: any) {
    console.error('Error in OpenAI request:', error);
    throw error;
  }
}

// Handler for Llama requests
async function handleLlamaRequest(data: RequestData) {
  try {
    // For local development, use a simulated response
    // In production, this would call your Llama model API
    const simulatedResponse = `This is a simulated response from the ${data.model} model.`;
    
    // In a real implementation, you would make an API call to your Llama service
    return {
      response: simulatedResponse,
      model: data.model,
      provider: data.provider
    };
  } catch (error: any) {
    console.error('Error in Llama request:', error);
    throw error;
  }
}
