import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLine } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Patient } from "@/types/patient";

interface PatientTrendsProps {
  language: "en" | "es";
  patient: Patient | null;
}

const content = {
  en: {
    title: "Patient Trends",
    vitals: {
      bp: "Blood Pressure",
      glucose: "Glucose",
      weight: "Weight",
      fetalMovements: "Fetal Movements"
    }
  },
  es: {
    title: "Tendencias del Paciente",
    vitals: {
      bp: "Presión Arterial",
      glucose: "Glucosa",
      weight: "Peso",
      fetalMovements: "Movimientos Fetales"
    }
  }
};

const getVitalStatus = (type: keyof Patient["vitals"], value: number) => {
  const thresholds = {
    bp: { low: 90, high: 140 },
    glucose: { low: 70, high: 130 },
    weight: { low: 45, high: 100 },
    fetalMovements: { low: 5, high: 25 }
  };
  
  const threshold = thresholds[type];
  if (value < threshold.low) return "text-blue-500";
  if (value > threshold.high) return "text-red-500";
  return "text-green-500";
};

export const PatientTrends = ({ language, patient }: PatientTrendsProps) => (
  <Card className="col-span-1 lg:col-span-2">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <ChartLine className="h-5 w-5" />
        {content[language].title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {patient && (
        <div className="space-y-6">
          {Object.entries(patient.vitals).map(([key, values]) => (
            <div key={key} className="space-y-2">
              <h3 className="font-medium">
                {content[language].vitals[key as keyof typeof content.en.vitals]}
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer>
                  <LineChart data={values.map((value, index) => ({ name: index, value }))}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={getVitalStatus(key as keyof Patient["vitals"], values[values.length - 1])}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);