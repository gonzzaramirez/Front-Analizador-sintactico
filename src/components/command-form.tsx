"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAction } from "@/lib/api";
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
import { Lightbulb, Info, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { CommandAnalysis } from "./command-analysis";

interface CommandFormProps {
  onActionCreated: () => void;
}

export function CommandForm({ onActionCreated }: CommandFormProps) {
  const [command, setCommand] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const examples = [
    {
      text: "agendá reunión con Juan el viernes a las 15:00",
      description: "Evento viernes 15:00",
    },
    {
      text: "recordame pagar la factura mañana a las 10:00",
      description: "Recordatorio mañana 10:00",
    },
    {
      text: "anotá cena mañana a las 20:00",
      description: "Evento mañana 20:00",
    },
  ];

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) {
      toast.error("Ingresa un comando");
      return;
    }
    setIsAnalyzing(true);
  };

  const handleSave = async () => {
    if (!command.trim()) {
      toast.error("Ingresa un comando");
      return;
    }
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Inicia sesión primero");
      router.push("/login");
      return;
    }
    try {
      await createAction(token, command.trim());
      toast.success("¡Acción creada con éxito!");
      setCommand("");
      setIsAnalyzing(false);
      onActionCreated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ingresa un comando</CardTitle>
          <CardDescription className="text-muted-foreground/80">
            <div className="flex items-center space-x-1 text-sm">
              <Info className="h-4 w-4" />
              <span>
                Formato: <strong>verbo</strong> + descripción + [fecha] + [hora]
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Ej: agendá reunión con X mañana a las 10:00"
                disabled={isLoading}
                className="flex-1 border-primary/30 focus:ring-primary/40"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analizando...
                        </>
                      ) : (
                        "Analizar"
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Analiza el comando antes de guardar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/20 p-3 rounded-md">
                <Info className="h-4 w-4" />
                <div>
                  <p className="font-medium mb-1">
                    Recomendaciones de formato:
                  </p>
                  <ul className="text-xs space-y-1">
                    <li>
                      • <strong>Verbos:</strong> agendá, anotá, recordame
                    </li>
                    <li>
                      • <strong>Fechas:</strong> hoy, mañana, lunes, 15 de mayo
                    </li>
                    <li>
                      • <strong>Horas:</strong> a las 15:00, a las 9:30
                    </li>
                    <li>
                      • <strong>Ejemplo:</strong> "agendá reunión con Juan
                      mañana a las 10:00"
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col items-start">
          <div className="flex items-center mb-2 text-sm text-muted-foreground">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
            Prueba estos ejemplos:
          </div>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex, i) => (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => setCommand(ex.text)}
                    >
                      {ex.text}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{ex.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </CardFooter>
      </Card>

      {isAnalyzing && (
        <CommandAnalysis
          command={command}
          isLoading={isLoading}
          onActionCreated={onActionCreated}
          onClearForm={() => {
            setCommand("");
            setIsAnalyzing(false);
          }}
        />
      )}
    </div>
  );
}
