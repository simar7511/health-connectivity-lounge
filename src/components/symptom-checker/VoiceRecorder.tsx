
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, StopCircle } from "lucide-react";
import 'regenerator-runtime/runtime';

interface VoiceRecorderProps {
  language: "en" | "es";
  onSymptomsUpdate: (symptoms: string) => void;
}

export const VoiceRecorder = ({ language, onSymptomsUpdate }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    
    if (SpeechRecognition) {
      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = true;
      newRecognition.interimResults = true;
      newRecognition.lang = language === "en" ? "en-US" : "es-ES";

      newRecognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          onSymptomsUpdate(finalTranscript);
        }
      };

      newRecognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event);
        setIsRecording(false);
        
        toast({
          title: language === "en" ? "Error" : "Error",
          description: language === "en" 
            ? "Failed to record symptoms. Please check your microphone and try again." 
            : "Error al grabar síntomas. Por favor verifique su micrófono e intente nuevamente.",
          variant: "destructive"
        });
      };

      newRecognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(newRecognition);
    } else {
      toast({
        title: language === "en" ? "Not Supported" : "No Soportado",
        description: language === "en" 
          ? "Speech recognition is not supported in your browser" 
          : "El reconocimiento de voz no está soportado en su navegador",
        variant: "destructive"
      });
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [language]);

  const handleVoiceInput = () => {
    if (!recognition) {
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "Speech recognition is not available" 
          : "El reconocimiento de voz no está disponible",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognition.start();
    }
  };

  return (
    <Button 
      className="w-full py-6" 
      onClick={handleVoiceInput}
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
