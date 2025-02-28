
import 'regenerator-runtime/runtime';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
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
  
  // Speech synthesis setup
  const speechSynthesisAvailable = 'speechSynthesis' in window;
  
  const speakText = (text: string, lang: string) => {
    if (!speechSynthesisAvailable) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "en" ? "en-US" : "es-ES";
    utterance.rate = 0.9; // Slightly slower than default for better clarity
    window.speechSynthesis.speak(utterance);
  };

  // Speech recognition setup
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({
    language: language === "en" ? "en-US" : "es-ES",
    onError: (error) => {
      console.error('Speech recognition error:', error);
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "There was an error with speech recognition. Please try again." 
          : "Hubo un error con el reconocimiento de voz. Por favor, inténtelo de nuevo.",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    const savedApiKey = sessionStorage.getItem("perplexityApiKey");
    if (savedApiKey) setApiKey(savedApiKey);
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <span className="text-red-500">⚠️ {language === "en" ? "Your browser does not support speech recognition." : "Su navegador no admite el reconocimiento de voz."}</span>;
  }

  const handleStartListening = () => {
    resetTranscript();
    startListening();
  };

  const handleStopListening = async () => {
    stopListening();
    if (!transcript.trim()) return;

    setIsLoading(true);
    try {
      const fromLang = language === "en" ? "en" : "es";
      const toLang = language === "en" ? "es" : "en";
      
      const translation = await translateText(transcript, fromLang, toLang);
      setTranslatedText(translation);
      
      // Speak the translated text
      speakText(translation, toLang);

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
            onClick={() => {
              sessionStorage.setItem("perplexityApiKey", apiKey);
              setShowApiInput(false);
            }}
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
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={isLoading}
          variant={isListening ? "destructive" : "default"}
          className="w-full"
        >
          {isListening ? (
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
        {transcript && (
          <div className="p-3 bg-gray-100 rounded-md">
            <p className="text-sm font-medium mb-1">{language === "en" ? "Your speech:" : "Su discurso:"}</p>
            <p>{transcript}</p>
          </div>
        )}
        
        {translatedText && (
          <div className="p-3 bg-green-100 rounded-md">
            <p className="text-sm font-medium mb-1">{language === "en" ? "Translation:" : "Traducción:"}</p>
            <p>{translatedText}</p>
          </div>
        )}
        
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};
