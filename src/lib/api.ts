const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function loginUser(user_name: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name, password }),
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Credenciales incorrectas");
    }
    throw new Error((await res.text()) || "Error en inicio de sesión");
  }
  return (await res.json()) as { token: string };
}

export async function registerUser(user_name: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name, password }),
  });
  if (!res.ok) throw new Error((await res.text()) || "Error en registro");
}
