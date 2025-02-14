
import 'regenerator-runtime/runtime';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Mic, StopCircle } from "lucide-react";

interface VoiceRecorderProps {
  language: "en" | "es";
  onSymptomsUpdate: (symptoms: string) => void;
}

export const VoiceRecorder = ({ language, onSymptomsUpdate }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span className="text-red-500">⚠️ Your browser does not support speech recognition.</span>;
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

    if (transcript.trim()) {
      onSymptomsUpdate(transcript);
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
        className="w-full py-4"
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

      {transcript && (
        <p className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm">
          <span className="font-semibold">{transcript}</span>
        </p>
      )}
    </div>
  );
};
