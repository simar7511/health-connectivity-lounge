import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useState } from "react";

const getDoctors = (language: "en" | "es") => ({
  en: [
    {
      name: "Dr. Sarah Johnson",
      specialty: "OB/GYN",
      languages: ["English", "Spanish"],
      image: "/placeholder.svg",
      description: "Specializing in maternal health with 10+ years of experience",
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Family Medicine",
      languages: ["English", "Spanish", "Mandarin"],
      image: "/placeholder.svg",
      description: "Focused on comprehensive family healthcare",
    },
  ],
  es: [
    {
      name: "Dra. Sarah Johnson",
      specialty: "Ginecología y Obstetricia",
      languages: ["Inglés", "Español"],
      image: "/placeholder.svg",
      description: "Especializada en salud materna con más de 10 años de experiencia",
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Medicina Familiar",
      languages: ["Inglés", "Español", "Mandarín"],
      image: "/placeholder.svg",
      description: "Enfocado en atención integral de la salud familiar",
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
                <CardTitle>{doctor.name}</CardTitle>
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