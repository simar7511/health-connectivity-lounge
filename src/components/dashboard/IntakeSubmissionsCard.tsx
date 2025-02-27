
import { Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock3, MessageSquare, UserCircle } from "lucide-react";
import { IntakeFormSubmission } from "./IntakeSubmissionsTypes";

interface IntakeSubmissionsCardProps {
  submission: IntakeFormSubmission;
  urgency: "low" | "medium" | "high";
  handleViewDetails: (submission: IntakeFormSubmission) => void;
  handleContactPatient: (submission: IntakeFormSubmission) => void;
  language: "en" | "es";
}

const translations = {
  en: {
    dob: "Date of Birth",
    submitted: "Submitted",
    symptoms: "Symptoms",
    viewDetails: "View Details",
    highUrgency: "High Urgency",
    mediumUrgency: "Medium Urgency",
    lowUrgency: "Low Urgency",
  },
  es: {
    dob: "Fecha de Nacimiento",
    submitted: "Enviado",
    symptoms: "Síntomas",
    viewDetails: "Ver Detalles",
    highUrgency: "Alta Urgencia",
    mediumUrgency: "Urgencia Media",
    lowUrgency: "Baja Urgencia",
  },
};

export const renderUrgencyBadge = (urgency: "low" | "medium" | "high", language: "en" | "es") => {
  switch (urgency) {
    case "high":
      return (
        <Badge className="bg-red-500 hover:bg-red-600">
          {language === "en" ? translations.en.highUrgency : translations.es.highUrgency}
        </Badge>
      );
    case "medium":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          {language === "en" ? translations.en.mediumUrgency : translations.es.mediumUrgency}
        </Badge>
      );
    case "low":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          {language === "en" ? translations.en.lowUrgency : translations.es.lowUrgency}
        </Badge>
      );
  }
};

export const formatDate = (timestamp: Timestamp, language: "en" | "es") => {
  const date = timestamp.toDate();
  return date.toLocaleString(language === "en" ? "en-US" : "es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const IntakeSubmissionsCard = ({
  submission,
  urgency,
  handleViewDetails,
  handleContactPatient,
  language,
}: IntakeSubmissionsCardProps) => {
  const content = translations[language];

  return (
    <div key={submission.id} className="border rounded-lg p-4 hover:bg-accent/10 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-medium text-lg flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-primary" />
            {submission.childName}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {content.dob}: {new Date(submission.dob).toLocaleDateString()}
            </span>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            <span>
              {content.submitted}: {formatDate(submission.timestamp, language)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {renderUrgencyBadge(urgency, language)}
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => handleViewDetails(submission)}>
              {content.viewDetails}
            </Button>
          </DialogTrigger>
          <Button variant="ghost" size="sm" onClick={() => handleContactPatient(submission)}>
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview of symptoms */}
      {submission.symptoms && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            <span className="font-medium">{content.symptoms}:</span> {submission.symptoms}
          </p>
        </div>
      )}
    </div>
  );
};
