import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Patient } from "@/types/patient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HealthDataLogsProps {
  patients?: Patient[];
}

type HealthStatus = "high-risk" | "attention" | "normal";

interface PatientSummary {
  id: string;
  name: string;
  latestVitals: {
    bp?: number[];
    glucose?: number;
  };
  recentSymptoms: string[];
  healthStatus: HealthStatus;
}

// Mock data for demonstration
const patientSummaries: PatientSummary[] = [
  {
    id: "1",
    name: "Jane Doe",
    latestVitals: {
      bp: [140, 90],
      glucose: 110
    },
    recentSymptoms: ["Headache", "Dizziness"],
    healthStatus: "attention"
  },
  // ... other patient summaries
];

export const HealthDataLogs = ({ patients }: HealthDataLogsProps) => {
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
