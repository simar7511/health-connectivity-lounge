import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const getDoctors = (language: "en" | "es") => ({
  en: [
    {
      name: "Dr. Sarah Smith",
      specialty: "OB/GYN",
      languages: ["English", "Spanish"],
      image: "/placeholder.svg",
      description: "Specializing in maternal health with 10+ years of experience",
      details: {
        role: "OB/GYN Provider",
        experience: "10+ years of practice",
        practice: "Runs a clinic with minimal support",
        goal: "Improve patient-provider communication and optimize clinic workflow",
        challenge: "Struggling to provide individualized care",
        story: "As a rural OB/GYN, I want tools that streamline patient communication and data management so I can focus on providing personalized care despite limited resources."
      }
    },
    {
      name: "Dr. Alex Rivera",
      specialty: "Pediatrics",
      languages: ["English", "Spanish"],
      image: "/placeholder.svg",
      description: "Specialized in comprehensive pediatric care for 7+ years",
      details: {
        role: "Pediatrician",
        experience: "7+ years of practice",
        practice: "Runs a small pediatric clinic in a rural area",
        goal: "Enhance communication with patients and families while improving the clinic's efficiency in managing care",
        challenge: "Faces difficulties in providing personalized care due to a high patient volume and limited staff",
        story: "As a rural pediatrician, I want tools that simplify patient communication and streamline care management so I can deliver high-quality, individualized care despite limited resources."
      }
    },
  ],
  es: [
    {
      name: "Dra. Sarah Smith",
      specialty: "Ginecología y Obstetricia",
      languages: ["Inglés", "Español"],
      image: "/placeholder.svg",
      description: "Especializada en salud materna con más de 10 años de experiencia",
      details: {
        role: "Proveedora de Ginecología y Obstetricia",
        experience: "Más de 10 años de práctica",
        practice: "Dirige una clínica con apoyo mínimo",
        goal: "Mejorar la comunicación paciente-proveedor y optimizar el flujo de trabajo de la clínica",
        challenge: "Luchando por proporcionar atención individualizada",
        story: "Como ginecóloga-obstetra rural, quiero herramientas que agilicen la comunicación con los pacientes y la gestión de datos para poder centrarme en proporcionar una atención personalizada a pesar de los recursos limitados."
      }
    },
    {
      name: "Dr. Alex Rivera",
      specialty: "Pediatría",
      languages: ["Inglés", "Español"],
      image: "/placeholder.svg",
      description: "Especializado en atención pediátrica integral con más de 7 años de experiencia",
      details: {
        role: "Pediatra",
        experience: "Más de 7 años de práctica",
        practice: "Dirige una pequeña clínica pediátrica en una zona rural",
        goal: "Mejorar la comunicación con pacientes y familias mientras optimiza la eficiencia de la clínica en la gestión de la atención",
        challenge: "Enfrenta dificultades para proporcionar atención personalizada debido al alto volumen de pacientes y personal limitado",
        story: "Como pediatra rural, quiero herramientas que simplifiquen la comunicación con los pacientes y agilicen la gestión de la atención para poder brindar una atención individualizada de alta calidad a pesar de los recursos limitados."
      }
    },
  ],
});

export const Doctors = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");
  const doctors = getDoctors(language);

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">
            {language === "en" ? "Meet Our Doctors" : "Conozca a Nuestros Médicos"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {doctors[language].map((doctor) => (
            <Card key={doctor.name} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  <AvatarImage src={doctor.image} alt={doctor.name} />
                  <AvatarFallback>{doctor.name[0]}</AvatarFallback>
                </Avatar>
                {doctor.details ? (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <CardTitle className="cursor-pointer hover:text-primary transition-colors">
                        {doctor.name}
                      </CardTitle>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 text-left">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-primary">{doctor.details.role}</h4>
                        <p className="text-sm"><span className="font-medium">Experience:</span> {doctor.details.experience}</p>
                        <p className="text-sm"><span className="font-medium">Practice:</span> {doctor.details.practice}</p>
                        <p className="text-sm"><span className="font-medium">Goal:</span> {doctor.details.goal}</p>
                        <p className="text-sm"><span className="font-medium">Challenge:</span> {doctor.details.challenge}</p>
                        <p className="text-sm italic">{doctor.details.story}</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <CardTitle>{doctor.name}</CardTitle>
                )}
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {doctor.languages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{doctor.specialty}</p>
                <p className="text-sm text-gray-500">{doctor.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};