declare module "react-speech-kit" {
    export function useSpeechSynthesis(): {
      speak: (options: { text: string; lang?: string }) => void;
      cancel: () => void;
      speaking: boolean;
    };
  
    export function useSpeechRecognition(): {
      transcript: string;
      listening: boolean;
      resetTranscript: () => void;
      browserSupportsSpeechRecognition: boolean;
    };
  }
  