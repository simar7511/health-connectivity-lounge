import 'regenerator-runtime/runtime';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";
import { Mic, StopCircle } from "lucide-react";
import { Input } from "./ui/input";
import { translateText } from "@/utils/twilioService";

interface VoiceTranslatorProps {
  language: "en" | "es";
}

export const VoiceTranslator = ({ language }: VoiceTranslatorProps) => {
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

  useEffect(() => {
    const savedApiKey = sessionStorage.getItem("perplexityApiKey");
    if (savedApiKey) setApiKey(savedApiKey);
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <span className="text-red-500">⚠️ Your browser does not support speech recognition.</span>;
  }

  const handleStartListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ 
      continuous: true, 
      language: language === "en" ? "en-US" : "es-ES" 
    });
  };

  const handleStopListening = async () => {
    SpeechRecognition.stopListening();
    if (!transcript.trim()) return;

    setIsLoading(true);
    try {
      const fromLang = language === "en" ? "en" : "es";
      const toLang = language === "en" ? "es" : "en";
      
      const translation = await translateText(transcript, fromLang, toLang);
      setTranslatedText(translation);
      
      speak({ 
        text: translation, 
        lang: language === "en" ? "es-ES" : "en-US"
      });

    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "Failed to translate. Please try again." 
          : "No se pudo traducir. Por favor intente nuevamente.",
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
        {/* Start/Stop Recording Button */}
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

        {/* Display Transcription and Translation */}
        {transcript && <p className="p-2 bg-gray-100">{transcript}</p>}
        {translatedText && <p className="p-2 bg-green-100">{translatedText}</p>}
      </div>
    </div>
  );
};
