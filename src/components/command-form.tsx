"use client";
import { useState, useEffect } from "react";
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
import {
  Lightbulb,
  AlertCircle,
  Info,
  Loader2,
  CheckCircle2,
} from "lucide-react";
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [hint, setHint] = useState(
    "Empieza con 'agendá', 'anotá' o 'recordame'."
  );
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

  useEffect(() => {
    const errors: string[] = [];
    const cmd = command.trim();
    const low = cmd.toLowerCase();

    const verbMatch = /^(agendá|anotá|recordame)/i.test(low);
    const descMatch =
      /^(?:agendá|anotá|recordame)\s+([A-Za-zÁÉÍÓÚÑáéíóúñüÜ]+\s*)+/i.test(cmd);
    const dateMatch =
      /\b(?:hoy|mañana|lunes|martes|miércoles|jueves|viernes|sábado|domingo|\d{1,2}\s+de\s+\w+(\s+\d{4})?)\b/i.test(
        cmd
      );
    const timeMatch = /a las\s+(\d{1,2}):(\d{2})/.exec(cmd);

    if (!cmd) {
      setHint("Debe comenzar con 'agendá', 'anotá' o 'recordame'.");
      setValidationErrors(errors);
      return;
    }

    if (!verbMatch) {
      setHint("Verbo inválido. Usa 'agendá', 'anotá' o 'recordame'.");
    } else if (!descMatch) {
      setHint("Añade una descripción, p.ej. 'reunión con Juan'.");
    } else if (!dateMatch) {
      setHint("Indica una fecha: 'hoy', 'mañana', 'viernes' o '12 de mayo'.");
    } else if (!timeMatch) {
      setHint("Agrega una hora: 'a las HH:MM', ej. 'a las 15:00'.");
    } else {
      setHint("");
    }

    // Validar descripción sin tokens de fecha/hora
    const descOnly = cmd
      .replace(/^(agendá|anotá|recordame)/i, "")
      .replace(
        /\b(?:hoy|mañana|lunes|martes|miércoles|jueves|viernes|sábado|domingo|\d{1,2}\s+de\s+\w+(\s+\d{4})?)\b/gi,
        ""
      )
      .replace(/a las\s+\d{1,2}:\d{2}/i, "")
      .trim();

    if (/[^\sa-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(descOnly)) {
      errors.push("La descripción solo puede tener letras y espacios.");
    }

    if (timeMatch) {
      const [_, h, m] = timeMatch.map(Number);
      if (h > 23 || m > 59) errors.push("Hora fuera de rango");
      if (m < 10 && timeMatch[2].length === 1) {
        errors.push("Minutos deben tener 2 dígitos");
      }
    }

    const validMonths = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    const monthMatch = cmd.match(/\d{1,2}\s+de\s+(\w+)/i);
    if (monthMatch && !validMonths.includes(monthMatch[1].toLowerCase())) {
      errors.push("Mes inválido");
    }

    const fullPattern = new RegExp(
      `^(agendá|anotá|recordame)\\s+([A-Za-zÁÉÍÓÚÑáéíóúñüÜ]+\\s+)*` +
        `((hoy|mañana|lunes|martes|miércoles|jueves|viernes|sábado|domingo|\\d{1,2}\\s+de\\s+(${validMonths.join(
          "|"
        )})(\\s+\\d{4})?)?)` +
        `(\\s+a las\\s+(?:[01]?\\d|2[0-3]):[0-5]\\d)?$`,
      "i"
    );

    if (!fullPattern.test(cmd)) errors.push("Formato inválido según gramática");
    if (cmd.length < 5) errors.push("Muy corto: añade más detalles");
    if (cmd.length > 200) errors.push("Muy largo: reduce la descripción");

    setValidationErrors(errors);
  }, [command]);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (validationErrors.length) {
      toast.error("Corrige los errores antes de continuar");
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

  const getValidationSteps = () => {
    const cmd = command.trim();
    const low = cmd.toLowerCase();
    return [
      {
        text: "Verbo válido",
        completed: /^(agendá|anotá|recordame)/i.test(low),
        icon: CheckCircle2,
      },
      {
        text: "Descripción válida",
        completed:
          /^(?:agendá|anotá|recordame)\s+([A-Za-zÁÉÍÓÚÑáéíóúñüÜ]+\s*)+/i.test(
            cmd
          ),
        icon: CheckCircle2,
      },
      {
        text: "Fecha válida",
        completed:
          /\b(?:hoy|mañana|lunes|martes|miércoles|jueves|viernes|sábado|domingo|\d{1,2}\s+de\s+\w+(\s+\d{4})?)\b/i.test(
            cmd
          ),
        icon: CheckCircle2,
      },
      {
        text: "Hora válida",
        completed: /a las\s+(?:[01]?\d|2[0-3]):[0-5]\d/.test(cmd),
        icon: CheckCircle2,
      },
    ];
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
                    <Button
                      type="submit"
                      disabled={isLoading || !!validationErrors.length}
                    >
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
                    <p>Usa la gramática sugerida</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-3">
              {command.trim() && (
                <div className="grid grid-cols-2 gap-2 p-3  rounded-lg border border-blue-100 dark:border-blue-900">
                  {getValidationSteps().map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 text-sm ${
                        step.completed
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      <step.icon className="h-4 w-4" />
                      <span>{step.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {hint && (
                <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/20 p-2 rounded-md">
                  <Info className="h-4 w-4" />
                  <p>{hint}</p>
                </div>
              )}

              {validationErrors.length > 0 && (
                <div className="flex items-start space-x-2 text-red-600 bg-red-100 dark:bg-red-900/10 p-2 rounded-md">
                  <AlertCircle className="mt-1 h-4 w-4" />
                  <div className="space-y-1">
                    {validationErrors.map((e, i) => (
                      <p key={i} className="text-sm">
                        {e}
                      </p>
                    ))}
                  </div>
                </div>
              )}
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
          onSave={handleSave}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
