import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, MessageSquare, Database, Languages } from "lucide-react";

const services = {
  en: [
    {
      title: "Prenatal Health Literacy Support",
      description: "Transformation of complex medical terms into culturally sensitive, patient-friendly content",
      icon: Baby,
    },
    {
      title: "On Demand Virtual Consultations",
      description: "Connect with your doctor from the comfort of your home",
      icon: MessageSquare,
    },
    {
      title: "Personalized Health Monitoring",
      description: "Focuses on individualized tracking of health metrics",
      icon: Database,
    },
    {
      title: "Real-Time Medical Interpretation",
      description: "Live medical interpreters ensuring accurate and culturally sensitive communication between providers and patients",
      icon: Languages,
    }
  ],
  es: [
    {
      title: "Apoyo en Educación Prenatal",
      description: "Transformación de términos médicos complejos en contenido culturalmente sensible y amigable para el paciente",
      icon: Baby,
    },
    {
      title: "Consultas Virtuales a Demanda",
      description: "Conéctese con su médico desde la comodidad de su hogar",
      icon: MessageSquare,
    },
    {
      title: "Monitoreo de Salud Personalizado",
      description: "Se centra en el seguimiento individualizado de métricas de salud",
      icon: Database,
    },
    {
      title: "Interpretación Médica en Tiempo Real",
      description: "Intérpretes médicos en vivo que garantizan una comunicación precisa y culturalmente sensible entre proveedores y pacientes",
      icon: Languages,
    }
  ]
};

export const Services = ({ language }: { language: "en" | "es" }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold">
            {language === "en" ? "Our Services" : "Nuestros Servicios"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services[language].map((service) => (
            <Card key={service.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <service.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};