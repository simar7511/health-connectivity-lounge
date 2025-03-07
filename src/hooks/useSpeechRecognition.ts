
import { useState, useEffect, useCallback } from 'react';

// The interface definitions are now in vite-env.d.ts for global use

interface UseSpeechRecognitionProps {
  language: string;
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
}

interface UseSpeechRecognitionReturn {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
}

export const useSpeechRecognition = ({
  language,
  onResult,
  onError
}: UseSpeechRecognitionProps): UseSpeechRecognitionReturn => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Check browser support
  const browserSupportsSpeechRecognition = useCallback(() => {
    return typeof window !== 'undefined' && 
      (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);
  }, []);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition()) {
      console.log("Speech recognition not supported in this browser");
      return;
    }

    try {
      // Initialize speech recognition
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        console.error('Speech recognition not supported in this browser');
        return;
      }

      const recognitionInstance = new SpeechRecognitionAPI();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language;

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setTranscript(transcript);
        if (onResult) {
          onResult(transcript);
        }
      };

      recognitionInstance.onerror = (event: SpeechRecognitionEvent) => {
        console.error("Speech recognition error:", event.error);
        if (onError) {
          onError(event.error);
        }
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        console.log("Speech recognition ended");
        setIsListening(false);
      };

      setRecognition(recognitionInstance);

      return () => {
        if (recognitionInstance) {
          try {
            recognitionInstance.abort();
          } catch (error) {
            console.error("Error aborting speech recognition:", error);
          }
        }
      };
    } catch (error) {
      console.error("Error setting up speech recognition:", error);
      return undefined;
    }
  }, [language, onResult, onError, browserSupportsSpeechRecognition]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
        console.log("Speech recognition started");
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    } else if (!recognition) {
      console.error("Speech recognition not initialized");
    } else if (isListening) {
      console.log("Already listening");
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      try {
        recognition.stop();
        console.log("Speech recognition stopped");
        // setIsListening is called in the onend handler
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
        setIsListening(false);
      }
    }
  }, [recognition, isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition: browserSupportsSpeechRecognition()
  };
};
