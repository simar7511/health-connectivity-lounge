
import * as functions from "firebase-functions";
import fetch from "node-fetch";

// System prompts based on language
const systemPrompts = {
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

export const aiHealthAssistant = functions.https.onRequest(async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  
  // Handle preflight requests
  if (request.method === "OPTIONS") {
    response.set("Access-Control-Allow-Methods", "GET, POST");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    response.status(204).send("");
    return;
  }
  
  if (request.method !== "POST") {
    response.status(405).send({ error: "Method not allowed" });
    return;
  }

  try {
    const { message, language = "en", previousMessages = [] } = request.body;
    
    if (!message) {
      response.status(400).send({ error: "Message is required" });
      return;
    }

    // Get API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      response.status(500).send({ error: "OpenAI API key not configured" });
      return;
    }

    // Format messages for OpenAI API
    const messages = [
      { role: "system", content: systemPrompts[language] },
      ...previousMessages.slice(-5), // Include last 5 messages for context
      { role: "user", content: message }
    ];

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages,
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("OpenAI API error:", errorData);
      response.status(openaiResponse.status).send({ 
        error: "Error from OpenAI API", 
        details: errorData
      });
      return;
    }

    const data = await openaiResponse.json();
    const aiResponse = data.choices[0].message.content;

    response.status(200).send({ response: aiResponse });
  } catch (error) {
    console.error("Error:", error);
    response.status(500).send({ 
      error: "Internal server error", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});
