import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Globe, Pill, TestTube, Sparkles } from "lucide-react";

interface QuickDocumentationProps {
  language: "en" | "es";
  onTranslate: () => void;
}

const content = {
  en: {
    title: "Documentation",
    translate: "Auto-Translate",
    prescriptions: "E-Prescriptions",
    labs: "Lab Orders",
    aiAssist: "AI Assist",
    soap: "SOAP Note",
  },
  es: {
    title: "Documentación",
    translate: "Auto-Traducir",
    prescriptions: "Recetas Electrónicas",
    labs: "Órdenes de Laboratorio",
    aiAssist: "Asistente IA",
    soap: "Nota SOAP",
  },
};

export const QuickDocumentation = ({ language, onTranslate }: QuickDocumentationProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FileText className="h-5 w-5" />
        {content[language].title}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <Button
        variant="outline"
        className="w-full flex items-center gap-2"
        onClick={onTranslate}
      >
        <Globe className="h-4 w-4" />
        {content[language].translate}
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        {content[language].soap}
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center gap-2"
      >
        <Sparkles className="h-4 w-4" />
        {content[language].aiAssist}
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center gap-2"
      >
        <Pill className="h-4 w-4" />
        {content[language].prescriptions}
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center gap-2"
      >
        <TestTube className="h-4 w-4" />
        {content[language].labs}
      </Button>
    </CardContent>
  </Card>
);