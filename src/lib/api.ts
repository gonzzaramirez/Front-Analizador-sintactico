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
