
import { useState, useEffect, useCallback } from 'react';

// Add type definitions for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: any;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  abort(): void;
  start(): void;
  stop(): void;
}

// Define the window interface to include the SpeechRecognition constructor
interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

interface UseSpeechRecognitionProps {
  language: string;
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
}

// Renamed to UseSpeechRecognitionReturn to avoid conflict with SpeechRecognitionResult
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
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }, []);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition()) {
      console.log("Speech recognition not supported in this browser");
      return;
    }

    try {
      // Initialize speech recognition
      const SpeechRecognition = (window as WindowWithSpeechRecognition).SpeechRecognition || 
                              (window as WindowWithSpeechRecognition).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.error('Speech recognition not supported in this browser');
        return;
      }

      const recognitionInstance = new SpeechRecognition();

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
