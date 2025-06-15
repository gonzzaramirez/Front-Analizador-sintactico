"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CalendarX2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserActions, deleteAction } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Interfaz para definir la estructura de una acción
interface Action {
  id: number;
  user_name: string;
  description: string;
  date: string;
}

// Props del componente EventsList
interface EventsListProps {
  onEventCountChange: (count: number) => void; // Callback para actualizar el contador de eventos
}

export function EventsList({ onEventCountChange }: EventsListProps) {
  // Estados para manejar la lista de acciones y la paginación
  const [actions, setActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Número de eventos por página
  const router = useRouter();

  // Función para cargar las acciones del usuario
  const fetchActions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const data = await getUserActions(token, currentPage, pageSize);
      setActions(data);
      onEventCountChange(data.length);
    } catch (error) {
      toast.error("Error al cargar las acciones");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para eliminar una acción
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await deleteAction(token, id);
      toast.success("Acción eliminada correctamente");
      fetchActions(); // Recargar la lista
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al eliminar la acción"
      );
    }
  };

  // Efecto para cargar las acciones cuando cambia la página
  useEffect(() => {
    fetchActions();
  }, [currentPage]);

  // Estado de carga
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-10">
          <p className="text-muted-foreground">Cargando...</p>
        </CardContent>
      </Card>
    );
  }

  // Estado cuando no hay acciones
  if (actions.length === 0) {
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
            Ingresa un comando en la pestaña Ingresar Comando para crear tu
            primer evento
          </p>
        </CardContent>
      </Card>
    );
  }

  // Renderizado principal de la lista de acciones
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tu agenda</CardTitle>
        <CardDescription>
          {actions.length} eventos y recordatorios
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Lista de acciones */}
        <div className="space-y-4">
          {actions.map((action) => (
            <div
              key={action.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">{action.description}</p>
                <p className="text-sm text-muted-foreground">
                  {format(
                    new Date(action.date),
                    "EEEE d 'de' MMMM 'a las' HH:mm",
                    {
                      locale: es,
                    }
                  )}
                </p>
              </div>
              {/* Botón para eliminar acción */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(action.id)}
                className="text-destructive hover:text-destructive/90"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        {/* Controles de paginación */}
        <div className="flex justify-center mt-6 space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={actions.length < pageSize}
          >
            Siguiente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
