# 🗂️ Analizador Sintáctico de Agenda en Español (Frontend)

Frontend del proyecto de analizador sintáctico de una agenda, para la materia de Teoría de Computación de la Licenciatura en Sistemas de Información de la UNNE.

## 🚀 Stack

- ⚛️ **Next.js** – Framework React
- 🎨 **ShadCN/UI** – Componentes accesibles y personalizables
- 🧩 **TweakCN** – Editor visual de diseño
- 💨 **Tailwind CSS** – Utilidades CSS
- 🧠 **TypeScript** – Tipado fuerte para JavaScript

## ⚙️ Instalación

Cloná el repo y ejecutá:

```bash
git clone <tu-repo-frontend>
cd <tu-repo-frontend>
npm install
npm run dev
```

Asegurate de definir la variable de entorno para la API en un archivo `.env.local` en la raíz del proyecto:

```ini
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🔌 Comunicación con el Backend en Go

El frontend consume los endpoints del backend desarrollado en Go, disponible en el repositorio:

[https://github.com/RodrigoGonzalez78/go_analyzer](https://github.com/RodrigoGonzalez78/go_analyzer)

### Endpoints Principales

| Ruta             | Método | Descripción                                             |
| ---------------- | ------ | ------------------------------------------------------- |
| `/auth/login`    | POST   | Autentica al usuario y devuelve un JWT                  |
| `/auth/register` | POST   | Registra un nuevo usuario                               |
| `/actions`       | POST   | Crea una nueva acción (requiere JWT en Authorization)   |
| `/actions`       | GET    | Lista las acciones del usuario (paginado, requiere JWT) |

> **Nota:** Todas las rutas protegidas deben incluir el encabezado:
>
> ```http
> Authorization: Bearer <token_jwt>
> ```

La lógica de comunicación con la API se encuentra en el archivo `src/lib/api.ts`, donde se utilizan funciones como `loginUser`, `registerUser`, `fetchActions` y `createAction` para interactuar con el backend.

## 📄 Documentación de la API

Para más detalles sobre la gramática, validaciones y formatos de solicitud/respuesta, revisá la sección **Documentación de la API** en el repositorio del backend.

---

¡Listo! Ahora el frontend está conectado al backend en Go y listo para consumir sus servicios.
