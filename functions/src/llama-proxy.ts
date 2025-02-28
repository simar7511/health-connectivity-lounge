
import * as functions from "firebase-functions";
import * as cors from "cors";
import * as express from "express";
import * as dotenv from "dotenv";
import fetch from "node-fetch";

// Load environment variables
dotenv.config();

// Create an Express app
const app = express();

// Enable CORS
app.use(cors({ origin: true }));

// Define the endpoint that will proxy requests to Hugging Face
app.post("/generate", async (req, res) => {
  try {
    const { prompt, model, max_new_tokens, temperature, top_p, do_sample } = req.body;
    
    // Get the Hugging Face token from environment variables
    const huggingFaceToken = process.env.HUGGING_FACE_TOKEN;
    
    if (!huggingFaceToken) {
      return res.status(500).json({
        error: "No Hugging Face token found. Make sure to set the HUGGING_FACE_TOKEN environment variable.",
      });
    }

    if (!prompt) {
      return res.status(400).json({
        error: "No prompt provided",
      });
    }

    // Map simple model names to their Hugging Face model IDs
    const modelMapping: {[key: string]: string} = {
      "llama-2-7b": "meta-llama/llama-2-7b-hf",
      "llama-2-13b": "meta-llama/llama-2-13b-hf",
      "llama-2-7b-chat": "meta-llama/llama-2-7b-chat-hf",
      "llama-2-13b-chat": "meta-llama/llama-2-13b-chat-hf",
    };

    // Get the full model ID or default to llama-2-7b-chat
    const modelId = modelMapping[model] || modelMapping["llama-2-7b-chat"];

    console.log(`Calling Hugging Face API for model: ${modelId} with prompt: ${prompt.substring(0, 50)}...`);

    // Call the Hugging Face API
    const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${huggingFaceToken}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: max_new_tokens || 500,
          temperature: temperature || 0.7,
          top_p: top_p || 0.95,
          do_sample: do_sample !== undefined ? do_sample : true,
          return_full_text: false,
        },
      }),
    });

    // Check if the API call was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Hugging Face API error: ${response.status} ${response.statusText}`, errorText);
      
      if (response.status === 503) {
        return res.status(503).json({
          error: "The model is currently loading. Please try again in a moment.",
        });
      }
      
      return res.status(response.status).json({
        error: `Hugging Face API error: ${response.status} ${response.statusText}`,
        details: errorText,
      });
    }

    // Parse the API response
    const data = await response.json();
    
    // Extract the generated text
    let generatedText;
    
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      // Format returned by newer Hugging Face API
      generatedText = data[0].generated_text;
    } else if (data.generated_text) {
      // Format returned by older Hugging Face API
      generatedText = data.generated_text;
    } else {
      // Fallback
      generatedText = JSON.stringify(data);
    }

    // Send the generated text back to the client
    return res.status(200).json({ generated_text: generatedText });
  } catch (error) {
    console.error("Error proxying to Hugging Face:", error);
    return res.status(500).json({
      error: "An error occurred while communicating with the Hugging Face API",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Export the Express app as a Cloud Function
export const llamaProxy = functions.https.onRequest(app);
