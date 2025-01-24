import { Card, CardContent } from "@/components/ui/card";
import { HeartHandshake, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const content = {
  en: {
    title: "Our Mission",
    paragraph1: "Through our virtual care clinic, we strive to improve access to healthcare for marginalized communities in Adams County. We've seen firsthand how patients like Tina, a 25-year-old pregnant woman with high blood pressure, have benefited from our bilingual healthcare resources and comprehensive virtual care services.",
    paragraph2: "Our goal is to strengthen the patient-provider relationship, enhance health literacy, and break down communication barriers. By incorporating advanced language models, we enable our patients to make informed decisions about their health, ensuring that quality healthcare is accessible to all, regardless of language or background."
  },
  es: {
    title: "Nuestra Misión",
    paragraph1: "A través de nuestra clínica de atención virtual, nos esforzamos por mejorar el acceso a la atención médica para las comunidades marginadas en el Condado de Adams. Hemos visto de primera mano cómo pacientes como Tina, una mujer embarazada de 25 años con presión arterial alta, se han beneficiado de nuestros recursos de salud bilingües y servicios integrales de atención virtual.",
    paragraph2: "Nuestro objetivo es fortalecer la relación entre paciente y proveedor, mejorar la alfabetización en salud y derribar las barreras de comunicación. Al incorporar modelos avanzados de lenguaje, permitimos que nuestros pacientes tomen decisiones informadas sobre su salud, asegurando que la atención médica de calidad sea accesible para todos, independientemente del idioma o antecedentes."
  }
};

export const MissionStatement = () => {
  const [language, setLanguage] = useState<"en" | "es">("en");

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-8">
          <HeartHandshake className="w-12 h-12 text-primary mb-4" />
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold">{content[language].title}</h2>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80"
              onClick={toggleLanguage}
            >
              <Globe className="mr-2 h-4 w-4" />
              {language === "en" ? "Español" : "English"}
            </Button>
          </div>
        </div>
        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              {content[language].paragraph1}
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              {content[language].paragraph2}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};