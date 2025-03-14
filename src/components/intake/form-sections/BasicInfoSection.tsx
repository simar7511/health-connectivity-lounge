
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
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-md border-l-4 border-l-primary transition-all duration-300 hover:shadow-lg">
      <h3 className="text-lg font-semibold text-primary flex items-center gap-3">
        <span className="bg-gradient-to-r from-primary to-purple-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-md">1</span>
        {language === "en" ? "Basic Information" : "Información Básica"}
      </h3>

      {/* Child's Name */}
      <div className="space-y-2">
        <Label htmlFor="childName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          {language === "en" ? "Child's Full Name / Preferred Name" : "Nombre Completo del Niño / Nombre Preferido"}
        </Label>
        <Input
          id="childName"
          name="childName"
          value={formData.childName}
          onChange={handleChange}
          placeholder={language === "en" ? "Enter name" : "Ingrese nombre"}
          className="border-gray-200 focus:border-primary focus:ring-primary rounded-lg transition-all"
          required
        />
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <Label htmlFor="dob" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          {language === "en" ? "Date of Birth" : "Fecha de Nacimiento"}
        </Label>
        <Input
          id="dob"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          className="border-gray-200 focus:border-primary focus:ring-primary rounded-lg transition-all"
          required
        />
      </div>

      {/* Preferred Language */}
      <div className="space-y-2">
        <Label htmlFor="languagePreference" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          {language === "en" ? "Preferred Language" : "Idioma Preferido"}
        </Label>
        <select
          id="languagePreference"
          name="languagePreference"
          value={formData.languagePreference}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 focus:border-primary focus:ring-primary transition-all"
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
        <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          {language === "en" ? "Phone Number (Optional)" : "Número de Teléfono (Opcional)"}
        </Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder={language === "en" ? "Enter phone number" : "Ingrese número de teléfono"}
          type="tel"
          className="border-gray-200 focus:border-primary focus:ring-primary rounded-lg transition-all"
        />
      </div>

      {/* Emergency Contact */}
      <div className="space-y-2 border-t border-gray-100 pt-5 mt-5">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          {language === "en" ? "Emergency Contact (Optional)" : "Contacto de Emergencia (Opcional)"}
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
            placeholder={language === "en" ? "Contact Name" : "Nombre de Contacto"}
            className="border-gray-200 focus:border-primary focus:ring-primary rounded-lg transition-all"
          />
          <Input
            name="emergencyContactRelation"
            value={formData.emergencyContactRelation}
            onChange={handleChange}
            placeholder={language === "en" ? "Relationship" : "Relación"}
            className="border-gray-200 focus:border-primary focus:ring-primary rounded-lg transition-all"
          />
        </div>
      </div>
    </div>
  );
};
