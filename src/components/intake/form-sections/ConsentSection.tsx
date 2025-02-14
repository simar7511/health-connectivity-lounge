
import { Checkbox } from "@/components/ui/checkbox";

interface ConsentSectionProps {
  language: "en" | "es";
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const ConsentSection = ({ language, checked, onCheckedChange }: ConsentSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {language === "en" ? "4️⃣ Consent Statement" : "4️⃣ Declaración de Consentimiento"}
      </h3>

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
