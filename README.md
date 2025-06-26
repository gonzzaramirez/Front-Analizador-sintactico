# 🗂️ Analizador Sintáctico de Agenda en Español (Frontend)

Frontend del proyecto de analizador sintáctico de una agenda, para la materia de Teoría de Computación de la Licenciatura en Sistemas de Información de la UNNE.

## 🚀 Stack Tecnológico

### Core Framework

- ⚛️ **Next.js**
- 🧠 **TypeScript** –

### UI & Styling

- 🎨 **ShadCN/UI** –
- 💨 **Tailwind CSS** –

### Visualización & UX

- 🌳 **react-d3-tree** – Visualización de árboles sintácticos
- 📅 **date-fns** – Manipulación de fechas
- 🔔 **sonner** – Notificaciones toast

### Validación & Utilidades

- ✅ **zod** – Validación de esquemas TypeScript

## ⚙️ Instalación

```bash
git clone <https://github.com/gonzzaramirez/Front-Analizador-sintactico>
cd Front-Analizador-sintactico
npm install
npm run dev
```

### Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```ini
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🏗️ Arquitectura de Componentes

### Componentes Principales

#### 🔐 **AuthTabs** (`authTabs.tsx`)

- Maneja la autenticación de usuarios (login/registro)
- Utiliza pestañas para alternar entre formularios
- Integra validación con Zod
- Gestiona tokens JWT en localStorage

#### 📝 **CommandForm** (`command-form.tsx`)

- Formulario principal para ingresar comandos
- Validación del formato
- Integración con el análisis sintáctico
- Manejo de estados de carga y errores

#### 🔍 **CommandAnalysis** (`command-analysis.tsx`)

- Visualiza el análisis sintáctico del comando
- Renderiza árboles sintácticos con `react-d3-tree`
- Muestra errores de parsing con posiciones
- Permite guardar comandos válidos como acciones

#### 📋 **EventList** (`event-list.tsx`)

- Lista paginada de acciones del usuario
- Operaciones (crear, leer, eliminar)
- Filtrado por tipo (evento/recordatorio)
- Integración con el sistema de autenticación

#### 🎯 **CommandPatterns** (`command-patterns.tsx`)

- Muestra ejemplos de comandos válidos
- Guía de uso para el usuario
- Patrones de sintaxis soportados

#### 📚 **UserGuide** (`userGuide.tsx`)

- Documentación interactiva del sistema

## 🔌 API & Comunicación con Backend

### Configuración Base

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;
```

### Endpoints Principales

#### 🔐 Autenticación

```typescript
// Login de usuario
POST /auth/login
Body: { user_name: string, password: string }
Response: { token: string }

// Registro de usuario
POST /auth/register
Body: { user_name: string, password: string }
```

#### 📋 Gestión de Acciones

```typescript
// Crear acción
POST /actions
Headers: { Authorization: "Bearer <token>" }
Body: { comand: string }

// Obtener acciones (paginado)
GET /actions?page=1&pageSize=10
Headers: { Authorization: "Bearer <token>" }

// Eliminar acción
DELETE /actions/{id}
Headers: { Authorization: "Bearer <token>" }
```

#### 🔍 Análisis Sintáctico

```typescript
// Analizar comando (sin guardar)
POST /analyze
Body: { command: string }
Response: {
  success: boolean,
  ast?: any,
  error?: { type, message, position },
  analysis?: { command, verb, words, date, time, description }
}
```

### Funciones API Principales

#### `loginUser(user_name, password)`

- Autentica al usuario y retorna JWT
- Maneja errores 401 (credenciales inválidas)

#### `registerUser(user_name, password)`

- Registra nuevo usuario
- Validación de datos en frontend

#### `createAction(token, command)`

- Crea nueva acción con comando analizado
- Requiere token JWT válido
- Maneja errores de formato (400) y procesamiento (500)

#### `getUserActions(token, page, pageSize)`

- Obtiene acciones paginadas del usuario
- Maneja token expirado (401)

#### `deleteAction(token, actionId)`

- Elimina acción específica
- Validación de permisos (403)

#### `analyzeCommand(command)`

- Analiza comando sin persistencia
- Retorna AST y análisis detallado
- Manejo de errores de sintaxis

## 🔗 Backend Relacionado

El frontend consume los endpoints del backend desarrollado en Go:
[https://github.com/RodrigoGonzalez78/go_analyzer](https://github.com/RodrigoGonzalez78/go_analyzer)

---
