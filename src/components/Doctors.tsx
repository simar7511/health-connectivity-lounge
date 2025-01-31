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

interface DoctorDetails {
  role: string;
  experience: string;
  practice: string;
  goal: string;
  challenge: string;
  story: string;
}

interface Doctor {
  name: string;
  specialty: string;
  languages: string[];
  image: string;
  description: string;
  details: DoctorDetails;
}

interface DoctorsProps {
  language: "en" | "es";
}

const getDoctors = (language: "en" | "es") => ({
  en: [
    {
      name: "Dr. Emily Smith",
      specialty: "OB/GYN",
      languages: ["English", "Spanish"],
      image: "/placeholder.svg",
      description: "Over 10 years of experience in women's health and prenatal care",
      details: {
        role: "OB/GYN Provider",
        experience: "10+ years of practice",
        practice: "Specializes in maternal health services and improving healthcare access for underserved communities",
        goal: "Dedicated to providing comprehensive women's health services with a focus on accessibility",
        challenge: "Working to overcome barriers to healthcare access",
        story: "As an OB/GYN committed to serving underserved communities, I strive to provide culturally sensitive care while ensuring all patients receive the highest quality of maternal health services."
      }
    },
    {
      name: "Dr. Michael Reyes",
      specialty: "Pediatrics",
      languages: ["English", "Spanish"],
      image: "/placeholder.svg",
      description: "8+ years specializing in child healthcare and developmental screenings",
      details: {
        role: "Pediatrician",
        experience: "8+ years of practice",
        practice: "Specializes in treating underserved and migrant populations",
        goal: "Provide culturally sensitive pediatric care while ensuring accessibility",
        challenge: "Breaking down cultural and economic barriers to healthcare",
        story: "With extensive experience in serving diverse communities, I focus on providing comprehensive pediatric care that respects cultural differences while ensuring optimal health outcomes for all children."
      }
    },
  ],
  es: [
    {
      name: "Dra. Emily Smith",
      specialty: "Ginecología y Obstetricia",
      languages: ["Inglés", "Español"],
      image: "/placeholder.svg",
      description: "Más de 10 años de experiencia en salud de la mujer y atención prenatal",
      details: {
        role: "Proveedora de Ginecología y Obstetricia",
        experience: "Más de 10 años de práctica",
        practice: "Especializada en servicios de salud materna y mejora del acceso a la atención médica para comunidades desatendidas",
        goal: "Dedicada a proporcionar servicios integrales de salud para la mujer con enfoque en la accesibilidad",
        challenge: "Trabajando para superar las barreras al acceso a la atención médica",
        story: "Como ginecóloga-obstetra comprometida con las comunidades desatendidas, me esfuerzo por brindar atención culturalmente sensible mientras aseguro que todas las pacientes reciban servicios de salud materna de la más alta calidad."
      }
    },
    {
      name: "Dr. Michael Reyes",
      specialty: "Pediatría",
      languages: ["Inglés", "Español"],
      image: "/placeholder.svg",
      description: "Más de 8 años especializado en salud infantil y evaluaciones del desarrollo",
      details: {
        role: "Pediatra",
        experience: "Más de 8 años de práctica",
        practice: "Especializado en atender a poblaciones desatendidas y migrantes",
        goal: "Brindar atención pediátrica culturalmente sensible garantizando la accesibilidad",
        challenge: "Rompiendo barreras culturales y económicas en la atención médica",
        story: "Con amplia experiencia en servir a comunidades diversas, me enfoco en brindar atención pediátrica integral que respeta las diferencias culturales mientras aseguro resultados óptimos de salud para todos los niños."
      }
    },
  ],
});

export const Doctors = ({ language }: DoctorsProps) => {
  const doctors = getDoctors(language);

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12">
          {language === "en" ? "Meet Our Doctors" : "Conozca a Nuestros Médicos"}
        </h2>
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
