"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Trash2, CalendarX2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import type { Event } from "@/lib/types"

// interface EventsListProps {
//   events: Event[]
//   onDelete: (id: string) => void
// }

export function EventsList() {
  // const formatDate = (dateStr: string | null) => {
  //   if (!dateStr) return "No especificada"
  //   const date = new Date(dateStr)
  //   return date.toLocaleDateString("es-ES", {
  //     weekday: "long",
  //     day: "numeric",
  //     month: "long",
  //   })
  // }

  // const sortedEvents = [...events].sort((a, b) => {
  //   if (!a.fecha) return 1
  //   if (!b.fecha) return -1
  //   return new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  // })

  // if (events.length === 0) {
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
          Ingresa un comando en la pestaña "Ingresar Comando" para crear tu
          primer evento
        </p>
      </CardContent>
    </Card>
  );
  // }

  // return (
  //   <Card className="w-full">
  //     <CardHeader>
  //       <CardTitle>Tu agenda ({events.length})</CardTitle>
  //       <CardDescription>Todos tus eventos y recordatorios guardados</CardDescription>
  //     </CardHeader>
  //     <CardContent>
  //       <div className="space-y-4">
  //         {sortedEvents.map((event) => (
  //           <div key={event.id} className="flex items-start justify-between p-4 border rounded-lg">
  //             <div className="space-y-2">
  //               <div className="flex items-center space-x-2">
  //                 <TooltipProvider>
  //                   <Tooltip>
  //                     <TooltipTrigger asChild>
  //                       <Badge variant={event.intencion === "evento" ? "default" : "secondary"}>
  //                         {event.intencion === "evento" ? "Evento" : "Recordatorio"}
  //                       </Badge>
  //                     </TooltipTrigger>
  //                     <TooltipContent>
  //                       <p>
  //                         {event.intencion === "evento"
  //                           ? "Un evento programado en tu agenda"
  //                           : "Un recordatorio para una tarea"}
  //                       </p>
  //                     </TooltipContent>
  //                   </Tooltip>
  //                 </TooltipProvider>
  //                 <h3 className="font-medium">{event.descripcion}</h3>
  //               </div>
  //               <div className="flex items-center text-sm text-muted-foreground space-x-4">
  //                 <div className="flex items-center">
  //                   <Calendar className="mr-1 h-4 w-4" />
  //                   <span>{formatDate(event.fecha)}</span>
  //                 </div>
  //                 {event.hora && (
  //                   <div className="flex items-center">
  //                     <Clock className="mr-1 h-4 w-4" />
  //                     <span>{event.hora}</span>
  //                   </div>
  //                 )}
  //               </div>
  //             </div>
  //             <TooltipProvider>
  //               <Tooltip>
  //                 <TooltipTrigger asChild>
  //                   <Button
  //                     variant="ghost"
  //                     size="icon"
  //                     onClick={() => onDelete(event.id)}
  //                     className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
  //                   >
  //                     <Trash2 className="h-4 w-4" />
  //                   </Button>
  //                 </TooltipTrigger>
  //                 <TooltipContent>
  //                   <p>Eliminar este evento</p>
  //                 </TooltipContent>
  //               </Tooltip>
  //             </TooltipProvider>
  //           </div>
  //         ))}
  //       </div>
  //     </CardContent>
  //   </Card>
  // )
}
