import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, Baby, Heart, Globe, MessageSquare, Database } from "lucide-react";
import { useState } from "react";

const getServices = (language: "en" | "es") => ({
  en: [
    {
      title: "Prenatal Care",
      description: "Comprehensive prenatal care and monitoring for expectant mothers",
      icon: Baby,
    },
    {
      title: "Bilingual Support",
      description: "Access to Spanish-speaking healthcare professionals",
      icon: Globe,
    },
    {
      title: "Virtual Consultations",
      description: "Connect with your doctor from the comfort of your home",
      icon: MessageSquare,
    },
    {
      title: "Health Tracking",
      description: "Monitor your pregnancy journey with our digital tools",
      icon: Database,
    },
  ],
  es: [
    {
      title: "Cuidado Prenatal",
      description: "Atención y monitoreo prenatal integral para futuras madres",
      icon: Baby,
    },
    {
      title: "Soporte Bilingüe",
      description: "Acceso a profesionales de la salud que hablan español",
      icon: Globe,
    },
    {
      title: "Consultas Virtuales",
      description: "Conéctese con su médico desde la comodidad de su hogar",
      icon: MessageSquare,
    },
    {
      title: "Seguimiento de Salud",
      description: "Monitoree su embarazo con nuestras herramientas digitales",
      icon: Database,
    },
  ],
});

export const Services = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");
  const services = getServices(language);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">
            {language === "en" ? "Our Services" : "Nuestros Servicios"}
          </h2>
          <Button
            variant="ghost"
            onClick={() => setLanguage(language === "en" ? "es" : "en")}
            className="text-primary"
          >
            <Globe className="mr-2 h-4 w-4" />
            {language === "en" ? "Español" : "English"}
          </Button>
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