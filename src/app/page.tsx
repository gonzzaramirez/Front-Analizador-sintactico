"use client";
import { useState, useEffect } from "react";
import AuthTabs from "@/components/authTabs";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserGuide } from "@/components/userGuide";
import { CommandForm } from "@/components/command-form";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { CommandPatterns } from "@/components/command-patterns";
import { EventsList } from "@/components/event-list";
import { ModeToggle } from "@/components/toggle";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // Si no hay token, se muestra el formulario de login/registro
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full">
        <div className="w-full max-w-sm px-4">
          <h1 className="text-2xl font-bold text-center mb-4">Autenticación</h1>
          <AuthTabs onLogin={(t) => setToken(t)} />
        </div>
      </div>
    );
  }

  // Una vez logueado, se renderiza la app principal
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      {/* Header: toggle de modo y botón de logout */}
      <div className="w-full">
        <div className="absolute top-4 left-4">
          <ModeToggle />
        </div>
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            className="cursor-pointer"
            size="sm"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-8 w-full">
        <div className="text-center space-y-2 w-full relative">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Asistente de Agenda
            </h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowGuide(!showGuide)}
                    className="cursor-pointer"
                  >
                    <HelpCircle />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Guía de uso</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-muted-foreground">
            Escribe comandos en lenguaje natural para gestionar tu agenda.
          </p>
        </div>

        {showGuide && <UserGuide />}

        <Tabs defaultValue="command" className="w-full max-w-4xl">
          <TabsList className="flex w-full mb-4 overflow-x-auto scrollbar-hide">
            <TabsTrigger
              value="command"
              className="flex-shrink-0 px-4 py-2 text-xs sm:text-sm md:text-base whitespace-nowrap"
            >
              Ingresar Comando
            </TabsTrigger>
            <TabsTrigger
              value="patterns"
              className="flex-shrink-0 px-4 py-2 text-xs sm:text-sm md:text-base whitespace-nowrap"
            >
              Patrones de Comandos
            </TabsTrigger>
            <TabsTrigger
              value="agenda"
              className="flex-shrink-0 px-4 py-2 text-xs sm:text-sm md:text-base whitespace-nowrap"
            >
              Mi Agenda
            </TabsTrigger>
          </TabsList>

          <TabsContent value="command">
            <CommandForm />
          </TabsContent>
          <TabsContent value="patterns">
            <CommandPatterns />
          </TabsContent>
          <TabsContent value="agenda">
            <EventsList />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
