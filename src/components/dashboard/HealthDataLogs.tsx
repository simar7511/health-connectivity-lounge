import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Patient } from "@/types/patient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle, FileText, Search, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HealthDataLogsProps {
  patient: Patient;
}

type Severity = "mild" | "moderate" | "severe";
type TimeFilter = "7days" | "30days" | "90days" | "all";
type HealthStatus = "normal" | "attention" | "high-risk";

interface SymptomLog {
  timestamp: string;
  symptom: string;
  severity: Severity;
  description: string;
  relatedCondition?: string;
  bp?: number[];
  glucose?: number;
}

interface PatientSummary {
  id: string;
  name: string;
  latestVitals: {
    bp?: number[];
    glucose?: number;
    temp?: number;
  };
  recentSymptoms: string[];
  healthStatus: HealthStatus;
  lastFollowUp: string;
}

const patientSummaries: PatientSummary[] = [
  {
    id: "1",
    name: "Maria Garcia",
    latestVitals: {
      bp: [150, 95],
      glucose: 98,
      temp: 37.2
    },
    recentSymptoms: ["Headache", "Swollen ankles"],
    healthStatus: "high-risk",
    lastFollowUp: "2024-03-15"
  },
  {
    id: "2",
    name: "John Smith",
    latestVitals: {
      bp: [122, 78],
      glucose: 92,
      temp: 36.8
    },
    recentSymptoms: [],
    healthStatus: "normal",
    lastFollowUp: "2024-03-18"
  }
];

const mockSymptomLogs: SymptomLog[] = [
  {
    timestamp: "2024-03-20T09:30:00",
    symptom: "Headache",
    severity: "moderate",
    description: "Persistent headache with visual disturbances",
    relatedCondition: "Gestational Hypertension",
    bp: [140, 90]
  },
  {
    timestamp: "2024-03-19T15:45:00",
    symptom: "Swelling",
    severity: "mild",
    description: "Slight ankle swelling",
    bp: [135, 88]
  },
  {
    timestamp: "2024-03-18T11:20:00",
    symptom: "Dizziness",
    severity: "severe",
    description: "Severe dizziness upon standing",
    relatedCondition: "Gestational Hypertension",
    bp: [150, 95]
  }
];

const mockIntakeData = {
  symptoms: "Frequent headaches and dizziness",
  medicalHistory: "Previous gestational hypertension",
  medicationsAndAllergies: "Taking prenatal vitamins, No known allergies",
  hasRecentHospitalVisits: true,
  hospitalVisitLocation: "Memorial Hospital"
};

export const HealthDataLogs = ({ patient }: HealthDataLogsProps) => {
  const navigate = useNavigate();
  const getHealthStatusIcon = (status: HealthStatus) => {
    switch (status) {
      case "high-risk":
        return "🔴";
      case "attention":
        return "🟠";
      case "normal":
        return "🟢";
    }
  };

  const getVitalsStatus = (bp?: number[]) => {
    if (!bp) return null;
    const [systolic, diastolic] = bp;
    if (systolic >= 140 || diastolic >= 90) return "High";
    if (systolic <= 90 || diastolic <= 60) return "Low";
    return "Normal";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Health Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Latest Vitals</th>
                <th className="py-3 px-4">Key Symptoms</th>
                <th className="py-3 px-4">Health Status</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody>
              {patientSummaries.map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{patient.name}</td>
                  <td className="py-3 px-4">
                    {patient.latestVitals.bp && (
                      <div className="flex items-center gap-2">
                        <span>BP: {patient.latestVitals.bp.join('/')}</span>
                        <Badge 
                          className={
                            getVitalsStatus(patient.latestVitals.bp) === "High" 
                              ? "bg-red-500" 
                              : getVitalsStatus(patient.latestVitals.bp) === "Low"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }
                        >
                          {getVitalsStatus(patient.latestVitals.bp)}
                        </Badge>
                      </div>
                    )}
                    {patient.latestVitals.glucose && (
                      <div>Glucose: {patient.latestVitals.glucose} mg/dL</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {patient.recentSymptoms.length > 0 
                      ? patient.recentSymptoms.join(", ")
                      : "No symptoms"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getHealthStatusIcon(patient.healthStatus)}
                      <span className="capitalize">{patient.healthStatus.replace("-", " ")}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/patient/${patient.id}`)}
                      className="flex items-center gap-2"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
