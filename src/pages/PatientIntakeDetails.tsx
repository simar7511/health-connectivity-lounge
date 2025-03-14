
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, FileText, MessageSquare, Phone, Printer, User } from "lucide-react";
import { IntakeFormSubmission } from "@/components/dashboard/IntakeSubmissionsTypes";
import { getUrgencyLevel } from "@/components/dashboard/IntakeSubmissionUtils";
import { renderUrgencyBadge } from "@/components/dashboard/IntakeSubmissionsCard";
import { jsPDF } from "jspdf";

interface PatientIntakeDetailsProps {
  language: "en" | "es";
}

const translations = {
  en: {
    title: "Patient Intake Details",
    basicInfo: "Basic Information",
    medicalInfo: "Medical Information",
    socialInfo: "Social Information",
    contactPatient: "Contact Patient",
    printIntakeForm: "Print Intake Form",
    scheduleAppointment: "Schedule Appointment",
    back: "Back to Dashboard",
    childName: "Child's Name",
    dob: "Date of Birth",
    phone: "Phone Number",
    notificationType: "Notification Type",
    symptoms: "Symptoms",
    medicalHistory: "Medical History",
    medicationsAndAllergies: "Medications & Allergies",
    recentHospitalVisit: "Recent Hospital Visit",
    hasInsurance: "Has Insurance",
    otherConcerns: "Other Concerns",
    yes: "Yes",
    no: "No",
    notSpecified: "Not specified",
    loading: "Loading patient intake details...",
    error: "Error loading intake details",
    errorMessage: "There was a problem loading the patient's intake form. Please try again later.",
    returnToDashboard: "Return to Dashboard",
  },
  es: {
    title: "Detalles de Admisión del Paciente",
    basicInfo: "Información Básica",
    medicalInfo: "Información Médica",
    socialInfo: "Información Social",
    contactPatient: "Contactar Paciente",
    printIntakeForm: "Imprimir Formulario",
    scheduleAppointment: "Agendar Cita",
    back: "Volver al Panel",
    childName: "Nombre del Niño",
    dob: "Fecha de Nacimiento",
    phone: "Número de Teléfono",
    notificationType: "Tipo de Notificación",
    symptoms: "Síntomas",
    medicalHistory: "Historial Médico",
    medicationsAndAllergies: "Medicamentos y Alergias",
    recentHospitalVisit: "Visita Reciente al Hospital",
    hasInsurance: "Tiene Seguro",
    otherConcerns: "Otras Preocupaciones",
    yes: "Sí",
    no: "No",
    notSpecified: "No especificado",
    loading: "Cargando detalles de admisión del paciente...",
    error: "Error al cargar detalles de admisión",
    errorMessage: "Hubo un problema al cargar el formulario de admisión del paciente. Por favor intente más tarde.",
    returnToDashboard: "Volver al Panel",
  }
};

const PatientIntakeDetails = ({ language }: PatientIntakeDetailsProps) => {
  const { patientId } = useParams<{ patientId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submission, setSubmission] = useState<IntakeFormSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Check if submission was passed via location state
  useEffect(() => {
    if (location.state?.submission) {
      setSubmission(location.state.submission);
      setLoading(false);
    } else if (patientId) {
      // Fetch from Firestore if not in state
      const fetchSubmission = async () => {
        try {
          const docRef = doc(db, "pediatricIntake", patientId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setSubmission({
              id: docSnap.id,
              ...docSnap.data(),
            } as IntakeFormSubmission);
          } else {
            console.error("No such document!");
            setError(true);
          }
        } catch (err) {
          console.error("Error fetching intake submission:", err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      
      fetchSubmission();
    }
  }, [location.state, patientId]);

  const handleContactPatient = () => {
    if (submission) {
      // Navigate to chat or messaging interface
      navigate(`/chat/${submission.childName}`, { state: { patientInfo: submission } });
    }
  };

  const handlePrintIntakeForm = () => {
    if (!submission) return;
    
    const pdf = new jsPDF();
    const lineHeight = 7;
    let yPosition = 20;
    
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text(language === "es" ? "FORMULARIO DE ADMISIÓN" : "PATIENT INTAKE FORM", 105, yPosition, { align: "center" });
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    yPosition += lineHeight * 2;

    // Basic Info Section
    pdf.setFont("helvetica", "bold");
    pdf.text(translations[language].basicInfo, 20, yPosition);
    pdf.setFont("helvetica", "normal");
    yPosition += lineHeight;
    pdf.text(`${translations[language].childName}: ${submission.childName}`, 20, yPosition);
    yPosition += lineHeight;
    pdf.text(`${translations[language].dob}: ${new Date(submission.dob).toLocaleDateString()}`, 20, yPosition);
    yPosition += lineHeight;
    pdf.text(`${translations[language].phone}: ${submission.phoneNumber}`, 20, yPosition);
    yPosition += lineHeight;
    pdf.text(`${translations[language].notificationType}: ${submission.notificationType}`, 20, yPosition);
    yPosition += lineHeight * 2;

    // Medical Info Section
    pdf.setFont("helvetica", "bold");
    pdf.text(translations[language].medicalInfo, 20, yPosition);
    pdf.setFont("helvetica", "normal");
    yPosition += lineHeight;
    pdf.text(`${translations[language].symptoms}: ${submission.symptoms || translations[language].notSpecified}`, 20, yPosition);
    yPosition += lineHeight;
    pdf.text(`${translations[language].medicalHistory}: ${submission.medicalHistory || translations[language].notSpecified}`, 20, yPosition);
    yPosition += lineHeight;
    pdf.text(`${translations[language].medicationsAndAllergies}: ${submission.medicationsAndAllergies || translations[language].notSpecified}`, 20, yPosition);
    yPosition += lineHeight;
    
    const hasRecentVisit = submission.hasRecentHospitalVisits ? translations[language].yes : translations[language].no;
    pdf.text(`${translations[language].recentHospitalVisit}: ${hasRecentVisit}`, 20, yPosition);
    yPosition += lineHeight * 2;

    // Social Info Section
    pdf.setFont("helvetica", "bold");
    pdf.text(translations[language].socialInfo, 20, yPosition);
    pdf.setFont("helvetica", "normal");
    yPosition += lineHeight;
    
    const hasInsurance = submission.hasInsurance === true
      ? translations[language].yes
      : submission.hasInsurance === false
      ? translations[language].no
      : translations[language].notSpecified;
    
    pdf.text(`${translations[language].hasInsurance}: ${hasInsurance}`, 20, yPosition);
    yPosition += lineHeight;
    
    pdf.text(`${translations[language].otherConcerns}: ${submission.otherConcerns || translations[language].notSpecified}`, 20, yPosition);

    pdf.save(`intake_form_${submission.childName.replace(/\s+/g, '_')}.pdf`);
    
    toast({
      title: language === "es" ? "Formulario Generado" : "Form Generated",
      description: language === "es" 
        ? "El formulario de admisión ha sido descargado."
        : "The intake form has been downloaded.",
    });
  };

  const content = translations[language];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4">{content.loading}</p>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">{content.error}</h1>
        <p className="text-gray-600 mb-6">{content.errorMessage}</p>
        <Button onClick={() => navigate('/provider/dashboard')}>
          {content.returnToDashboard}
        </Button>
      </div>
    );
  }

  const urgency = getUrgencyLevel(submission);

  return (
    <div className="container mx-auto p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate('/provider/dashboard')}>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Intake Forms</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>{submission.childName}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/provider/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {content.back}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrintIntakeForm}>
            <Printer className="mr-2 h-4 w-4" />
            {content.printIntakeForm}
          </Button>
          <Button variant="outline" size="sm" onClick={handleContactPatient}>
            <MessageSquare className="mr-2 h-4 w-4" />
            {content.contactPatient}
          </Button>
          <Button variant="default" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            {content.scheduleAppointment}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            {submission.childName}
            <span className="ml-2">{renderUrgencyBadge(urgency, language)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="mt-4">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">{content.basicInfo}</TabsTrigger>
              <TabsTrigger value="medical">{content.medicalInfo}</TabsTrigger>
              <TabsTrigger value="social">{content.socialInfo}</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">{content.childName}</p>
                  <p className="text-base">{submission.childName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">{content.dob}</p>
                  <p className="text-base">{new Date(submission.dob).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">{content.phone}</p>
                  <p className="text-base">{submission.phoneNumber || content.notSpecified}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">{content.notificationType}</p>
                  <p className="text-base uppercase">{submission.notificationType}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">{content.symptoms}</p>
                  <p className="text-base p-3 bg-gray-50 rounded-md">{submission.symptoms || content.notSpecified}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">{content.medicalHistory}</p>
                  <p className="text-base p-3 bg-gray-50 rounded-md">{submission.medicalHistory || content.notSpecified}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">{content.medicationsAndAllergies}</p>
                  <p className="text-base p-3 bg-gray-50 rounded-md">{submission.medicationsAndAllergies || content.notSpecified}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">{content.recentHospitalVisit}</p>
                  <p className="text-base">
                    {submission.hasRecentHospitalVisits === true
                      ? content.yes
                      : submission.hasRecentHospitalVisits === false
                      ? content.no
                      : content.notSpecified}
                  </p>
                  {submission.hasRecentHospitalVisits && submission.hospitalVisitLocation && (
                    <p className="text-base p-3 bg-gray-50 rounded-md">
                      {submission.hospitalVisitLocation}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">{content.hasInsurance}</p>
                  <p className="text-base">
                    {submission.hasInsurance === true
                      ? content.yes
                      : submission.hasInsurance === false
                      ? content.no
                      : content.notSpecified}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">{content.otherConcerns}</p>
                  <p className="text-base p-3 bg-gray-50 rounded-md">{submission.otherConcerns || content.notSpecified}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientIntakeDetails;
