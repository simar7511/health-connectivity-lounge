
import 'regenerator-runtime/runtime';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";
import { Mic, StopCircle } from "lucide-react";
import { Input } from "./ui/input";

interface VoiceRecorderProps {
  language: "en" | "es";
  onSymptomsUpdate: (symptoms: string) => void;
}

export const VoiceRecorder = ({ language, onSymptomsUpdate }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleStartListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ 
      continuous: true,
      language: language === "en" ? "en-US" : "es-ES" 
    });
    setIsRecording(true);
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setIsRecording(false);
    if (transcript.trim()) {
      onSymptomsUpdate(transcript);
    }
  };

  return (
    <Button 
      className="w-full py-6" 
      onClick={isRecording ? handleStopListening : handleStartListening}
      variant={isRecording ? "destructive" : "default"}
    >
      {isRecording ? (
        <>
          <StopCircle className="mr-2 h-4 w-4" />
          {language === "en" ? "Stop Recording" : "Detener Grabación"}
        </>
      ) : (
        <>
          <Mic className="mr-2 h-4 w-4" />
          {language === "en" ? "Start Recording" : "Comenzar Grabación"}
        </>
      )}
    </Button>
  );
};

export const VoiceTranslator = ({ language }: { language: "en" | "es" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);
  const [translatedText, setTranslatedText] = useState('');
  const { speak } = useSpeechSynthesis();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleStartListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: language === "en" ? "en-US" : "es-ES" });
  };

  const handleStopListening = async () => {
    SpeechRecognition.stopListening();
    if (!transcript.trim()) return;
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
                ? 'You are a translator. Translate the following English text to Spanish.' 
                : 'Eres un traductor. Traduce el siguiente texto en español al inglés.'
            },
            {
              role: 'user',
              content: transcript
            }
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const translatedContent = data.choices[0].message.content;
      setTranslatedText(translatedContent);
      
      speak({ 
        text: translatedContent, 
        lang: language === "en" ? "es-ES" : "en-US"
      });

    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "Failed to translate. Please try again." 
          : "No se pudo traducir. Por favor intente de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 bg-white rounded-lg shadow-lg">
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

      <div className="space-y-4">
        <div className="text-center">
          <Button
            onClick={listening ? handleStopListening : handleStartListening}
            disabled={isLoading}
            variant={listening ? "destructive" : "default"}
            className="w-full"
          >
            {listening ? (
              <>
                <StopCircle className="w-4 h-4 mr-2" />
                {language === "en" ? "Stop Recording" : "Detener Grabación"}
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                {language === "en" ? "Start Recording" : "Iniciar Grabación"}
              </>
            )}
          </Button>
        </div>

        {transcript && (
          <div className="p-3 bg-secondary/10 rounded-lg">
            <p className="font-medium">{language === "en" ? "Your Speech:" : "Tu Voz:"}</p>
            <p>{transcript}</p>
          </div>
        )}

        {translatedText && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="font-medium">{language === "en" ? "Translation:" : "Traducción:"}</p>
            <p>{translatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
};
