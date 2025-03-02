
import * as functions from "firebase-functions";

// System prompts based on language
const systemPrompts: Record<string, string> = {
  en: `You are an AI Health Assistant for a free healthcare clinic. 
Your role is to provide helpful, accurate general health information while being compassionate and culturally sensitive.

Key guidelines:
1. Provide clear, accurate health information based on established medical knowledge.
2. Emphasize that you are not a doctor and cannot provide personalized medical advice or diagnoses.
3. For any concerning or emergency symptoms, advise the user to seek immediate medical attention.
4. Be compassionate and understanding - many patients may have limited healthcare access.
5. Be culturally sensitive and aware that patients may come from diverse backgrounds.
6. Keep responses concise (under 150 words) and easy to understand.
7. Avoid medical jargon when possible, or explain it when necessary.
8. Never claim to diagnose conditions or prescribe specific treatments.
9. For any unclear questions, err on the side of caution and suggest consulting a healthcare provider.

Remember: Your goal is to provide helpful general health information while encouraging appropriate care-seeking behavior.`,

  es: `Eres un Asistente de Salud IA para una clínica de salud gratuita.
Tu función es proporcionar información general de salud útil y precisa mientras eres compasivo y culturalmente sensible.

Pautas clave:
1. Proporciona información clara y precisa sobre la salud basada en conocimientos médicos establecidos.
2. Enfatiza que no eres un médico y no puedes proporcionar consejos médicos personalizados ni diagnósticos.
3. Para cualquier síntoma preocupante o de emergencia, aconseja al usuario que busque atención médica inmediata.
4. Sé compasivo y comprensivo - muchos pacientes pueden tener acceso limitado a la atención médica.
5. Sé culturalmente sensible y consciente de que los pacientes pueden provenir de diversos orígenes.
6. Mantén las respuestas concisas (menos de 150 palabras) y fáciles de entender.
7. Evita la jerga médica cuando sea posible, o explícala cuando sea necesario.
8. Nunca afirmes diagnosticar condiciones o prescribir tratamientos específicos.
9. Para cualquier pregunta poco clara, decántate por la precaución y sugiere consultar a un proveedor de atención médica.

Recuerda: Tu objetivo es proporcionar información general útil sobre la salud mientras fomentas un comportamiento adecuado de búsqueda de atención.`
};

interface Message {
  role: string;
  content: string;
}

export const aiChat = functions.https.onRequest(async (request, response) => {
  // Enable CORS
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    response.status(204).send('');
    return;
  }
  
  if (request.method !== 'POST') {
    response.status(405).send({ error: 'Method not allowed' });
    return;
  }

  try {
    const { messages, model, provider, language = "en" } = request.body;
    
    if (!messages || !Array.isArray(messages)) {
      response.status(400).send({ error: "Messages array is required" });
      return;
    }

    if (provider === "openai") {
      // Handle OpenAI request
      const apiKey = request.headers.authorization?.split(' ')[1];
      if (!apiKey) {
        response.status(401).send({ error: "OpenAI API key not provided" });
        return;
      }

      // Get system prompt based on language
      const systemPrompt = systemPrompts[language] || systemPrompts.en;
      
      // Ensure the first message is a system message
      let processedMessages = [...messages];
      if (messages[0]?.role !== "system") {
        processedMessages.unshift({ role: "system", content: systemPrompt });
      }

      // Make request to OpenAI API
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model || "gpt-4o",
          messages: processedMessages,
          temperature: 0.3,
          max_tokens: 500
        })
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.text();
        console.error("OpenAI API error:", errorData);
        response.status(openaiResponse.status).send({ 
          error: `OpenAI API error: ${openaiResponse.status}`,
          details: errorData
        });
        return;
      }

      const data = await openaiResponse.json();
      response.status(200).send({ response: data.choices[0].message.content });
    } 
    else if (provider === "llama") {
      // Handle Llama/HuggingFace request
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
        response.status(401).send({ error: "HuggingFace token not provided" });
        return;
      }

      // Combine messages into a prompt for Llama
      let prompt = "";
      messages.forEach((msg: Message) => {
        if (msg.role === "system") {
          prompt += "System: " + msg.content + "\n\n";
        } else if (msg.role === "user") {
          prompt += "User: " + msg.content + "\n\n";
        } else if (msg.role === "assistant") {
          prompt += "Assistant: " + msg.content + "\n\n";
        }
      });
      prompt += "Assistant: ";

      // Call the Llama 2 model via HuggingFace Inference API
      const llamaResponse = await fetch('https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.5,
            top_p: 0.9,
            do_sample: true
          }
        })
      });

      if (!llamaResponse.ok) {
        const errorData = await llamaResponse.text();
        console.error("Llama API error:", errorData);
        response.status(llamaResponse.status).send({ 
          error: `Llama API error: ${llamaResponse.status}`,
          details: errorData
        });
        return;
      }

      const data = await llamaResponse.json();
      const generatedText = data[0]?.generated_text || "";
      
      // Extract just the assistant's response
      const assistantResponse = generatedText.substring(prompt.length);
      
      response.status(200).send({ response: assistantResponse.trim() });
    } 
    else {
      response.status(400).send({ error: "Invalid provider specified" });
    }
  } catch (error) {
    console.error("Error processing AI chat request:", error);
    response.status(500).send({ 
      error: "Internal server error", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});
