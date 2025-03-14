
import { Checkbox } from "@/components/ui/checkbox";

interface ConsentSectionProps {
  language: "en" | "es";
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const ConsentSection = ({ language, checked, onCheckedChange }: ConsentSectionProps) => {
  return (
    <div className="space-y-4 bg-white p-6 rounded-xl shadow-md border-l-4 border-l-primary transition-all duration-300 hover:shadow-lg">
      <h3 className="text-lg font-semibold text-primary flex items-center gap-3">
        <span className="bg-gradient-to-r from-primary to-purple-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-md">4</span>
        {language === "en" ? "Consent Statement" : "Declaración de Consentimiento"}
      </h3>

      <div className="flex items-start space-x-3 p-5 bg-purple-50 rounded-xl border border-purple-100 transition-all hover:bg-purple-100/50">
        <Checkbox
          name="consentToTreatment"
          checked={checked}
          onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
          className="mt-1 text-primary focus:ring-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary h-5 w-5"
          required
        />
        <label className="text-gray-700 font-medium leading-relaxed">
          {language === "en" 
            ? "I consent to receive medical care at this clinic, and I understand that services provided here are free or low-cost."
            : "Doy mi consentimiento para recibir atención médica en esta clínica y entiendo que los servicios proporcionados aquí son gratuitos o de bajo costo."}
        </label>
      </div>
    </div>
  );
};
