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
import { getUserActions } from "@/lib/api";

export default function Home() {
  // Estados para manejar la autenticación y la interfaz
  const [token, setToken] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  const [eventCount, setEventCount] = useState(0);

  // Función para cargar el contador inicial de eventos
  const loadInitialEventCount = async (token: string) => {
    try {
      const data = await getUserActions(token, 1, 5);
      setEventCount(data.length);
    } catch (error) {
      console.error("Error al cargar el contador de eventos:", error);
    }
  };

  // Función para actualizar el contador de eventos
  const updateEventCount = async () => {
    const t = localStorage.getItem("token");
    if (t) {
      await loadInitialEventCount(t);
    }
  };

  // Efecto para cargar el token y el contador de eventos al iniciar
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      setToken(t);
      loadInitialEventCount(t);
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // Renderizado condicional: Si no hay token, muestra el formulario de autenticación
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center w-full">
        <div className="w-full max-w-sm px-4">
          <h1 className="text-2xl font-bold text-center mb-4">Autenticación</h1>
          <AuthTabs
            onLogin={async (t) => {
              setToken(t);
              await loadInitialEventCount(t);
            }}
          />
        </div>
      </div>
    );
  }

  // Renderizado principal de la aplicación cuando el usuario está autenticado
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      {/* Header con controles de modo y logout */}
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
        {/* Título y botón de ayuda */}
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

        {/* Muestra la guía de usuario si está activa */}
        {showGuide && <UserGuide />}

        {/* Sistema de pestañas principal */}
        <Tabs defaultValue="command" className="w-full max-w-4xl">
          <TabsList className="flex w-full mb-4 overflow-x-auto scrollbar-hide">
            {/* Pestaña para ingresar comandos */}
            <TabsTrigger
              value="command"
              className="flex-shrink-0 px-4 py-2 text-xs sm:text-sm md:text-base whitespace-nowrap"
            >
              Ingresar Comando
            </TabsTrigger>
            {/* Pestaña para ver patrones de comandos */}
            <TabsTrigger
              value="patterns"
              className="flex-shrink-0 px-4 py-2 text-xs sm:text-sm md:text-base whitespace-nowrap"
            >
              Patrones de Comandos
            </TabsTrigger>
            {/* Pestaña para ver la agenda con contador de eventos */}
            <TabsTrigger
              value="agenda"
              className="flex-shrink-0 px-4 py-2 text-xs sm:text-sm md:text-base whitespace-nowrap"
            >
              Mi Agenda {eventCount > 0 && `(${eventCount})`}
            </TabsTrigger>
          </TabsList>

          {/* Contenido de las pestañas */}
          <TabsContent value="command">
            <CommandForm onActionCreated={updateEventCount} />
          </TabsContent>
          <TabsContent value="patterns">
            <CommandPatterns />
          </TabsContent>
          <TabsContent value="agenda">
            <EventsList onEventCountChange={setEventCount} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
