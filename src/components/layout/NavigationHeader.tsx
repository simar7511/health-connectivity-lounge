
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Breadcrumbs } from "./Breadcrumbs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavigationHeaderProps {
  title: string;
  showBackButton?: boolean;
  showBreadcrumbs?: boolean;
  showHomeButton?: boolean;
  className?: string;
  language?: "en" | "es";
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  showBackButton = true,
  showBreadcrumbs = true,
  showHomeButton = true,
  className,
  language = "en",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isRootPath = location.pathname === "/";

  const translations = {
    en: {
      home: "Home",
      back: "Back",
      menu: "Menu",
      findClinic: "Find a Clinic",
      appointments: "Appointments",
      chat: "Chat",
      aiHealth: "AI Health Assistant",
      switchToSpanish: "Switch to Spanish",
      switchToEnglish: "Switch to English"
    },
    es: {
      home: "Inicio",
      back: "Atrás",
      menu: "Menú",
      findClinic: "Encontrar una Clínica",
      appointments: "Citas",
      chat: "Chat",
      aiHealth: "Asistente de Salud IA",
      switchToSpanish: "Cambiar a Español",
      switchToEnglish: "Cambiar a Inglés"
    },
  };

  const t = translations[language];

  // Create navigation links based on the app structure
  const navLinks = [
    { label: t.home, path: "/" },
    { label: language === "en" ? "Find a Clinic" : "Encontrar una Clínica", path: "/free-clinic" },
    { label: language === "en" ? "Appointments" : "Citas", path: "/appointment" },
    { label: language === "en" ? "Chat" : "Chat", path: "/chat" },
    { label: language === "en" ? "AI Health Assistant" : "Asistente de Salud IA", path: "/ai-chat" },
  ];

  const handleLanguageSwitch = () => {
    const newLanguage = language === "en" ? "es" : "en";
    sessionStorage.setItem("preferredLanguage", newLanguage);
    window.location.reload();
  };

  return (
    <header className={cn("border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10", className)}>
      <div className="container flex items-center justify-between h-14 gap-4 px-4">
        <div className="flex items-center gap-2 flex-1">
          {showBackButton && !isRootPath && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label={t.back}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">{t.back}</span>
            </Button>
          )}
          
          {showHomeButton && !isRootPath && (
            <Link to="/" className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center gap-1"
              >
                <Home className="h-4 w-4" />
                {t.home}
              </Button>
            </Link>
          )}
          
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>

        {showBreadcrumbs && !isRootPath && (
          <div className="hidden md:block flex-1 mx-4">
            <Breadcrumbs language={language} />
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3">
          {navLinks.map((link) => (
            <Button
              key={link.path}
              variant={location.pathname === link.path ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate(link.path)}
              className={location.pathname === link.path ? "bg-primary text-primary-foreground" : ""}
            >
              {link.label}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLanguageSwitch}
          >
            {language === "en" ? t.switchToSpanish : t.switchToEnglish}
          </Button>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" aria-label={t.menu}>
                {t.menu}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Button
                    key={link.path}
                    variant={location.pathname === link.path ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => {
                      navigate(link.path);
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={handleLanguageSwitch}
                >
                  {language === "en" ? t.switchToSpanish : t.switchToEnglish}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
