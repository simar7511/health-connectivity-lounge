
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Pill, TestTube, Sparkles } from "lucide-react";

interface QuickDocumentationProps {
  language: "en" | "es";
  onTranslate: () => void;
}

const content = {
  en: {
    title: "Documentation",
    prescriptions: "E-Prescriptions",
    labs: "Lab Orders",
    aiAssist: "AI Assist",
  },
  es: {
    title: "Documentación",
    prescriptions: "Recetas Electrónicas",
    labs: "Órdenes de Laboratorio",
    aiAssist: "Asistente IA",
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
