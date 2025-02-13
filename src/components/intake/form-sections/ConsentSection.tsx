
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

interface ConsentSectionProps {
  language: "en" | "es";
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const ConsentSection = ({ language, checked, onCheckedChange }: ConsentSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {language === "en" ? "4️⃣ Consent & Privacy Statement" : "4️⃣ Consentimiento y Declaración de Privacidad"}
      </h3>

      <Card className="p-4 bg-blue-50">
        <p className="text-sm text-blue-900">
          {language === "en" 
            ? "Your personal information is private and will NOT be shared with immigration authorities or law enforcement. This clinic provides care regardless of immigration status."
            : "Su información personal es privada y NO será compartida con autoridades de inmigración o policía. Esta clínica brinda atención sin importar el estado migratorio."}
        </p>
      </Card>

      <div className="flex items-center space-x-2">
        <Checkbox
          name="consentToTreatment"
          checked={checked}
          onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
          required
        />
        <label className="text-sm">
          {language === "en" 
            ? "I consent to receive medical care at this clinic, and I understand that services provided here are free or low-cost."
            : "Doy mi consentimiento para recibir atención médica en esta clínica y entiendo que los servicios proporcionados aquí son gratuitos o de bajo costo."}
        </label>
      </div>
    </div>
  );
};
