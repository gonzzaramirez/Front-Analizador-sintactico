"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CalendarX2 } from "lucide-react";

export function EventsList() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tu agenda</CardTitle>
        <CardDescription>
          Aún no tienes eventos o recordatorios guardados
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <CalendarX2 className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          Ingresa un comando en la pestaña &quot;Ingresar Comando&quot; para
          crear tu primer evento
        </p>
      </CardContent>
    </Card>
  );
}
