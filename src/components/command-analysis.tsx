"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAction, analyzeCommand } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  TreePine,
  AlertCircle,
  CheckCircle,
  Save,
} from "lucide-react";
import Tree from "react-d3-tree";

interface CommandAnalysisProps {
  command: string;
  onSave?: () => void;
  isLoading: boolean;
  onActionCreated?: () => void;
  onClearForm?: () => void;
}

interface AnalysisResult {
  success: boolean;
  ast?: any;
  error?: {
    type: string;
    message: string;
    position: number;
  };
  analysis?: {
    command: string;
    verb: string;
    words: string[];
    date: string;
    time: string;
    description: string;
  };
}

//colores del arbol de comandos
const NODE_COLORS: Record<
  string,
  {
    bg: string;
    border: string;
    text: string;
    darkBg: string;
    darkBorder: string;
    darkText: string;
  }
> = {
  COMANDO: {
    bg: "bg-blue-100",
    border: "border-blue-300",
    text: "text-blue-800",
    darkBg: "dark:bg-blue-900/30",
    darkBorder: "dark:border-blue-600",
    darkText: "dark:text-blue-200",
  },
  VERBO: {
    bg: "bg-yellow-100",
    border: "border-yellow-300",
    text: "text-yellow-800",
    darkBg: "dark:bg-yellow-900/30",
    darkBorder: "dark:border-yellow-600",
    darkText: "dark:text-yellow-200",
  },
  PALABRAS: {
    bg: "bg-gray-100",
    border: "border-gray-300",
    text: "text-gray-800",
    darkBg: "dark:bg-gray-800/50",
    darkBorder: "dark:border-gray-600",
    darkText: "dark:text-gray-200",
  },
  TIEMPO: {
    bg: "bg-purple-100",
    border: "border-purple-300",
    text: "text-purple-800",
    darkBg: "dark:bg-purple-900/30",
    darkBorder: "dark:border-purple-600",
    darkText: "dark:text-purple-200",
  },
  FECHA: {
    bg: "bg-green-100",
    border: "border-green-300",
    text: "text-green-800",
    darkBg: "dark:bg-green-900/30",
    darkBorder: "dark:border-green-600",
    darkText: "dark:text-green-200",
  },
  HORA: {
    bg: "bg-red-100",
    border: "border-red-300",
    text: "text-red-800",
    darkBg: "dark:bg-red-900/30",
    darkBorder: "dark:border-red-600",
    darkText: "dark:text-red-200",
  },
  default: {
    bg: "bg-slate-100",
    border: "border-slate-300",
    text: "text-slate-800",
    darkBg: "dark:bg-slate-800/50",
    darkBorder: "dark:border-slate-600",
    darkText: "dark:text-slate-200",
  },
};

export function CommandAnalysis({
  command,
  isLoading,
  onActionCreated,
  onClearForm,
}: CommandAnalysisProps) {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const performAnalysis = async () => {
      if (!command.trim()) {
        setAnalysisResult({
          success: false,
          error: {
            type: "EMPTY_COMMAND",
            message: "No se proporcionó ningún comando",
            position: 0,
          },
        });
        setIsAnalyzing(false);
        return;
      }

      try {
        const result = await analyzeCommand(command.trim());
        setAnalysisResult(result);
      } catch (error) {
        setAnalysisResult({
          success: false,
          error: {
            type: "NETWORK_ERROR",
            message:
              error instanceof Error ? error.message : "Error de conexión",
            position: 0,
          },
        });
      } finally {
        setIsAnalyzing(false);
      }
    };

    performAnalysis();
  }, [command]);

  const handleSave = async () => {
    if (!command.trim()) {
      toast.error("Ingresa un comando");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Inicia sesión primero");
      router.push("/login");
      return;
    }

    try {
      await createAction(token, command.trim());
      toast.success("¡Acción creada con éxito!");
      onActionCreated?.();
      onClearForm?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    }
  };

  const renderCustomNode = ({ nodeDatum }: any) => {
    const type = nodeDatum.name || "default";
    const colors = NODE_COLORS[type] || NODE_COLORS.default;

    // Obtener el valor del nodo
    const value = nodeDatum.attributes?.value;
    const displayValue = Array.isArray(value)
      ? value.join(" ")
      : String(value || "");

    // Calcular el ancho basado en el contenido
    const textLength = Math.max(
      nodeDatum.name?.length || 0,
      displayValue.length
    );
    const width = Math.max(120, Math.min(300, textLength * 8));
    const height = displayValue ? 80 : 50;

    return (
      <foreignObject
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        className="overflow-visible"
      >
        <div
          className={`h-full rounded-xl border-2 shadow-lg backdrop-blur-sm ${colors.bg} ${colors.border} ${colors.text} ${colors.darkBg} ${colors.darkBorder} ${colors.darkText} transition-all duration-200 hover:scale-105`}
        >
          <div className="flex flex-col items-center justify-center h-full p-2 text-center">
            <div className="font-bold text-sm uppercase tracking-wide mb-1">
              {nodeDatum.name}
            </div>
            {displayValue && (
              <div className="text-xs font-medium leading-tight px-1 break-words">
                {displayValue}
              </div>
            )}
          </div>
        </div>
      </foreignObject>
    );
  };

  if (isAnalyzing) {
    return (
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Analizando comando...</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Procesando: "{command}"
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult) {
    return null;
  }

  if (!analysisResult.success) {
    return (
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>Error de Análisis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Comando: "{command}"</p>
                <p>{analysisResult.error?.message}</p>
                {analysisResult.error?.type === "SYNTAX_ERROR" && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                    <p className="text-sm font-medium mb-2">Sugerencias:</p>
                    <ul className="text-sm space-y-1">
                      <li>
                        • Verifica que el verbo sea: agendá, anotá, o recordame
                      </li>
                      <li>
                        • Asegúrate de incluir una descripción después del verbo
                      </li>
                      <li>
                        • Para fechas usa: hoy, mañana, días de la semana, o "15
                        de marzo 2024"
                      </li>
                      <li>• Para horas usa: "a las 15:30" (formato 24h)</li>
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          <span>Análisis Exitoso</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <TreePine className="h-4 w-4" />
            <h3 className="font-medium">Árbol de Comandos</h3>
          </div>
          <div className="h-[420px] w-full flex items-center justify-center overflow-auto">
            <Tree
              data={analysisResult.ast}
              orientation="vertical"
              nodeSize={{ x: 160, y: 120 }}
              separation={{ siblings: 1.5, nonSiblings: 2 }}
              translate={{ x: 350, y: 100 }}
              renderCustomNodeElement={renderCustomNode}
              pathClassFunc={() => "stroke-gray-600 dark:stroke-white stroke-2"}
              zoom={1}
              enableLegacyTransitions={true}
              transitionDuration={350}
              collapsible={true}
              shouldCollapseNeighborNodes={true}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Acción
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
