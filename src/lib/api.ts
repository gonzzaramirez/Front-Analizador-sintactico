const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function loginUser(user_name: string, password: string) {
  // Hace una petición POST al endpoint de login
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name, password }), // Convierte los datos a JSON
  });
  // Si la respuesta no es exitosa
  if (!res.ok) {
    // Si el código es 401, credenciales inválidas
    if (res.status === 401) {
      throw new Error("Credenciales incorrectas");
    }
    // Para otros errores
    throw new Error((await res.text()) || "Error en inicio de sesión");
  }
  // Si todo sale bien, retorna el token de la respuesta
  return (await res.json()) as { token: string };
}

// Función asíncrona para registrar un nuevo usuario
export async function registerUser(user_name: string, password: string) {
  // Hace una petición POST al endpoint de registro
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name, password }), // Convierte los datos a JSON
  });
  // Si la respuesta no es exitosa, lanza un error
  if (!res.ok) throw new Error((await res.text()) || "Error en registro");
}

// Interfaz para la respuesta de acciones
interface Action {
  id: number;
  user_name: string;
  description: string;
  type: string; // "evento" o "recordatorio"
  date: string;
}

// Función para crear una nueva acción
export async function createAction(token: string, command: string) {
  const res = await fetch(`${API_BASE}/actions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ comand: command }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    if (res.status === 400) {
      throw new Error(errorText || "Error en el formato del comando");
    }
    if (res.status === 500) {
      throw new Error(errorText || "Error al procesar la acción");
    }
    throw new Error(errorText || "Error al crear la acción");
  }
}

// Función para obtener las acciones del usuario
export async function getUserActions(
  token: string,
  page: number = 1,
  pageSize: number = 10
): Promise<Action[]> {
  const res = await fetch(
    `${API_BASE}/actions?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Token inválido o expirado");
    }
    throw new Error("Error al obtener las acciones");
  }

  return await res.json();
}

// Función para eliminar una acción
export async function deleteAction(token: string, actionId: number) {
  const res = await fetch(`${API_BASE}/actions/${actionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    if (res.status === 400) {
      throw new Error("ID de acción inválido");
    }
    if (res.status === 403) {
      throw new Error("No tienes permiso para eliminar esta acción");
    }
    if (res.status === 500) {
      throw new Error(errorText || "Error al eliminar la acción");
    }
    throw new Error(errorText || "Error al eliminar la acción");
  }
}

// Interfaz para la respuesta de análisis
interface AnalyzeResponse {
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

// Función para analizar un comando sin guardarlo
export async function analyzeCommand(
  command: string
): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ command: command }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al analizar el comando");
  }

  return await res.json();
}
