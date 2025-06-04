"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarClock, MessageSquareText, Save, List } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import * as React from "react";

export function UserGuide() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Card
      className={cn(
        "w-full max-w-4xl",
        isDark
          ? "bg-neutral-900 border-neutral-700"
          : "bg-blue-50 border-blue-200"
      )}
    >
      <CardHeader>
        <CardTitle
          className={cn(
            "font-bold",
            isDark ? "text-blue-400" : "text-blue-700"
          )}
        >
          Guía de Uso
        </CardTitle>
        <CardDescription className={cn(isDark && "text-neutral-300")}>
          Aprende a usar el asistente de agenda con comandos en lenguaje natural
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {[
          {
            icon: <MessageSquareText />,
            title: "Paso 1: Escribe un comando",
            desc: `Escribe un comando como "Agendá reunión con Juan el viernes a las 15hs"`,
          },
          {
            icon: <CalendarClock />,
            title: "Paso 2: Analiza el comando",
            desc: `Haz clic en "Analizar" para que el sistema extraiga la información del evento.`,
          },
          {
            icon: <Save />,
            title: "Paso 3: Guarda en tu agenda",
            desc: `Revisa y guarda el evento haciendo clic en "Guardar en agenda".`,
          },
          {
            icon: <List />,
            title: "Paso 4: Gestiona tu agenda",
            desc: `Visualiza y gestiona tus eventos desde la pestaña "Mi Agenda".`,
          },
        ].map((step, i) => (
          <Alert
            key={i}
            className={cn(
              "flex gap-2 items-start",
              isDark
                ? "bg-neutral-800 border-neutral-700"
                : "bg-white border-blue-100"
            )}
          >
            {React.cloneElement(step.icon, {
              className: cn("mt-1", isDark ? "text-blue-400" : "text-blue-700"),
            })}
            <div>
              <AlertTitle
                className={cn(isDark ? "text-blue-400" : "text-blue-700")}
              >
                {step.title}
              </AlertTitle>
              <AlertDescription className={cn(isDark && "text-neutral-300")}>
                {step.desc}
              </AlertDescription>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
}
