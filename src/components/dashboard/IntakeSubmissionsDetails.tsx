import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, Phone, UserCircle } from "lucide-react";
import { IntakeFormSubmission } from "./IntakeSubmissionsTypes";
import { renderUrgencyBadge } from "./IntakeSubmissionsCard";

interface IntakeSubmissionsDetailsProps {
  submission: IntakeFormSubmission;
  urgency: "low" | "medium" | "high";
  handleContactPatient: (submission: IntakeFormSubmission) => void;
  closeDetails: () => void;
  language: "en" | "es";
}

const translations = {
  en: {
    contactInfo: "Contact Information",
    phone: "Phone",
    notificationType: "Notification Type",
    symptoms: "Symptoms",
    medicalHistory: "Medical History",
    medications: "Medications & Allergies",
    insurance: "Insurance Status",
    yes: "Yes",
    no: "No",
    notSpecified: "Not specified",
    otherConcerns: "Other Concerns",
    closeDetails: "Close Details",
    contactPatient: "Contact Patient",
    scheduleAppointment: "Schedule Appointment",
    recentHospitalVisit: "Recent Hospital Visit",
    location: "Location",
  },
  es: {
    contactInfo: "Información de Contacto",
    phone: "Teléfono",
    notificationType: "Tipo de Notificación",
    symptoms: "Síntomas",
    medicalHistory: "Historial Médico",
    medications: "Medicamentos y Alergias",
    insurance: "Estado del Seguro",
    yes: "Sí",
    no: "No",
    notSpecified: "No especificado",
    otherConcerns: "Otras Preocupaciones",
    closeDetails: "Cerrar Detalles",
    contactPatient: "Contactar Paciente",
    scheduleAppointment: "Programar Cita",
    recentHospitalVisit: "Visita Reciente al Hospital",
    location: "Ubicación",
  },
};

export const IntakeSubmissionsDetails = ({
  submission,
  urgency,
  handleContactPatient,
  closeDetails,
  language,
}: IntakeSubmissionsDetailsProps) => {
  const content = translations[language];

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <UserCircle className="h-5 w-5" />
          {submission.childName} - {renderUrgencyBadge(urgency, language)}
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">{content.contactInfo}</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>
                {content.phone}: {submission.phoneNumber || content.notSpecified}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span>
                {content.notificationType}: {submission.notificationType.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">{content.symptoms}</h3>
          <p className="text-sm p-2 bg-accent/10 rounded-md">
            {submission.symptoms || content.notSpecified}
          </p>
        </div>

        {/* Medical History */}
        <div className="space-y-2">
          <h3 className="font-semibold">{content.medicalHistory}</h3>
          <p className="text-sm p-2 bg-accent/10 rounded-md">
            {submission.medicalHistory || content.notSpecified}
          </p>
        </div>

        {/* Medications & Allergies */}
        <div className="space-y-2">
          <h3 className="font-semibold">{content.medications}</h3>
          <p className="text-sm p-2 bg-accent/10 rounded-md">
            {submission.medicationsAndAllergies || content.notSpecified}
          </p>
        </div>

        {/* Recent Hospital Visit */}
        <div className="space-y-2">
          <h3 className="font-semibold">{content.recentHospitalVisit}</h3>
          <p className="text-sm p-2 bg-accent/10 rounded-md">
            {submission.hasRecentHospitalVisits === true
              ? content.yes
              : submission.hasRecentHospitalVisits === false
              ? content.no
              : content.notSpecified}
          </p>
          {submission.hasRecentHospitalVisits && submission.hospitalVisitLocation && (
            <p className="text-sm">
              <span className="font-medium">{content.location}:</span> {submission.hospitalVisitLocation}
            </p>
          )}
        </div>

        {/* Insurance Status */}
        <div className="space-y-2">
          <h3 className="font-semibold">{content.insurance}</h3>
          <p className="text-sm p-2 bg-accent/10 rounded-md">
            {submission.hasInsurance === true
              ? content.yes
              : submission.hasInsurance === false
              ? content.no
              : content.notSpecified}
          </p>
        </div>

        {/* Other Concerns */}
        <div className="col-span-1 md:col-span-2 space-y-2">
          <h3 className="font-semibold">{content.otherConcerns}</h3>
          <p className="text-sm p-2 bg-accent/10 rounded-md">
            {submission.otherConcerns || content.notSpecified}
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={closeDetails}>
          {content.closeDetails}
        </Button>
        <div className="space-x-2">
          <Button variant="default" onClick={() => handleContactPatient(submission)}>
            {content.contactPatient}
          </Button>
          <Button variant="secondary">{content.scheduleAppointment}</Button>
        </div>
      </div>
    </DialogContent>
  );
};
