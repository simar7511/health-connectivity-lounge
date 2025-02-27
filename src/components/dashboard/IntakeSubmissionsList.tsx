import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, Timestamp, DocumentData } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, Calendar, Clock3, MessageSquare, Phone, UserCircle } from "lucide-react";

interface IntakeFormSubmission {
  id: string;
  childName: string;
  dob: string;
  phoneNumber: string;
  symptoms: string;
  medicalHistory: string;
  medicationsAndAllergies: string;
  hasRecentHospitalVisits: boolean | null;
  hospitalVisitLocation?: string;
  hasInsurance: boolean | null;
  otherConcerns?: string;
  language: "en" | "es";
  timestamp: Timestamp;
  notificationType: "sms" | "whatsapp";
}

interface IntakeSubmissionsListProps {
  language: "en" | "es";
}

const IntakeSubmissionsList = ({ language }: IntakeSubmissionsListProps) => {
  const [submissions, setSubmissions] = useState<IntakeFormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<IntakeFormSubmission | null>(null);
  const [openDetails, setOpenDetails] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "pediatricIntake"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const submissionsData: IntakeFormSubmission[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        submissionsData.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp
        } as IntakeFormSubmission);
      });
      
      setSubmissions(submissionsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching intake submissions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleViewDetails = (submission: IntakeFormSubmission) => {
    setSelectedSubmission(submission);
    setOpenDetails(true);
  };

  const getUrgencyLevel = (submission: IntakeFormSubmission): "low" | "medium" | "high" => {
    const urgentKeywords = [
      "severe", "emergency", "urgent", "bleeding", "difficulty breathing",
      "unconscious", "severe pain", "chest pain", "head injury", "trauma",
      "severo", "emergencia", "urgente", "sangrado", "dificultad para respirar",
      "inconsciente", "dolor severo", "dolor de pecho", "lesión en la cabeza"
    ];
    
    const symptomText = (submission.symptoms || "").toLowerCase();
    const medicalHistoryText = (submission.medicalHistory || "").toLowerCase();
    const combinedText = `${symptomText} ${medicalHistoryText}`;
    
    if (urgentKeywords.some(keyword => combinedText.includes(keyword))) {
      return "high";
    }
    
    if (submission.hasRecentHospitalVisits) {
      return "medium";
    }
    
    return "low";
  };

  const renderUrgencyBadge = (urgency: "low" | "medium" | "high") => {
    switch (urgency) {
      case "high":
        return <Badge className="bg-red-500 hover:bg-red-600">
          {language === "en" ? "High Urgency" : "Alta Urgencia"}
        </Badge>;
      case "medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">
          {language === "en" ? "Medium Urgency" : "Urgencia Media"}
        </Badge>;
      case "low":
        return <Badge className="bg-green-500 hover:bg-green-600">
          {language === "en" ? "Low Urgency" : "Baja Urgencia"}
        </Badge>;
    }
  };
  
  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleString(language === "en" ? "en-US" : "es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  const translations = {
    en: {
      title: "Recent Intake Submissions",
      noSubmissions: "No intake forms have been submitted yet.",
      loading: "Loading intake submissions...",
      name: "Name",
      dob: "Date of Birth",
      submitted: "Submitted",
      urgency: "Urgency",
      actions: "Actions",
      viewDetails: "View Details",
      contactPatient: "Contact Patient",
      intakeDetails: "Intake Form Details",
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
      assignProvider: "Assign Provider",
      scheduleAppointment: "Schedule Appointment",
      recentHospitalVisit: "Recent Hospital Visit",
      location: "Location"
    },
    es: {
      title: "Envíos de Admisión Recientes",
      noSubmissions: "Aún no se han enviado formularios de admisión.",
      loading: "Cargando envíos de admisión...",
      name: "Nombre",
      dob: "Fecha de Nacimiento",
      submitted: "Enviado",
      urgency: "Urgencia",
      actions: "Acciones",
      viewDetails: "Ver Detalles",
      contactPatient: "Contactar Paciente",
      intakeDetails: "Detalles del Formulario de Admisión",
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
      assignProvider: "Asignar Proveedor",
      scheduleAppointment: "Programar Cita",
      recentHospitalVisit: "Visita Reciente al Hospital",
      location: "Ubicación"
    }
  };

  const content = translations[language];

  const handleContactPatient = (submission: IntakeFormSubmission) => {
    console.log(`Contacting patient: ${submission.childName} via ${submission.notificationType}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : submissions.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">{content.noSubmissions}</p>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {submissions.map((submission) => {
                const urgency = getUrgencyLevel(submission);
                
                return (
                  <div 
                    key={submission.id} 
                    className="border rounded-lg p-4 hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="font-medium text-lg flex items-center gap-2">
                          <UserCircle className="h-5 w-5 text-primary" /> 
                          {submission.childName}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> 
                          <span>{content.dob}: {new Date(submission.dob).toLocaleDateString()}</span>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock3 className="h-4 w-4" /> 
                          <span>{content.submitted}: {formatDate(submission.timestamp)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {renderUrgencyBadge(urgency)}
                        <Dialog open={openDetails && selectedSubmission?.id === submission.id} onOpenChange={setOpenDetails}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewDetails(submission)}
                            >
                              {content.viewDetails}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <UserCircle className="h-5 w-5" />
                                {submission.childName} - {renderUrgencyBadge(urgency)}
                              </DialogTitle>
                            </DialogHeader>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg">{content.contactInfo}</h3>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <span>{content.phone}: {submission.phoneNumber || content.notSpecified}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                    <span>{content.notificationType}: {submission.notificationType.toUpperCase()}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <h3 className="font-semibold text-lg">{content.symptoms}</h3>
                                <p className="text-sm p-2 bg-accent/10 rounded-md">
                                  {submission.symptoms || content.notSpecified}
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                <h3 className="font-semibold">{content.medicalHistory}</h3>
                                <p className="text-sm p-2 bg-accent/10 rounded-md">
                                  {submission.medicalHistory || content.notSpecified}
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                <h3 className="font-semibold">{content.medications}</h3>
                                <p className="text-sm p-2 bg-accent/10 rounded-md">
                                  {submission.medicationsAndAllergies || content.notSpecified}
                                </p>
                              </div>
                              
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
                              
                              <div className="col-span-1 md:col-span-2 space-y-2">
                                <h3 className="font-semibold">{content.otherConcerns}</h3>
                                <p className="text-sm p-2 bg-accent/10 rounded-md">
                                  {submission.otherConcerns || content.notSpecified}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex justify-between mt-6">
                              <Button 
                                variant="outline" 
                                onClick={() => setOpenDetails(false)}
                              >
                                {content.closeDetails}
                              </Button>
                              <div className="space-x-2">
                                <Button 
                                  variant="default" 
                                  onClick={() => handleContactPatient(submission)}
                                >
                                  {content.contactPatient}
                                </Button>
                                <Button 
                                  variant="secondary"
                                >
                                  {content.scheduleAppointment}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleContactPatient(submission)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {submission.symptoms && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          <span className="font-medium">{content.symptoms}:</span> {submission.symptoms}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default IntakeSubmissionsList;
