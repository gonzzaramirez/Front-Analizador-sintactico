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
      pattern: "Agendá [evento] [fecha] a las [hora]",
      example: "Agendá reunión importante martes a las 14:00",
    },
    {
      type: "evento",
      pattern: "Anotá [evento] [fecha] a las [hora]",
      example: "Anotá cena con amigos 15 de marzo 2024 a las 21:00",
    },
    {
      type: "recordatorio",
      pattern: "Recordame [tarea] [fecha]",
      example: "Recordame reunión lunes",
    },
    {
      type: "recordatorio",
      pattern: "Recordame [tarea] [fecha] a las [hora]",
      example: "Recordame sacar la basura  lunes a las 15:00",
    },
  ];

  const datePatterns = [
    { pattern: "mañana", example: "mañana" },
    { pattern: "hoy", example: "hoy" },
    { pattern: "[día de la semana]", example: "lunes, martes, etc." },
    { pattern: "[número] de [mes]", example: "12 de mayo" },
    { pattern: "[número] de [mes] [año]", example: "15 de marzo 2024" },
  ];

  const timePatterns = [
    { pattern: "a las [hora]:[minutos]", example: "a las 15:30" },
    { pattern: "a las [hora]hs", example: "a las 15hs" },
    { pattern: "a las [hora] [am/pm]", example: "a las 3 pm" },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto space-y-6 ">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
