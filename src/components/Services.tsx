import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, MessageSquare, Database, Languages, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const services = {
  en: [
    {
      title: "Prenatal Health Literacy Support",
      description: "Transformation of complex medical terms into culturally sensitive, patient-friendly content",
      details: "Our expert team works to simplify complex medical terminology, ensuring that all prenatal information is accessible and culturally appropriate. We provide comprehensive educational materials, interactive learning sessions, and personalized guidance throughout your pregnancy journey.",
      icon: Baby,
    },
    {
      title: "On Demand Virtual Consultations",
      description: "Connect with your doctor from the comfort of your home",
      details: "Access healthcare professionals 24/7 through our secure platform. Schedule appointments at your convenience, engage in video consultations, and receive follow-up care without leaving your home. Includes emergency support and specialist referrals when needed.",
      icon: MessageSquare,
    },
    {
      title: "Personalized Health Monitoring",
      description: "Focuses on individualized tracking of health metrics",
      details: "Track your vital signs, symptoms, and health progress with our advanced monitoring tools. Receive personalized insights, trend analysis, and automated alerts. Our system adapts to your specific health needs and pregnancy stage.",
      icon: Database,
    },
    {
      title: "Real-Time Medical Interpretation",
      description: "Live medical interpreters ensuring accurate and culturally sensitive communication between providers and patients",
      details: "Access professional medical interpreters instantly through our platform. Our interpreters are trained in medical terminology and cultural sensitivity, ensuring clear communication during all healthcare interactions. Available in multiple languages 24/7.",
      icon: Languages,
    }
  ],
  es: [
    {
      title: "Apoyo en Educación Prenatal",
      description: "Transformación de términos médicos complejos en contenido culturalmente sensible y amigable para el paciente",
      details: "Nuestro equipo de expertos trabaja para simplificar la terminología médica compleja, asegurando que toda la información prenatal sea accesible y culturalmente apropiada. Ofrecemos materiales educativos completos, sesiones de aprendizaje interactivas y orientación personalizada durante su embarazo.",
      icon: Baby,
    },
    {
      title: "Consultas Virtuales a Demanda",
      description: "Conéctese con su médico desde la comodidad de su hogar",
      details: "Acceda a profesionales de la salud 24/7 a través de nuestra plataforma segura. Programe citas a su conveniencia, participe en consultas por video y reciba atención de seguimiento sin salir de casa. Incluye soporte de emergencia y referencias a especialistas cuando sea necesario.",
      icon: MessageSquare,
    },
    {
      title: "Monitoreo de Salud Personalizado",
      description: "Se centra en el seguimiento individualizado de métricas de salud",
      details: "Monitoree sus signos vitales, síntomas y progreso de salud con nuestras herramientas avanzadas. Reciba información personalizada, análisis de tendencias y alertas automáticas. Nuestro sistema se adapta a sus necesidades específicas de salud y etapa del embarazo.",
      icon: Database,
    },
    {
      title: "Interpretación Médica en Tiempo Real",
      description: "Intérpretes médicos en vivo que garantizan una comunicación precisa y culturalmente sensible entre proveedores y pacientes",
      details: "Acceda instantáneamente a intérpretes médicos profesionales a través de nuestra plataforma. Nuestros intérpretes están capacitados en terminología médica y sensibilidad cultural, asegurando una comunicación clara durante todas las interacciones de atención médica. Disponible en varios idiomas 24/7.",
      icon: Languages,
    }
  ]
};

export const Services = ({ language }: { language: "en" | "es" }) => {
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const toggleService = (title: string) => {
    setExpandedService(expandedService === title ? null : title);
  };

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
            <Card 
              key={service.title} 
              className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
                expandedService === service.title ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => toggleService(service.title)}
            >
              <CardHeader>
                <service.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="flex justify-between items-center">
                  <span>{service.title}</span>
                  {expandedService === service.title ? (
                    <ChevronUp className="w-5 h-5 text-primary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{service.description}</p>
                {expandedService === service.title && (
                  <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
                    <p className="text-gray-700">{service.details}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};