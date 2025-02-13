
import { Input } from "@/components/ui/input";

interface SocialInfoSectionProps {
  language: "en" | "es";
  formData: {
    insuranceStatus: string;
    transportation: string;
    childcare: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const SocialInfoSection = ({ language, formData, handleChange }: SocialInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {language === "en" ? "Social & Support Information" : "Información Social y de Apoyo"}
      </h3>

      <Input
        name="insuranceStatus"
        value={formData.insuranceStatus}
        onChange={handleChange}
        placeholder={language === "en" ? "Insurance Status" : "Estado del Seguro"}
      />

      <Input
        name="transportation"
        value={formData.transportation}
        onChange={handleChange}
        placeholder={language === "en" ? "Transportation" : "Transporte"}
      />

      <Input
        name="childcare"
        value={formData.childcare}
        onChange={handleChange}
        placeholder={language === "en" ? "Childcare" : "Cuidado Infantil"}
      />
    </div>
  );
};
