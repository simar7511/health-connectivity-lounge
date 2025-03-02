
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoSectionProps {
  language: "en" | "es";
  formData: {
    childName: string;
    dob: string;
    languagePreference: string;
    phoneNumber: string;
    emergencyContactName: string;
    emergencyContactRelation: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const BasicInfoSection = ({ 
  language, 
  formData, 
  handleChange
}: BasicInfoSectionProps) => {
  return (
    <div className="space-y-6 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
        <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
        {language === "en" ? "Basic Information" : "Información Básica"}
      </h3>

      {/* Child's Name */}
      <div className="space-y-2">
        <Label htmlFor="childName" className="text-gray-700">
          {language === "en" ? "Child's Full Name / Preferred Name" : "Nombre Completo del Niño / Nombre Preferido"}
        </Label>
        <Input
          id="childName"
          name="childName"
          value={formData.childName}
          onChange={handleChange}
          placeholder={language === "en" ? "Enter name" : "Ingrese nombre"}
          className="border-gray-300 focus:border-primary focus:ring-primary"
          required
        />
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <Label htmlFor="dob" className="text-gray-700">
          {language === "en" ? "Date of Birth" : "Fecha de Nacimiento"}
        </Label>
        <Input
          id="dob"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          className="border-gray-300 focus:border-primary focus:ring-primary"
          required
        />
      </div>

      {/* Preferred Language */}
      <div className="space-y-2">
        <Label htmlFor="languagePreference" className="text-gray-700">
          {language === "en" ? "Preferred Language" : "Idioma Preferido"}
        </Label>
        <select
          id="languagePreference"
          name="languagePreference"
          value={formData.languagePreference}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 bg-background px-3 py-2 focus:border-primary focus:ring-primary"
          required
        >
          <option value="">{language === "en" ? "Select Language" : "Seleccionar Idioma"}</option>
          <option value="spanish">{language === "en" ? "Spanish" : "Español"}</option>
          <option value="english">{language === "en" ? "English" : "Inglés"}</option>
          <option value="other">{language === "en" ? "Other" : "Otro"}</option>
        </select>
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-gray-700">
          {language === "en" ? "Phone Number (Optional)" : "Número de Teléfono (Opcional)"}
        </Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder={language === "en" ? "Enter phone number" : "Ingrese número de teléfono"}
          type="tel"
          className="border-gray-300 focus:border-primary focus:ring-primary"
        />
      </div>

      {/* Emergency Contact */}
      <div className="space-y-2 border-t pt-4">
        <Label className="text-gray-700">{language === "en" ? "Emergency Contact (Optional)" : "Contacto de Emergencia (Opcional)"}</Label>
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
            placeholder={language === "en" ? "Contact Name" : "Nombre de Contacto"}
            className="border-gray-300 focus:border-primary focus:ring-primary"
          />
          <Input
            name="emergencyContactRelation"
            value={formData.emergencyContactRelation}
            onChange={handleChange}
            placeholder={language === "en" ? "Relationship" : "Relación"}
            className="border-gray-300 focus:border-primary focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};
