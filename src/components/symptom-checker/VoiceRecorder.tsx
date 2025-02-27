
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, StopCircle, Volume2 } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface VoiceRecorderProps {
  language: "en" | "es";
  fieldName: string;
  onVoiceInput: (fieldName: string, input: string) => void;
}

export const VoiceRecorder = ({ language, fieldName, onVoiceInput }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

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
      setIsRecording(false);
    }
  });

  // Sync our local recording state with the speech recognition state
  useEffect(() => {
    setIsRecording(isListening);
  }, [isListening]);

  // Display debugging information when in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Voice Recorder - isListening: ${isListening}, transcript: ${transcript}`);
    }
  }, [isListening, transcript]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <p className="text-red-500">
        ⚠️ {language === "en" ? "Your browser does not support speech recognition." : "Su navegador no admite el reconocimiento de voz."}
      </p>
    );
  }

  const handleStartListening = () => {
    console.log("Starting voice recording...");
    resetTranscript();
    startListening();
  };

  const handleStopListening = () => {
    console.log("Stopping voice recording...");
    stopListening();

    // ✅ Ensure transcript is not empty
    if (transcript && transcript.trim()) {
      console.log(`Recorded transcript: ${transcript}`);
      onVoiceInput(fieldName, transcript);
      toast({
        title: language === "en" ? "Voice Input Recorded" : "Entrada de Voz Registrada",
        description: transcript,
        variant: "default",
      });
    } else {
      console.log("No transcript detected");
      toast({
        title: language === "en" ? "No Input Detected" : "No se detectó entrada",
        description: language === "en"
          ? "Please speak clearly and try again."
          : "Por favor, hable claramente e intente de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-full p-3 bg-muted/50 rounded-md">
        {transcript ? (
          <p className="text-sm">{transcript}</p>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            {language === "en" 
              ? "Speak after clicking the button below" 
              : "Hable después de hacer clic en el botón de abajo"}
          </p>
        )}
      </div>
      
      <Button
        className={`w-full py-4 ${isRecording ? "bg-red-600 hover:bg-red-700" : ""}`}
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
      
      {isRecording && (
        <div className="flex items-center justify-center w-full mt-2">
          <Volume2 className="h-4 w-4 text-red-500 animate-pulse mr-2" />
          <span className="text-xs text-red-500">
            {language === "en" ? "Recording..." : "Grabando..."}
          </span>
        </div>
      )}
    </div>
  );
};
