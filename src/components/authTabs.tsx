"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser, registerUser } from "@/lib/api";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthTabsProps {
  onLogin: (token: string) => void;
}

export default function AuthTabs({ onLogin }: AuthTabsProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const schema = z.object({
    username: z
      .string()
      .min(3, "El usuario debe tener al menos 3 caracteres")
      .max(20, "El usuario no puede tener más de 20 caracteres"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(32, "La contraseña no puede tener más de 32 caracteres"),
  });

  const handleTabChange = (value: string) => {
    setTab(value as "login" | "register");
    setError("");
    setFieldErrors({});
    setUsername("");
    setPassword("");
  };

  const handleInputChange =
    (setter: (val: string) => void, field: "username" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setError("");
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleSubmit = async (
    action: "login" | "register",
    callback: () => Promise<void>
  ) => {
    setError("");
    setFieldErrors({});
    const result = schema.safeParse({ username, password });
    if (!result.success) {
      const errors: { username?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "username") errors.username = err.message;
        if (err.path[0] === "password") errors.password = err.message;
      });
      setFieldErrors(errors);
      return;
    }
    setLoading(true);
    try {
      await callback();
    } catch (err: any) {
      if (action === "login") {
        toast.error("Credenciales inválidas");
      } else {
        toast.error(err.message || "Error al registrarse");
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    const { token } = await loginUser(username, password);
    localStorage.setItem("token", token);
    onLogin(token);
  };

  const register = async () => {
    await registerUser(username, password);
    toast.success("Usuario creado correctamente.");
    setTab("login");
  };

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Autenticación</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-full flex justify-center mb-4">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit("login", login);
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <Label htmlFor="login-user">Usuario</Label>
                <Input
                  id="login-user"
                  type="text"
                  value={username}
                  onChange={handleInputChange(setUsername, "username")}
                  disabled={loading}
                />
                {fieldErrors.username && (
                  <p className="text-sm text-red-500">{fieldErrors.username}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="login-pass">Contraseña</Label>
                <Input
                  id="login-pass"
                  type="password"
                  value={password}
                  onChange={handleInputChange(setPassword, "password")}
                  disabled={loading}
                />
                {fieldErrors.password && (
                  <p className="text-sm text-red-500">{fieldErrors.password}</p>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit("register", register);
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <Label htmlFor="reg-user">Usuario</Label>
                <Input
                  id="reg-user"
                  type="text"
                  value={username}
                  onChange={handleInputChange(setUsername, "username")}
                  disabled={loading}
                />
                {fieldErrors.username && (
                  <p className="text-sm text-red-500">{fieldErrors.username}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="reg-pass">Contraseña</Label>
                <Input
                  id="reg-pass"
                  type="password"
                  value={password}
                  onChange={handleInputChange(setPassword, "password")}
                  disabled={loading}
                />
                {fieldErrors.password && (
                  <p className="text-sm text-red-500">{fieldErrors.password}</p>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Registrando..." : "Registrarse"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
