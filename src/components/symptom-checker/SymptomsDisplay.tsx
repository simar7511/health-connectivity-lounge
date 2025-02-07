
interface SymptomsDisplayProps {
  language: "en" | "es";
  symptoms: string;
}

export const SymptomsDisplay = ({ language, symptoms }: SymptomsDisplayProps) => {
  if (!symptoms) return null;

  return (
    <div className="p-4 bg-secondary/10 rounded-lg mt-4">
      <h3 className="font-semibold mb-2">
        {language === "en" ? "Recorded Symptoms:" : "Síntomas Registrados:"}
      </h3>
      <p>{symptoms}</p>
    </div>
  );
};
