import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText } from "lucide-react";

interface CommandAnalysisProps {
  command: string;
  onSave: () => void;
  isLoading: boolean;
}

export function CommandAnalysis({
  command,
  onSave,
  isLoading,
}: CommandAnalysisProps) {
  const cmd = command.trim().toLowerCase();

  const getActionType = () => {
    if (cmd.startsWith("agendá") || cmd.startsWith("anotá")) return "Evento";
    if (cmd.startsWith("recordame")) return "Recordatorio";
    return "Desconocido";
  };

  const extractDate = () => {
    // busca 'hoy', 'mañana', día de la semana o fecha DD de mes YYYY
    const relative = cmd.match(/\b(hoy|mañana)\b/);
    if (relative) return relative[1];

    const week = cmd.match(
      /\b(lunes|martes|miércoles|jueves|viernes|sábado|domingo)\b/
    );
    if (week) return week[1];

    const specific = cmd.match(/(\d{1,2}\s+de\s+[a-záéíóúñü]+(?:\s+\d{4})?)/i);
    if (specific) return specific[1];

    return "No especificada";
  };

  const extractTime = () => {
    const timeMatch = cmd.match(/a las\s+([01]?\d|2[0-3]):([0-5]\d)/);
    return timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : "No especificada";
  };

  const extractDescription = () => {
    // elimina verbo, fecha y hora
    let desc = command.replace(/^(agendá|anotá|recordame)\s+/i, "");
    desc = desc.replace(
      /\b(hoy|mañana|lunes|martes|miércoles|jueves|viernes|sábado|domingo)\b/i,
      ""
    );
    desc = desc.replace(/\d{1,2}\s+de\s+[a-záéíóúñü]+(?:\s+\d{4})?/i, "");
    desc = desc.replace(/a las\s+[01]?\d:[0-5]\d/i, "");
    return desc.trim() || "No especificada";
  };

  const actionType = getActionType();
  const date = extractDate();
  const time = extractTime();
  const description = extractDescription();

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Análisis del Comando</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium">Tipo</p>
            <p className="text-sm text-muted-foreground">{actionType}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-purple-500" />
          <div>
            <p className="text-sm font-medium">Fecha</p>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm font-medium">Hora</p>
            <p className="text-sm text-muted-foreground">{time}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium">Descripción</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={isLoading} className="w-full">
          {isLoading ? "Guardando..." : "Guardar Acción"}
        </Button>
      </CardFooter>
    </Card>
  );
}
