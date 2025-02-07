
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const MedicalChat = ({ language }: { language: "en" | "es" }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!apiKey) {
      toast({
        title: language === "en" ? "API Key Required" : "Se requiere clave API",
        description: language === "en" 
          ? "Please enter your Perplexity API key" 
          : "Por favor ingrese su clave API de Perplexity",
        variant: "destructive"
      });
      return;
    }

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: language === "en" 
                ? 'You are a medical interpreter. Translate and explain medical terms in a clear, culturally sensitive way.'
                : 'Eres un intérprete médico. Traduce y explica términos médicos de manera clara y culturalmente sensible.'
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.choices[0].message.content 
      }]);
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "Failed to get response. Please try again." 
          : "No se pudo obtener respuesta. Por favor intente de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      {showApiInput && (
        <div className="space-y-2">
          <Input
            type="password"
            placeholder={language === "en" ? "Enter Perplexity API Key" : "Ingrese la clave API de Perplexity"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full"
          />
          <Button 
            onClick={() => setShowApiInput(false)}
            disabled={!apiKey}
            className="w-full"
          >
            {language === "en" ? "Save API Key" : "Guardar clave API"}
          </Button>
        </div>
      )}
      
      <ScrollArea className="h-[300px] w-full border rounded-md p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'assistant' ? 'pl-4' : 'pr-4'
            }`}
          >
            <div
              className={`p-3 rounded-lg ${
                message.role === 'assistant'
                  ? 'bg-primary/10'
                  : 'bg-secondary/10 ml-auto'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            language === "en"
              ? "Type your medical question..."
              : "Escriba su pregunta médica..."
          }
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            language === "en" ? "Sending..." : "Enviando..."
          ) : (
            language === "en" ? "Send" : "Enviar"
          )}
        </Button>
      </form>
    </div>
  );
};
