
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, Phone, UserCircle, FileText, X, Calendar } from "lucide-react";
import { IntakeFormSubmission } from "./IntakeSubmissionsTypes";
import { renderUrgencyBadge } from "./IntakeSubmissionsCard";
import { useState } from "react";

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
    viewDocument: "View Document",
    documentPreview: "Document Preview",
    closePreview: "Close Preview",
    patientName: "Patient Name",
    dateOfBirth: "Date of Birth",
    formDetails: "Form Details"
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
    viewDocument: "Ver Documento",
    documentPreview: "Vista Previa del Documento",
    closePreview: "Cerrar Vista Previa",
    patientName: "Nombre del Paciente",
    dateOfBirth: "Fecha de Nacimiento",
    formDetails: "Detalles del Formulario"
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
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);

  // Create a PDF-like preview document from the form data
  const documentContent = `
Patient Information:
- Name: ${submission.childName}
- Date of Birth: ${new Date(submission.dob).toLocaleDateString()}
- Phone: ${submission.phoneNumber || "Not provided"}

Medical Information:
- Symptoms: ${submission.symptoms || "None reported"}
- Medical History: ${submission.medicalHistory || "None reported"}
- Medications & Allergies: ${submission.medicationsAndAllergies || "None reported"}
- Recent Hospital Visit: ${submission.hasRecentHospitalVisits ? "Yes" : "No"}
${submission.hasRecentHospitalVisits && submission.hospitalVisitLocation ? `  Location: ${submission.hospitalVisitLocation}` : ""}

Insurance Information:
- Has Insurance: ${submission.hasInsurance === true ? "Yes" : submission.hasInsurance === false ? "No" : "Not specified"}

Additional Concerns:
${submission.otherConcerns || "None reported"}
  `;

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <UserCircle className="h-5 w-5" />
          {submission.childName} - {renderUrgencyBadge(urgency, language)}
        </DialogTitle>
      </DialogHeader>

      {showDocumentPreview ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{content.documentPreview}</h3>
            <Button variant="outline" size="sm" onClick={() => setShowDocumentPreview(false)}>
              {content.closePreview}
            </Button>
          </div>
          <div className="bg-white p-6 border rounded-md shadow-sm font-mono text-sm whitespace-pre-wrap">
            {documentContent}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{content.patientName}: {submission.childName}</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {content.dateOfBirth}: {new Date(submission.dob).toLocaleDateString()}
                </span>
              </div>
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setShowDocumentPreview(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {content.viewDocument}
                </Button>
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
        </>
      )}
    </DialogContent>
  );
};
