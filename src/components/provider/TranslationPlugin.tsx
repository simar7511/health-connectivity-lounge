
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages, ArrowRightLeft, Mic, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface TranslationPluginProps {
  language: "en" | "es";
}

const translations = {
  en: {
    title: "Voice Translation",
    inputPlaceholder: "Speak or type text to translate",
    translate: "Translate",
    swap: "Swap Languages",
    from: "From",
    to: "To",
    english: "English",
    spanish: "Spanish",
    startRecording: "Start Recording",
    stopRecording: "Stop Recording",
  },
  es: {
    title: "Traducción por Voz",
    inputPlaceholder: "Hable o escriba el texto a traducir",
    translate: "Traducir",
    swap: "Intercambiar idiomas",
    from: "De",
    to: "A",
    english: "Inglés",
    spanish: "Español",
    startRecording: "Iniciar Grabación",
    stopRecording: "Detener Grabación",
  }
};

export const TranslationPlugin = ({ language }: TranslationPluginProps) => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [fromLang, setFromLang] = useState<"en" | "es">("en");
  const [toLang, setToLang] = useState<"en" | "es">("es");
  const [isRecording, setIsRecording] = useState(false);

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const handleStartListening = () => {
    setIsRecording(true);
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: fromLang === "en" ? "en-US" : "es-ES"
    });
  };

  const handleStopListening = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
    setInputText(transcript);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast({
        variant: "destructive",
        title: language === "en" ? "Error" : "Error",
        description: language === "en" ? 
          "Please enter or speak some text to translate" : 
          "Por favor ingrese o hable el texto para traducir"
      });
      return;
    }

    try {
      // Mock translation for now
      setOutputText(inputText + (toLang === "es" ? " (translated to Spanish)" : " (translated to English)"));
      
      toast({
        title: language === "en" ? "Translation Complete" : "Traducción Completada",
        description: language === "en" ? 
          "Text has been translated successfully" : 
          "El texto ha sido traducido exitosamente"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: language === "en" ? "Translation Error" : "Error de Traducción",
        description: language === "en" ? 
          "Failed to translate text" : 
          "No se pudo traducir el texto"
      });
    }
  };

  const handleSwapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInputText(outputText);
    setOutputText(inputText);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <p className="text-destructive">
            {language === "en" 
              ? "Browser doesn't support speech recognition."
              : "El navegador no soporta reconocimiento de voz."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          {translations[language].title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-2 block">
              {translations[language].from}
            </label>
            <Select value={fromLang} onValueChange={(value: "en" | "es") => setFromLang(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{translations[language].english}</SelectItem>
                <SelectItem value="es">{translations[language].spanish}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwapLanguages}
            className="mt-6"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-2 block">
              {translations[language].to}
            </label>
            <Select value={toLang} onValueChange={(value: "en" | "es") => setToLang(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{translations[language].english}</SelectItem>
                <SelectItem value="es">{translations[language].spanish}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={isRecording ? handleStopListening : handleStartListening}
          variant={isRecording ? "destructive" : "default"}
          className="w-full"
        >
          {isRecording ? (
            <>
              <StopCircle className="h-4 w-4 mr-2" />
              {translations[language].stopRecording}
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              {translations[language].startRecording}
            </>
          )}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Textarea
              placeholder={translations[language].inputPlaceholder}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="h-32"
            />
          </div>
          <div>
            <Textarea
              value={outputText}
              readOnly
              className="h-32 bg-muted"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleTranslate}>
            {translations[language].translate}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
