
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
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

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
  const [isRecording, setIsRecording] = useState(false);
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
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 bg-white rounded-lg shadow-lg">
      <div className="space-y-4">
        <div className="text-center">
          <Button
            onClick={isRecording ? handleStopListening : handleStartListening}
            variant={isRecording ? "destructive" : "default"}
            className="w-full"
          >
            {isRecording ? (
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
      </div>
    </div>
  );
};
