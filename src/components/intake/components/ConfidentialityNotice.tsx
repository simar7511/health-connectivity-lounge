
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface ConfidentialityNoticeProps {
  language: "en" | "es";
}

export const ConfidentialityNotice = ({ language }: ConfidentialityNoticeProps) => {
  return (
    <Alert className="bg-yellow-50 border-yellow-200 mb-6">
      <InfoIcon className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-sm text-yellow-800">
        {language === "en" 
          ? "🚨 This form is private and will NOT be shared with law enforcement or immigration authorities. This clinic provides care regardless of immigration status."
          : "🚨 Este formulario es privado y NO será compartido con la policía ni con autoridades de inmigración. Esta clínica brinda atención sin importar el estado migratorio."}
      </AlertDescription>
    </Alert>
  );
};
