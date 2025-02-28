
# Deploying the Health Assistant Inference API on Hugging Face Spaces

This guide explains how to deploy a serverless AI inference endpoint for your Health Assistant using Hugging Face Spaces.

## What are Hugging Face Spaces?

[Hugging Face Spaces](https://huggingface.co/spaces) provides a simple way to host ML demos, applications, and inference endpoints. The free tier offers generous resources that are sufficient for running Llama 2 models for your Health Assistant.

## Step 1: Create a Hugging Face Account

1. Go to [Hugging Face](https://huggingface.co/) and sign up for an account if you don't already have one.
2. Once logged in, go to your profile settings and create an API token (you'll need this for authentication).

## Step 2: Create a New Space

1. Go to [Hugging Face Spaces](https://huggingface.co/spaces)
2. Click "Create new Space"
3. Select "Gradio" as the SDK
4. Choose a name for your space (e.g., "health-connectivity-llama-assistant")
5. Set visibility to "Public" (or "Private" if you prefer)
6. Create the space

## Step 3: Create the Inference API

Create the following files in your Space:

### File: `app.py`

```python
import os
import gradio as gr
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Environment variables can be set in the Space settings
SELECTED_MODEL = os.environ.get("SELECTED_MODEL", "meta-llama/llama-2-7b-chat-hf")

# Get FastAPI app from Gradio
app = gr.routes.App.get_app()

# Add CORS middleware to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Define which models are available
AVAILABLE_MODELS = {
    "llama-2-7b": "meta-llama/llama-2-7b-hf",
    "llama-2-13b": "meta-llama/llama-2-13b-hf",
    "llama-2-7b-chat": "meta-llama/llama-2-7b-chat-hf",
    "llama-2-13b-chat": "meta-llama/llama-2-13b-chat-hf"
}

def load_model(model_name):
    """Load the specified model."""
    print(f"Loading model: {model_name}")
    
    # Get the Hugging Face model ID
    model_id = AVAILABLE_MODELS.get(model_name, AVAILABLE_MODELS["llama-2-7b-chat"])
    
    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        torch_dtype=torch.float16,  # Use float16 for memory efficiency
        device_map="auto",          # Automatically decide device placement
        low_cpu_mem_usage=True      # Optimize for lower memory usage
    )
    
    return model, tokenizer

# Initialize a variable to hold the loaded model and tokenizer
loaded_model = None
loaded_tokenizer = None
loaded_model_name = None

def get_model(model_name):
    """Get the specified model, loading it if necessary."""
    global loaded_model, loaded_tokenizer, loaded_model_name
    
    # If no model is loaded yet or a different model is requested, load it
    if loaded_model is None or model_name != loaded_model_name:
        loaded_model, loaded_tokenizer = load_model(model_name)
        loaded_model_name = model_name
    
    return loaded_model, loaded_tokenizer

def generate_response(inputs, model="llama-2-7b-chat", max_new_tokens=500, temperature=0.7, top_p=0.95, do_sample=True):
    """Generate a response using the selected model."""
    try:
        # Get the model and tokenizer
        model_to_use, tokenizer = get_model(model)
        
        # Generate text
        input_ids = tokenizer.encode(inputs, return_tensors="pt").to(model_to_use.device)
        
        # Set up generation parameters
        gen_params = {
            "input_ids": input_ids,
            "max_new_tokens": int(max_new_tokens),
            "temperature": float(temperature),
            "top_p": float(top_p),
            "do_sample": bool(do_sample),
            "pad_token_id": tokenizer.eos_token_id
        }
        
        # Generate tokens
        output = model_to_use.generate(**gen_params)
        
        # Decode the output
        generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
        
        # For chat models, we need to extract just the assistant's response
        if "chat" in model:
            # If the prompt includes "Human:" and "Assistant:", extract just the new assistant part
            if "Human:" in inputs and "Assistant:" in inputs:
                parts = generated_text.split("Assistant:")
                if len(parts) > 1:
                    # Get the last assistant response
                    last_part = parts[-1].strip()
                    # Check if there's another Human: after this
                    if "Human:" in last_part:
                        # Only keep the text before the next Human:
                        last_part = last_part.split("Human:")[0].strip()
                    return {"generated_text": last_part}
        
        # For non-chat models or if the extraction didn't work
        # Return just the newly generated part
        new_text = generated_text[len(inputs):].strip()
        return {"generated_text": new_text}
        
    except Exception as e:
        return {"error": str(e)}

# Create the Gradio Interface
with gr.Blocks() as demo:
    gr.Markdown("# Health Assistant AI API")
    gr.Markdown("This space provides an API endpoint for the Health Connectivity Llama 2 Assistant.")
    
    with gr.Tab("API Documentation"):
        gr.Markdown("""
        ## API Usage
        
        This Space exposes an API endpoint that can be called from your application.
        
        ### HTTP Endpoint
        
        **URL:** `[Space URL]/api/predict`
        
        **Method:** POST
        
        **Headers:**
        - `Content-Type: application/json`
        - `Authorization: Bearer YOUR_HF_TOKEN` (optional, but required for private models)
        
        **Request Body:**
        ```json
        {
          "inputs": "Your prompt text here",
          "parameters": {
            "model": "llama-2-7b-chat",
            "max_new_tokens": 500,
            "temperature": 0.7,
            "top_p": 0.95,
            "do_sample": true
          }
        }
        ```
        
        **Response:**
        ```json
        {
          "generated_text": "The AI-generated response text"
        }
        ```
        
        ### Available Models
        
        - `llama-2-7b`: Base Llama 2 7B model
        - `llama-2-13b`: Base Llama 2 13B model
        - `llama-2-7b-chat`: Chat-optimized Llama 2 7B model
        - `llama-2-13b-chat`: Chat-optimized Llama 2 13B model
        """)
    
    with gr.Tab("Test Interface"):
        with gr.Row():
            with gr.Column():
                model_dropdown = gr.Dropdown(
                    choices=list(AVAILABLE_MODELS.keys()),
                    value="llama-2-7b-chat",
                    label="Model"
                )
                
                temperature_slider = gr.Slider(
                    minimum=0.1,
                    maximum=1.5,
                    value=0.7,
                    step=0.1,
                    label="Temperature"
                )
                
                max_tokens_slider = gr.Slider(
                    minimum=10,
                    maximum=1024,
                    value=500,
                    step=10,
                    label="Max New Tokens"
                )
                
                input_text = gr.Textbox(
                    lines=10,
                    placeholder="Enter your prompt here...",
                    label="Input"
                )
                
                submit_btn = gr.Button("Generate")
                
            with gr.Column():
                output_text = gr.Textbox(
                    lines=12,
                    label="Generated Output"
                )
        
        submit_btn.click(
            fn=lambda prompt, model, max_tokens, temp: generate_response(
                prompt, model, max_tokens, temp
            )["generated_text"],
            inputs=[input_text, model_dropdown, max_tokens_slider, temperature_slider],
            outputs=output_text
        )

# Launch the interface
demo.queue().launch()
```

### File: `requirements.txt`

```
gradio>=3.50.2
transformers>=4.36.0
torch>=2.0.0
accelerate>=0.25.0
fastapi>=0.100.0
```

## Step 4: Deploy and Configure the Space

1. After creating these files, wait for the Space to build and deploy
2. Once deployed, your Space will have a URL like: `https://huggingface.co/spaces/your-username/health-connectivity-llama-assistant`
3. The API endpoint will be available at: `https://huggingface.co/spaces/your-username/health-connectivity-llama-assistant/api/predict`

## Step 5: Important Note on CORS and Browser Limitations

While the Space includes CORS middleware to allow cross-origin requests, most browsers enforce security policies that may still block direct API calls from browser-based applications. This is a fundamental security feature of web browsers.

For using the API in a browser-based environment like the Health Connectivity app, you have these options:

### Option 1: Use Test Mode in the App

The Health Assistant application has a built-in test mode that simulates AI responses without making actual API calls. This is the easiest solution for testing and demonstration purposes.

### Option 2: Create a Backend Proxy Server

For production use, the proper solution is to create a small backend proxy server that handles requests between your frontend and the Hugging Face API:

```javascript
// Example Node.js/Express proxy server
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post(
      'https://huggingface.co/spaces/your-username/health-connectivity-llama-assistant/api/predict',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.authorization,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Proxy server running on port 3000');
});
```

### Option 3: Use Serverless Functions

Cloud platforms like Vercel, Netlify, or AWS Lambda offer serverless functions that can act as proxies:

```javascript
// Example Netlify serverless function
exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  
  try {
    const fetch = require("node-fetch");
    const body = JSON.parse(event.body);
    
    const response = await fetch(
      "https://huggingface.co/spaces/your-username/health-connectivity-llama-assistant/api/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": event.headers.authorization
        },
        body: JSON.stringify(body)
      }
    );
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

## Usage Considerations

- The free Hugging Face Spaces tier provides adequate resources for inference with Llama 2 models
- Response times may vary depending on the model size and current load
- For more demanding usage, consider upgrading to a paid Spaces plan or deploying to other serverless platforms

## Support

For Hugging Face Spaces support, visit: [Hugging Face Documentation](https://huggingface.co/docs/hub/spaces)
