"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  // Función que realmente cambia el tema
  const switchTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // En el click, primero verificamos si existe la API de view transitions
  const handleClick = () => {
    if (!document.startViewTransition) {
      // Si no está disponible, cambiamos directamente sin animación
      switchTheme();
    } else {
      // Con animación de View Transition
      document.startViewTransition(() => {
        switchTheme();
      });
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      size="icon"
      className={cn(
        "transition-all duration-300",
        "bg-muted/70 hover:bg-muted",
        "text-foreground border border-border shadow",
        "backdrop-blur-md",
        "cursor-pointer"
      )}
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-blue-500" />
      )}
      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}
