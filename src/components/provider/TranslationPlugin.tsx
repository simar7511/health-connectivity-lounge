
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages, Mic, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface TranslationPluginProps {
  language: "en" | "es";
  patientLanguage: "en" | "es";
}

const translations = {
  en: {
    startRecording: "Start Recording",
    stopRecording: "Stop Recording",
    translating: "Translating to Spanish...",
  },
  es: {
    startRecording: "Iniciar Grabación",
    stopRecording: "Detener Grabación",
    translating: "Traduciendo al inglés...",
  }
};

export const TranslationPlugin = ({ language, patientLanguage }: TranslationPluginProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const handleStartListening = () => {
    setIsRecording(true);
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: language === "en" ? "en-US" : "es-ES"
    });
  };

  const handleStopListening = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
    toast({
      title: translations[language].translating,
    });
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  if (language === patientLanguage) {
    return null;
  }

  return (
    <Card className="w-full border-dashed">
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <Button 
            size="sm"
            variant={isRecording ? "destructive" : "secondary"}
            onClick={isRecording ? handleStopListening : handleStartListening}
            className="flex items-center gap-2"
          >
            {isRecording ? (
              <>
                <StopCircle className="h-4 w-4" />
                {translations[language].stopRecording}
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                {translations[language].startRecording}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
