import "regenerator-runtime/runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Mic, StopCircle } from "lucide-react";

interface VoiceRecorderProps {
  language: "en" | "es";
  fieldName: string;
  onVoiceInput: (fieldName: string, input: string) => void;
}

export const VoiceRecorder = ({ language, fieldName, onVoiceInput }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return (
      <p className="text-red-500">
        ⚠️ {language === "en" ? "Your browser does not support speech recognition." : "Su navegador no admite el reconocimiento de voz."}
      </p>
    );
  }

  const handleStartListening = () => {
    resetTranscript();
    setIsRecording(true);
    SpeechRecognition.startListening({
      continuous: true,
      language: language === "en" ? "en-US" : "es-ES",
    });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setIsRecording(false);

    // ✅ Ensure transcript is not empty
    if (transcript.trim()) {
      onVoiceInput(fieldName, transcript); // ✅ Insert text into corresponding field
      toast({
        title: language === "en" ? "Voice Input Recorded" : "Entrada de Voz Registrada",
        description: transcript,
        variant: "default",
      });
    } else {
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
      <Button
        className={`w-full py-4 ${isRecording ? "bg-red-600 text-white" : "bg-blue-600 text-white"}`}
        onClick={isRecording ? handleStopListening : handleStartListening}
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
    </div>
  );
};
