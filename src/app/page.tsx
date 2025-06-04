"use client";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserGuide } from "@/components/userGuide";
import { CommandForm } from "@/components/command-form";
import { useState } from "react";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CommandPatterns } from "@/components/command-patterns";
import { EventsList } from "@/components/event-list";
export default function Home() {
  const [showGuide, setShowGuide] = useState(true);
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center space-y-8 w-full">
        <div className="text-center space-y-2 w-full">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Asistente de Agenda
            </h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
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
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="command">Ingresar Comando</TabsTrigger>
            <TabsTrigger value="patterns">Patrones de Comandos</TabsTrigger>
            <TabsTrigger value="agenda">Mi Agenda</TabsTrigger>
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
