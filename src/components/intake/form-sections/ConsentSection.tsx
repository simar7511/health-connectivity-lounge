
import { Checkbox } from "@/components/ui/checkbox";

interface ConsentSectionProps {
  language: "en" | "es";
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const ConsentSection = ({ language, checked, onCheckedChange }: ConsentSectionProps) => {
  return (
    <div className="space-y-4 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
        <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">4</span>
        {language === "en" ? "Consent Statement" : "Declaración de Consentimiento"}
      </h3>

      <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-md">
        <Checkbox
          name="consentToTreatment"
          checked={checked}
          onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
          className="text-primary focus:ring-primary h-5 w-5"
          required
        />
        <label className="text-sm text-gray-700">
          {language === "en" 
            ? "I consent to receive medical care at this clinic, and I understand that services provided here are free or low-cost."
            : "Doy mi consentimiento para recibir atención médica en esta clínica y entiendo que los servicios proporcionados aquí son gratuitos o de bajo costo."}
        </label>
      </div>
    </div>
  );
};
