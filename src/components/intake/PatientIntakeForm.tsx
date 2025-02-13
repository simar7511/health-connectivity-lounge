
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Mic } from "lucide-react";
import { VoiceRecorder } from "@/components/VoiceTranslator";
import { useForm } from "react-hook-form";

interface IntakeFormData {
  preferredName: string;
  dateOfBirth: Date | undefined;
  preferredLanguage: string;
  needsInterpreter: boolean;
  phoneNumber: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  reasonForVisit: string;
  medicalHistory: string;
  medications: string;
  recentHospital: boolean;
  hospitalLocation: string;
  hasInsurance: boolean;
  needsHealthInfo: boolean;
  needsTransportation: boolean;
  needsChildcare: boolean;
  otherConcerns: string;
  consentToTreatment: boolean;
}

const PatientIntakeForm = () => {
  const [language, setLanguage] = useState<"en" | "es">("es");
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<IntakeFormData>({
    defaultValues: {
      preferredName: "",
      preferredLanguage: "es",
      needsInterpreter: false,
      phoneNumber: "",
      emergencyContactName: "",
      emergencyContactRelation: "",
      reasonForVisit: "",
      medicalHistory: "",
      medications: "",
      recentHospital: false,
      hospitalLocation: "",
      hasInsurance: false,
      needsHealthInfo: true,
      needsTransportation: false,
      needsChildcare: false,
      otherConcerns: "",
      consentToTreatment: false,
    }
  });

  const content = {
    en: {
      title: "Patient Intake Form",
      subtitle: "Free Medical Care - No ID Required",
      privacyNotice: "Your information is private and will NOT be shared with immigration authorities or law enforcement.",
      basicInfo: "Basic Information (Optional)",
      medicalInfo: "Medical Information",
      socialInfo: "Social & Support Needs",
      consent: "Consent & Privacy",
      preferredName: "Preferred Name",
      dateOfBirth: "Date of Birth",
      language: "Preferred Language",
      interpreter: "Need an Interpreter?",
      phone: "Phone Number (for follow-ups)",
      emergency: "Emergency Contact",
      relation: "Relationship",
      reasonVisit: "Reason for Visit",
      medicalHistory: "Medical History",
      medications: "Current Medications & Allergies",
      hospital: "Recent Hospital Visits?",
      where: "Where?",
      insurance: "Do you have health insurance?",
      healthInfo: "Would you like information on free/low-cost health services?",
      transportation: "Do you need help with transportation?",
      childcare: "Do you need childcare assistance for medical visits?",
      concerns: "Other concerns affecting access to healthcare?",
      consentText: "I consent to receive medical care at this clinic, and I understand that services provided here are free or low-cost.",
      submit: "Submit Form",
      speakNow: "Speak Now",
    },
    es: {
      title: "Formulario de Ingreso del Paciente",
      subtitle: "Atención Médica Gratuita - No Se Requiere Identificación",
      privacyNotice: "Su información es privada y NO será compartida con autoridades de inmigración ni la policía.",
      basicInfo: "Información Básica (Opcional)",
      medicalInfo: "Información Médica",
      socialInfo: "Necesidades Sociales y de Apoyo",
      consent: "Consentimiento y Privacidad",
      preferredName: "Nombre Preferido",
      dateOfBirth: "Fecha de Nacimiento",
      language: "Idioma Preferido",
      interpreter: "¿Necesita un Intérprete?",
      phone: "Número de Teléfono (para seguimiento)",
      emergency: "Contacto de Emergencia",
      relation: "Parentesco",
      reasonVisit: "Motivo de la Visita",
      medicalHistory: "Historial Médico",
      medications: "Medicamentos Actuales y Alergias",
      hospital: "¿Visitas Recientes al Hospital?",
      where: "¿Dónde?",
      insurance: "¿Tiene seguro médico?",
      healthInfo: "¿Desea información sobre servicios de salud gratuitos o de bajo costo?",
      transportation: "¿Necesita ayuda con el transporte?",
      childcare: "¿Necesita ayuda con el cuidado de niños para las visitas médicas?",
      concerns: "¿Otras preocupaciones que afecten su acceso a la atención médica?",
      consentText: "Doy mi consentimiento para recibir atención médica en esta clínica y entiendo que los servicios proporcionados aquí son gratuitos o de bajo costo.",
      submit: "Enviar Formulario",
      speakNow: "Hablar Ahora",
    }
  };

  const onSubmit = async (data: IntakeFormData) => {
    if (!data.consentToTreatment) {
      toast({
        title: language === "en" ? "Consent Required" : "Consentimiento Requerido",
        description: language === "en" 
          ? "Please agree to the consent statement to continue" 
          : "Por favor acepte el consentimiento para continuar",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save the form data
    console.log("Form submitted:", data);

    toast({
      title: language === "en" ? "Form Submitted" : "Formulario Enviado",
      description: language === "en" 
        ? "Thank you for completing the intake form" 
        : "Gracias por completar el formulario de ingreso",
    });

    // Navigate to dashboard after submission
    navigate("/patient/dashboard");
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="space-y-2 text-center mb-6">
          <h1 className="text-2xl font-bold">{content[language].title}</h1>
          <p className="text-muted-foreground">{content[language].subtitle}</p>
          <p className="text-sm bg-yellow-100 p-2 rounded">
            {content[language].privacyNotice}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{content[language].basicInfo}</h2>
              
              <FormField
                control={form.control}
                name="preferredName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{content[language].preferredName}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{content[language].dateOfBirth}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{content[language].language}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{content[language].phone}</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Medical Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{content[language].medicalInfo}</h2>
              
              <FormField
                control={form.control}
                name="reasonForVisit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{content[language].reasonVisit}</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <VoiceRecorder
                        language={language}
                        onSymptomsUpdate={(text) => field.onChange(text)}
                      />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{content[language].medicalHistory}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{content[language].medications}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Social & Financial Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{content[language].socialInfo}</h2>
              
              <FormField
                control={form.control}
                name="needsTransportation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>{content[language].transportation}</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="needsChildcare"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>{content[language].childcare}</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="needsHealthInfo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>{content[language].healthInfo}</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Consent Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{content[language].consent}</h2>
              
              <FormField
                control={form.control}
                name="consentToTreatment"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>{content[language].consentText}</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              {content[language].submit}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default PatientIntakeForm;
