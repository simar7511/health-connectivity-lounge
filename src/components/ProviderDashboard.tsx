import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Calendar,
  MessageSquare,
  Video,
  Phone,
  Globe,
  FileText,
  PlusCircle,
  Pill,
  TestTube,
  AlertTriangle,
  ChartLine,
  Languages,
} from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ProviderDashboardProps {
  language: "en" | "es";
}

interface Patient {
  id: string;
  name: string;
  language: "en" | "es";
  nextAppointment: string;
  demographics: {
    age: number;
    preferredLanguage: "en" | "es";
    insuranceStatus: "insured" | "uninsured";
  };
  vitals: {
    bp: number[];
    glucose: number[];
    weight: number[];
    fetalMovements?: number[];
  };
  risks: string[];
  recentSymptoms: string[];
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Maria Garcia",
    language: "es",
    nextAppointment: "2024-03-20T10:00:00",
    demographics: {
      age: 28,
      preferredLanguage: "es",
      insuranceStatus: "uninsured"
    },
    vitals: {
      bp: [120, 122, 118, 121],
      glucose: [95, 98, 92, 96],
      weight: [65, 65.5, 66, 66.2],
      fetalMovements: [10, 12, 8, 15],
    },
    risks: ["High blood pressure", "Gestational diabetes risk"],
    recentSymptoms: ["Mild headache", "Swollen ankles"]
  },
];

export const ProviderDashboard = ({ language }: ProviderDashboardProps) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { toast } = useToast();

  const content = {
    en: {
      title: "Provider Dashboard",
      appointments: "Upcoming Appointments",
      messages: "Secure Messages",
      trends: "Patient Trends",
      documentation: "Documentation",
      startConsultation: "Start Consultation",
      video: "Video Call",
      audio: "Audio Call",
      chat: "Secure Chat",
      translate: "Auto-Translate",
      prescriptions: "E-Prescriptions",
      labs: "Lab Orders",
      risks: "Risk Alerts",
      aiSummary: "AI Summary",
      demographics: "Patient Demographics",
      symptoms: "Recent Symptoms",
    },
    es: {
      title: "Panel del Proveedor",
      appointments: "Próximas Citas",
      messages: "Mensajes Seguros",
      trends: "Tendencias del Paciente",
      documentation: "Documentación",
      startConsultation: "Iniciar Consulta",
      video: "Videollamada",
      audio: "Llamada de Audio",
      chat: "Chat Seguro",
      translate: "Auto-Traducir",
      prescriptions: "Recetas Electrónicas",
      labs: "Órdenes de Laboratorio",
      risks: "Alertas de Riesgo",
      aiSummary: "Resumen IA",
      demographics: "Datos Demográficos",
      symptoms: "Síntomas Recientes",
    },
  };

  const handleStartConsultation = (type: "video" | "audio" | "chat") => {
    toast({
      title: language === "en" ? "Starting consultation" : "Iniciando consulta",
      description:
        language === "en"
          ? `Preparing ${type} consultation...`
          : `Preparando consulta por ${type}...`,
    });
  };

  const handleTranslate = () => {
    toast({
      title: language === "en" ? "Translating" : "Traduciendo",
      description:
        language === "en"
          ? "Translating content..."
          : "Traduciendo contenido...",
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-8">{content[language].title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {content[language].appointments}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(patient.nextAppointment).toLocaleString()}
                      </p>
                      {patient.demographics.preferredLanguage === "es" && (
                        <span className="inline-flex items-center text-sm text-blue-600">
                          <Languages className="h-4 w-4 mr-1" />
                          Español
                        </span>
                      )}
                    </div>
                    {patient.risks.length > 0 && (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Secure Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {content[language].messages}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Message preview list */}
          </CardContent>
        </Card>

        {/* Patient Trends */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartLine className="h-5 w-5" />
              {content[language].trends}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPatient && (
              <div className="space-y-6">
                <ChartContainer className="h-[300px]" config={{}}>
                  <LineChart data={selectedPatient.vitals.bp.map((value, index) => ({ name: index, value }))}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#2B6CB0" />
                  </LineChart>
                </ChartContainer>
                
                {/* Patient Demographics and Risks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">{content[language].demographics}</h3>
                    <p>Age: {selectedPatient.demographics.age}</p>
                    <p>Language: {selectedPatient.demographics.preferredLanguage === "es" ? "Spanish" : "English"}</p>
                    <p>Insurance: {selectedPatient.demographics.insuranceStatus}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">{content[language].symptoms}</h3>
                    <ul className="list-disc list-inside">
                      {selectedPatient.recentSymptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{content[language].documentation}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => handleStartConsultation("video")}
            >
              <Video className="h-5 w-5" />
              {content[language].video}
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => handleStartConsultation("audio")}
            >
              <Phone className="h-5 w-5" />
              {content[language].audio}
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={handleTranslate}
            >
              <Globe className="h-5 w-5" />
              {content[language].translate}
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Pill className="h-5 w-5" />
              {content[language].prescriptions}
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <TestTube className="h-5 w-5" />
              {content[language].labs}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};