import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { VoiceRecorder } from "@/components/VoiceTranslator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface PediatricIntakeFormProps {
  language: "en" | "es";
}

const PediatricIntakeForm = ({ language: propLanguage }: PediatricIntakeFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");
  const [language, setLanguage] = useState(propLanguage);
  const [formData, setFormData] = useState({
    childName: "",
    dob: "",
    languagePreference: "",
    emergencyContact: "",
    symptoms: "",
    medicalHistory: "",
    medications: "",
    hospitalVisits: "",
    insuranceStatus: "",
    transportation: "",
    childcare: "",
    consentToTreatment: false,
  });

  useEffect(() => {
    const savedLanguage = sessionStorage.getItem('preferredLanguage') as "en" | "es" | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVoiceInput = (input: string) => {
    setVoiceInput(input);
    setFormData((prev) => ({
      ...prev,
      symptoms: input,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consentToTreatment) {
      toast({
        title: language === "en" ? "Consent Required" : "Se Requiere Consentimiento",
        description: language === "en" 
          ? "Please agree to the consent statement to continue" 
          : "Por favor acepte el consentimiento para continuar",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, "pediatricIntake"), {
        ...formData,
        timestamp: new Date(),
        language
      });

      toast({
        title: language === "en" ? "Form Submitted" : "Formulario Enviado",
        description: language === "en" 
          ? "Thank you for completing the intake form" 
          : "Gracias por completar el formulario"
      });

      sessionStorage.setItem('intakeId', docRef.id);
      
      navigate("/appointment");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: language === "en" ? "Error" : "Error",
        description: language === "en" 
          ? "Failed to submit form. Please try again." 
          : "Error al enviar formulario. Por favor intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-center">
          {language === "en" ? "Pediatric Intake Form" : "Formulario de Admisión Pediátrica"}
        </h2>

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

        <Textarea
          name="symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          placeholder={language === "en" ? "Symptoms" : "Síntomas"}
          required
        />

        <Textarea
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleChange}
          placeholder={language === "en" ? "Medical History" : "Historial Médico"}
        />

        <Textarea
          name="medications"
          value={formData.medications}
          onChange={handleChange}
          placeholder={language === "en" ? "Medications" : "Medicamentos"}
        />

        <Textarea
          name="hospitalVisits"
          value={formData.hospitalVisits}
          onChange={handleChange}
          placeholder={language === "en" ? "Hospital Visits" : "Visitas al Hospital"}
        />

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

        <div className="flex items-center">
          <Checkbox
            name="consentToTreatment"
            checked={formData.consentToTreatment}
            onChange={handleChange}
          />
          <label className="ml-2">
            {language === "en" ? "I consent to treatment" : "Consiento al tratamiento"}
          </label>
        </div>

        <VoiceRecorder language={language} onSymptomsUpdate={handleVoiceInput} />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {language === "en" ? "Submitting..." : "Enviando..."}
            </>
          ) : (
            language === "en" ? "Submit & Schedule Appointment" : "Enviar y Programar Cita"
          )}
        </Button>
      </Card>
    </form>
  );
};

export default PediatricIntakeForm;
