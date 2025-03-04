
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
      switchToSpanish: "Switch to Spanish",
      switchToEnglish: "Switch to English"
    },
    es: {
      home: "Inicio",
      back: "Atrás",
      menu: "Menú",
      switchToSpanish: "Cambiar a Español",
      switchToEnglish: "Cambiar a Inglés"
    },
  };

  const t = translations[language];

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

        {/* Desktop Language Switch */}
        <div className="hidden md:flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLanguageSwitch}
          >
            {language === "en" ? t.switchToSpanish : t.switchToEnglish}
          </Button>
        </div>

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
