"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CommandForm() {
  const examples = [
    {
      text: "Agendá reunión con Juan el viernes a las 15hs",
      description: "Crea un evento para el próximo viernes",
    },
    {
      text: "Recordame pagar la factura de luz mañana",
      description: "Crea un recordatorio para mañana",
    },
    {
      text: "El lunes tengo que llevar el auto al mecánico",
      description: "Crea un recordatorio para el próximo lunes",
    },
    {
      text: "Anotá cita médica el 12 de mayo a las 9hs",
      description: "Crea un evento para una fecha específica",
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ingresa un comando</CardTitle>
        <CardDescription>
          Escribe un comando en lenguaje natural para crear un evento o
          recordatorio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Ej: Agendá reunión con Juan el viernes a las 15hs"
              className="flex-1"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" className="">
                    Analizar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Analiza el comando y extrae la información</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col items-start">
        <div className="flex items-center mb-2">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
          <p className="text-sm text-muted-foreground">
            Prueba estos ejemplos:
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    {example.text.length > 30
                      ? example.text.substring(0, 30) + "..."
                      : example.text}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{example.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
