import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, RotateCcw, AlertCircle, Network, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface Message {
  sender: "user" | "bot";
  content: string;
}

interface AIHealthAssistantProps {
  language: "en" | "es";
  onBack: () => void;
  patientId?: string;
  model: string;
  provider: string;
}

export const AIHealthAssistant: React.FC<AIHealthAssistantProps> = ({ language, onBack, patientId, model, provider }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useTestMode, setUseTestMode] = useState(false);
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [currentModel, setCurrentModel] = useState(model);
  const [currentProvider, setCurrentProvider] = useState(provider);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") || "");
  const [huggingFaceToken, setHuggingFaceToken] = useState(() => localStorage.getItem("huggingface_token") || "");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Update model and provider on changes
  useEffect(() => {
    setCurrentModel(model);
    setCurrentProvider(provider);
  }, [model, provider]);

  // Update API key based on provider
  useEffect(() => {
    if (currentProvider === "openai") {
      const key = localStorage.getItem("openai_api_key") || "";
      setApiKey(key);
    } else if (currentProvider === "llama") {
      const token = localStorage.getItem("huggingface_token") || "";
      setHuggingFaceToken(token);
    }
  }, [currentProvider]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let responseText: string;

      if (useTestMode) {
        responseText = getTestResponse(input, language);
      } else if (useFallbackMode) {
        responseText = getFallbackResponse(input, language);
      } else if (currentProvider === "openai") {
        responseText = await callOpenAI(input, messages);
      } else if (currentProvider === "llama") {
        responseText = await callHuggingFaceAPI(input, messages);
      } else {
        throw new Error("No AI provider selected.");
      }

      const botMessage: Message = { sender: "bot", content: responseText };
      setMessages(prev => [...prev, botMessage]);
      setApiError(null); // Clear any previous errors
      setConsecutiveErrors(0); // Reset consecutive errors
    } catch (error: any) {
      console.error("Error processing AI response:", error);

      // Increment consecutive errors
      setConsecutiveErrors(prev => prev + 1);

      // Set appropriate error message if not already set
      if (!apiError) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
          setApiError("networkError");
        } else if (error.message.includes("401")) {
          setApiError("openaiAuthError");
        } else {
          setApiError("openaiError");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    if (messages.length === 0) return;

    // Re-send the last user message
    const lastUserMessage = messages.filter(msg => msg.sender === "user").pop();
    if (!lastUserMessage) return;

    setMessages(prev => prev.slice(0, -1)); // Remove the previous bot response
    setIsLoading(true);

    try {
      let responseText: string;

      if (useTestMode) {
        responseText = getTestResponse(lastUserMessage.content, language);
      } else if (useFallbackMode) {
        responseText = getFallbackResponse(lastUserMessage.content, language);
      } else if (currentProvider === "openai") {
        responseText = await callOpenAI(lastUserMessage.content, messages.slice(0, -1)); // Exclude the previous bot response
      } else if (currentProvider === "llama") {
        responseText = await callHuggingFaceAPI(lastUserMessage.content, messages.slice(0, -1)); // Exclude the previous bot response
      } else {
        throw new Error("No AI provider selected.");
      }

      const botMessage: Message = { sender: "bot", content: responseText };
      setMessages(prev => [...prev, botMessage]);
      setApiError(null); // Clear any previous errors
      setConsecutiveErrors(0); // Reset consecutive errors
    } catch (error: any) {
      console.error("Error retrying AI response:", error);

      // Increment consecutive errors
      setConsecutiveErrors(prev => prev + 1);

      // Set appropriate error message if not already set
      if (!apiError) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
          setApiError("networkError");
        } else if (error.message.includes("401")) {
          setApiError("openaiAuthError");
        } else {
          setApiError("openaiError");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getTestResponse = (userMessage: string, language: "en" | "es"): string => {
    if (language === "es") {
      return `Respuesta de prueba en español para: ${userMessage}`;
    }
    return `Test response in English for: ${userMessage}`;
  };

  const getFallbackResponse = (userMessage: string, language: "en" | "es"): string => {
    if (language === "es") {
      return `Respuesta de respaldo en español para: ${userMessage}`;
    }
    return `Fallback response in English for: ${userMessage}`;
  };

  const callOpenAI = async (userMessage: string, previousMessages: Message[]): Promise<string> => {
    if (!apiKey) {
      setApiError("openaiNoKey");
      throw new Error("OpenAI API key is required.");
    }

    try {
      console.log(`Calling OpenAI model: ${currentModel}`);

      const apiEndpoint = "https://api.openai.com/v1/chat/completions";
      const apiHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      };

      // Prepare messages for OpenAI
      const openaiMessages = previousMessages.map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      openaiMessages.push({
        role: "user",
        content: userMessage,
      });

      const apiBody = JSON.stringify({
        model: currentModel,
        messages: openaiMessages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        n: 1,
      });

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: apiHeaders,
        body: apiBody,
      });

      if (!response.ok) {
        console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
        if (response.status === 401) {
          setApiError("openaiAuthError");
        } else {
          setApiError("openaiError");
        }
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content.trim();

      // Clear any previous errors
      setApiError(null);
      setConsecutiveErrors(0);

      return responseText;
    } catch (error: any) {
      console.error("Error calling OpenAI:", error);

      // Increment consecutive errors
      setConsecutiveErrors(prev => prev + 1);

      // Set appropriate error message if not already set
      if (!apiError) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
          setApiError("networkError");
        } else if (error.message.includes("401")) {
          setApiError("openaiAuthError");
        } else {
          setApiError("openaiError");
        }
      }

      throw error;
    }
  };

  const callHuggingFaceAPI = async (userMessage: string, previousMessages: Message[]) => {
    try {
      console.log(`Calling Llama 2 model via Firebase proxy: ${currentModel}`);
      
      // Prepare a context from previous messages
      const context = previousMessages
        .map(msg => `${msg.sender === "user" ? "Human" : "Assistant"}: ${msg.content}`)
        .join("\n\n");
      
      // Full prompt with context
      const fullPrompt = context 
        ? `${context}\n\nHuman: ${userMessage}\n\nAssistant:`
        : `Human: ${userMessage}\n\nAssistant:`;
      
      // Call our Firebase proxy function
      const proxyUrl = "https://us-central1-health-connectivity-01.cloudfunctions.net/llamaProxy/generate";
      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          model: currentModel,
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        }),
      });
      
      // Check if the API call was successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Firebase proxy error: ${response.status} ${response.statusText}`, errorText);
        
        if (response.status === 503) {
          setApiError("llamaModelLoading");
        } else if (response.status === 401) {
          setApiError("llamaAuthError");
        } else {
          setApiError("llamaError");
        }
        
        throw new Error(`Firebase proxy error: ${response.status} ${response.statusText}`);
      }
      
      // Parse the API response
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Extract the generated text
      const generatedText = data.generated_text;
      
      // Clear any previous errors
      setApiError(null);
      setConsecutiveErrors(0);
      
      return generatedText;
    } catch (error) {
      console.error("Error calling Llama via proxy:", error);
      
      // Increment consecutive errors
      setConsecutiveErrors(prev => prev + 1);
      
      // Set appropriate error message if not already set
      if (!apiError) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
          setApiError("networkError");
        } else {
          setApiError("llamaError");
        }
      }
      
      throw error;
    }
  };

  // Reset error state after 3 consecutive errors
  useEffect(() => {
    if (consecutiveErrors >= 3) {
      console.warn("Too many consecutive errors. Switching to fallback mode.");
      setUseFallbackMode(true);
      setApiError("tooManyErrors");
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en"
          ? "Too many errors. Switching to fallback mode."
          : "Demasiados errores. Cambiando al modo de respaldo.",
        variant: "destructive",
      });
    }
  }, [consecutiveErrors, language, toast]);

  // Show API info on initial load
  useEffect(() => {
    if (currentProvider === 'llama' && !useTestMode && !useFallbackMode) {
      toast({
        title: language === "en" ? "Using Llama API" : "Usando API de Llama",
        description: language === "en" 
          ? "Using Firebase proxy to connect to Llama models. First request might take longer while the model loads." 
          : "Usando proxy de Firebase para conectar con modelos Llama. La primera solicitud puede tardar más mientras el modelo carga.",
        variant: "default",
        duration: 5000,
      });
    }
  }, [currentProvider, useTestMode, useFallbackMode, language, toast]);

  return (
    <div className="flex flex-col h-full">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              {t("back")}
            </Button>
            <h3 className="text-lg font-semibold">{t("aiHealthAssistant")}</h3>
          </div>
        </CardHeader>
        <CardContent className="overflow-hidden h-full flex-grow">
          <div ref={chatContainerRef} className="space-y-4 p-4 overflow-y-auto h-full">
            {messages.map((message, index) => (
              <div key={index} className={`flex flex-col ${message.sender === "user" ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-lg px-3 py-2 text-sm break-words ${message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                    }`}
                  style={{ maxWidth: "80%" }}
                >
                  {message.content}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {message.sender === "user" ? t("you") : t("aiAssistant")}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <div className="rounded-lg px-3 py-2 text-sm bg-secondary text-secondary-foreground" style={{ maxWidth: "80%" }}>
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{t("aiAssistant")}</div>
              </div>
            )}
            {apiError === "networkError" && (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
            {apiError === "openaiNoKey" && (
              <div className="flex items-center space-x-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{t("openaiNoKeyError")}</span>
              </div>
            )}
            {apiError === "openaiAuthError" && (
              <div className="flex items-center space-x-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{t("openaiAuthError")}</span>
              </div>
            )}
            {apiError === "openaiError" && (
              <div className="flex items-center space-x-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{t("openaiGenericError")}</span>
              </div>
            )}
            {apiError === "llamaAuthError" && (
              <div className="flex items-center space-x-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{t("llamaAuthError")}</span>
              </div>
            )}
            {apiError === "llamaModelLoading" && (
              <div className="flex items-center space-x-2 text-sm text-yellow-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("llamaModelLoading")}</span>
              </div>
            )}
            {apiError === "llamaError" && (
              <div className="flex items-center space-x-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{t("llamaGenericError")}</span>
              </div>
            )}
            {apiError === "tooManyErrors" && (
              <div className="flex items-center space-x-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span>{t("tooManyErrors")}</span>
              </div>
            )}
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="p-4">
          <div className="flex items-center space-x-2 w-full">
            <Input
              placeholder={t("askAiAssistant")}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-grow"
            />
            <Button onClick={handleSend} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {t("send")}
            </Button>
            {messages.length > 0 && !isLoading && (
              <Button variant="outline" onClick={handleRetry} disabled={isLoading}>
                <RotateCcw className="mr-2 h-4 w-4" />
                {t("retry")}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
