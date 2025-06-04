import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { Calendar, Clock } from "lucide-react";

export function CommandPatterns() {
  const patterns = [
    {
      type: "evento",
      pattern: "Agendá [evento] el [fecha] a las [hora]",
      example: "Agendá asado con Seba el viernes a las 15hs",
    },
    {
      type: "evento",
      pattern: "Anotá [evento] el [fecha]",
      example: "Anotá turno con el médico el 12 de mayo a las 9hs",
    },
    {
      type: "recordatorio",
      pattern: "Recordame [tarea] el [fecha]",
      example: "Recordame pagar la boleta de la luz mañana",
    },
    {
      type: "recordatorio",
      pattern: "El [fecha] tengo que [tarea]",
      example: "El lunes tengo que llevar el auto al taller",
    },
  ];

  const datePatterns = [
    { pattern: "mañana", example: "mañana" },
    { pattern: "hoy", example: "hoy" },
    { pattern: "pasado mañana", example: "pasado mañana" },
    { pattern: "[día de la semana]", example: "lunes, martes, etc." },
    { pattern: "[número] de [mes]", example: "12 de mayo" },
  ];

  const timePatterns = [
    { pattern: "a las [hora]hs", example: "a las 15hs" },
    { pattern: "a las [hora] [am/pm]", example: "a las 3 pm" },
    { pattern: "a las [hora]:[minutos]", example: "a las 15:30" },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patrones de Comandos Reconocidos</CardTitle>
          <CardDescription>
            El sistema puede interpretar estos comandos en lenguaje natural.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Patrón</TableHead>
                <TableHead>Ejemplo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patterns.map((p, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Badge
                      variant={p.type === "evento" ? "default" : "secondary"}
                      className="text-sm"
                    >
                      {p.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm whitespace-nowrap">
                    {p.pattern}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {p.example}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Patrones de Fecha
            </CardTitle>
            <CardDescription>Formatos válidos de fechas</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patrón</TableHead>
                  <TableHead>Ejemplo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datePatterns.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-sm">
                      {p.pattern}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.example}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Patrones de Hora
            </CardTitle>
            <CardDescription>Formatos válidos de hora</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patrón</TableHead>
                  <TableHead>Ejemplo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timePatterns.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-sm">
                      {p.pattern}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.example}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
