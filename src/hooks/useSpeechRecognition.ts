
import { useState, useEffect, useCallback } from 'react';

interface UseSpeechRecognitionProps {
  language: string;
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
}

interface SpeechRecognitionResult {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
}

// Define the window interface to include the webkit prefix
interface WindowWithSpeechRecognition extends Window {
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

export const useSpeechRecognition = ({
  language,
  onResult,
  onError
}: UseSpeechRecognitionProps): SpeechRecognitionResult => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Check browser support
  const browserSupportsSpeechRecognition = useCallback(() => {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }, []);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition()) {
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || (window as WindowWithSpeechRecognition).webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language;

    recognitionInstance.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setTranscript(transcript);
      if (onResult) {
        onResult(transcript);
      }
    };

    recognitionInstance.onerror = (event) => {
      if (onError) {
        onError(event.error);
      }
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [language, onResult, onError, browserSupportsSpeechRecognition]);

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
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
