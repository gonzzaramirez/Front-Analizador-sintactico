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
import { useState } from "react";
import { createAction } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Props del componente CommandForm
interface CommandFormProps {
  onActionCreated: () => void; // Callback que se ejecuta cuando se crea una acción
}

export function CommandForm({ onActionCreated }: CommandFormProps) {
  // Estados para manejar el comando y el estado de carga
  const [command, setCommand] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Ejemplos de comandos predefinidos para ayudar al usuario
  const examples = [
    {
      text: "agendá reunión con Juan el viernes a las 15hs",
      description: "Crea un evento para el próximo viernes",
    },
    {
      text: "recordame pagar la factura de luz mañana",
      description: "Crea un recordatorio para mañana",
    },
    {
      text: "agendá cena mañana",
      description: "Crea un evento para el próximo día",
    },
  ];

  // Manejador del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) {
      toast.error("Por favor ingresa un comando");
      return;
    }

    setIsLoading(true);
    try {
      // Verificar autenticación
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Debes iniciar sesión para crear acciones");
        router.push("/login");
        return;
      }

      // Crear la acción y manejar la respuesta
      await createAction(token, command);
      toast.success("La acción se ha creado correctamente");
      setCommand(""); // Limpiar el input
      onActionCreated(); // Actualizar el contador
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al crear la acción"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Manejador para cuando se hace clic en un ejemplo
  const handleExampleClick = (exampleText: string) => {
    setCommand(exampleText);
  };

  return (
    <Card className="w-full">
      {/* Encabezado del formulario */}
      <CardHeader>
        <CardTitle>Ingresa un comando</CardTitle>
        <CardDescription>
          Escribe un comando en lenguaje natural para crear un evento o
          recordatorio
        </CardDescription>
      </CardHeader>
      {/* Contenido del formulario */}
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Ej: Agendá reunión con Juan el viernes a las 15hs"
              className="flex-1"
              disabled={isLoading}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Analizando..." : "Analizar"}
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
      {/* Pie del formulario con ejemplos */}
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm whitespace-normal text-left h-auto py-2 px-3 min-w-[120px] max-w-[280px]"
                    onClick={() => handleExampleClick(example.text)}
                    disabled={isLoading}
                  >
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
