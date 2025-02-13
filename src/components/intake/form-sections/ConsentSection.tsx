
import { Checkbox } from "@/components/ui/checkbox";

interface ConsentSectionProps {
  language: "en" | "es";
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const ConsentSection = ({ language, checked, onCheckedChange }: ConsentSectionProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        name="consentToTreatment"
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
      />
      <label className="text-sm">
        {language === "en" 
          ? "I consent to treatment and understand that my information will be kept confidential" 
          : "Consiento al tratamiento y entiendo que mi información se mantendrá confidencial"}
      </label>
    </div>
  );
};
