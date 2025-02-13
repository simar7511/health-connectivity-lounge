
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface BasicInfoSectionProps {
  language: "en" | "es";
  formData: {
    childName: string;
    dob: string;
    languagePreference: string;
    emergencyContact: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const BasicInfoSection = ({ language, formData, handleChange }: BasicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {language === "en" ? "Basic Information" : "Información Básica"}
      </h3>
      
      <Input
        name="childName"
        value={formData.childName}
        onChange={handleChange}
        placeholder={language === "en" ? "Child's Name" : "Nombre del Niño"}
        required
      />

      <Input
        name="dob"
        type="date"
        value={formData.dob}
        onChange={handleChange}
        placeholder={language === "en" ? "Date of Birth" : "Fecha de Nacimiento"}
        required
      />

      <Input
        name="languagePreference"
        value={formData.languagePreference}
        onChange={handleChange}
        placeholder={language === "en" ? "Language Preference" : "Preferencia de Idioma"}
        required
      />

      <Input
        name="emergencyContact"
        value={formData.emergencyContact}
        onChange={handleChange}
        placeholder={language === "en" ? "Emergency Contact" : "Contacto de Emergencia"}
        required
      />
    </div>
  );
};
