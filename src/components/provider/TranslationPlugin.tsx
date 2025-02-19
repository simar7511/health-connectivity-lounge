
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages, ArrowRightLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TranslationPluginProps {
  language: "en" | "es";
}

const translations = {
  en: {
    title: "Real-time Translation",
    inputPlaceholder: "Type or paste text to translate",
    translate: "Translate",
    swap: "Swap Languages",
    from: "From",
    to: "To",
    english: "English",
    spanish: "Spanish",
  },
  es: {
    title: "Traducción en tiempo real",
    inputPlaceholder: "Escriba o pegue el texto a traducir",
    translate: "Traducir",
    swap: "Intercambiar idiomas",
    from: "De",
    to: "A",
    english: "Inglés",
    spanish: "Español",
  }
};

export const TranslationPlugin = ({ language }: TranslationPluginProps) => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [fromLang, setFromLang] = useState<"en" | "es">("en");
  const [toLang, setToLang] = useState<"en" | "es">("es");

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast({
        variant: "destructive",
        title: language === "en" ? "Error" : "Error",
        description: language === "en" ? 
          "Please enter some text to translate" : 
          "Por favor ingrese texto para traducir"
      });
      return;
    }

    try {
      // For now, we'll use a mock translation
      // In a real implementation, you would call your translation API here
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
