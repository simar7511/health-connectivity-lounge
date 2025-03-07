
/// <reference types="vite/client" />
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="prop-types" />

// Web Speech API declarations
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error?: any;
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
  onaudioend?: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart?: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend?: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror?: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onnomatch?: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult?: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend?: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart?: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend?: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart?: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart?: ((this: SpeechRecognition, ev: Event) => any) | null;
  abort(): void;
  start(): void;
  stop(): void;
}

interface Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}
