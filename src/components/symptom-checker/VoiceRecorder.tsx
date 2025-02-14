import 'regenerator-runtime/runtime';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Mic, StopCircle } from "lucide-react";

interface VoiceRecorderProps {
  language: "en" | "es";
  onVoiceInput: (input: string) => void;
}

export const VoiceRecorder = ({ language, onVoiceInput }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const { resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [transcript, setTranscript] = useState("");

  if (!browserSupportsSpeechRecognition) {
    return <span className="text-red-500">⚠️ Your browser does not support speech recognition.</span>;
  }

  const handleStartListening = () => {
    resetTranscript();
    setTranscript(""); // Reset local transcript
    setIsRecording(true);
    
    SpeechRecognition.startListening({
      continuous: true,
      language: language === "en" ? "en-US" : "es-ES",
      onResult: (event: any) => {
        let newTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            newTranscript += event.results[i][0].transcript + " ";
          }
        }
        setTranscript(newTranscript);
      }
    });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setIsRecording(false);

    if (transcript.trim()) {
      onVoiceInput(transcript); // Update the corresponding text field only
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

      {/* Show the transcribed text for this field only */}
      {transcript && (
        <p className="p-2 border border-gray-300 rounded-md bg-gray-100 text-sm">
          {language === "en" ? "Recorded:" : "Grabado:"} <span className="font-semibold">{transcript}</span>
        </p>
      )}
    </div>
  );
};
