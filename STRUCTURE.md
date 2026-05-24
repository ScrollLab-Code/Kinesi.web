# 📁 Estructura del Proyecto Kinase

## 🎯 Descripción General

El proyecto Kinase es una **landing page moderna** con:
- Frontend en React + TypeScript + Vite
- API serverless en Vercel para gestión de emails
- Integración con Supabase para datos
- Emails profesionales con Resend

---

## 📂 Estructura de Directorios

```
kinase/
├── 📁 src/                          # Código fuente del frontend
│   ├── 📁 components/               # Componentes reutilizables
│   │   ├── Navbar.tsx               # Barra de navegación
│   │   └── Footer.tsx               # Pie de página
│   │
│   ├── 📁 sections/                 # Secciones de la página
│   │   ├── Hero.tsx                 # Sección hero/banner
│   │   ├── Features.tsx             # Características principales
│   │   ├── About.tsx                # Información de la empresa
│   │   ├── Courses.tsx              # Catálogo de cursos
│   │   ├── PaymentSchedule.tsx      # Planes de pago
│   │   ├── Testimonials.tsx         # Testimonios de usuarios
│   │   └── TestSection.tsx          # Sección de diagnóstico/test
│   │
│   ├── 📁 api/                      # Funciones de API cliente
│   │   ├── supabase.ts              # Configuración Supabase
│   │   └── [otras funciones]        # Llamadas a backend
│   │
│   ├── 📁 lib/                      # Utilidades y helpers
│   │   ├── utils.ts                 # Funciones de utilidad general
│   │   └── [helpers]                # Funciones auxiliares
│   │
│   ├── 📁 assets/                   # Imágenes y recursos estáticos
│   │   ├── images/                  # Imágenes PNG, JPG, SVG
│   │   ├── icons/                   # Iconos
│   │   └── fonts/                   # Fuentes personalizadas
│   │
│   ├── 📁 types/                    # (Ver types.ts abajo)
│   │
│   ├── App.tsx                      # Componente raíz
│   ├── App.css                      # Estilos globales
│   ├── main.tsx                     # Punto de entrada
│   └── index.css                    # Estilos base
│
├── 📁 api/                          # Serverless Functions (Vercel)
│   ├── send-email.ts                # Envío de emails (endpoint POST /api/send-email)
│   ├── email-templates.ts           # Plantillas HTML de emails
│   ├── utils.ts                     # Sanitización y validación
│   └── README.md                    # Documentación de API
│
├── 📁 public/                       # Archivos públicos estáticos
│   └── [assets públicos]
│
├── 📁 dist/                         # Build de producción (generado)
│
├── 📁 node_modules/                 # Dependencias (generado)
│
├── 📄 src/types.ts                  # Tipos e interfaces compartidas
├── 📄 index.html                    # HTML principal
├── 📄 vite.config.ts                # Configuración Vite
├── 📄 tsconfig.json                 # Configuración TypeScript
├── 📄 tsconfig.app.json             # TS config para app
├── 📄 tsconfig.node.json            # TS config para build
├── 📄 eslint.config.js              # Configuración ESLint
├── 📄 package.json                  # Dependencias y scripts
├── 📄 package-lock.json             # Lock file
├── 📄 .gitignore                    # Archivos a ignorar en git
├── 📄 .env.example                  # Plantilla de variables de entorno
├── 📄 .env.local                    # Variables de entorno locales
├── 📄 README.md                     # Documentación general
└── 📄 .git/                         # Repositorio git

```

---

## 🗂️ Descripción Detallada

### `src/` - Frontend (React)

#### **components/**
Componentes UI reutilizables del sitio:
- `Navbar.tsx` - Navegación principal con links a secciones
- `Footer.tsx` - Pie de página con info y links

#### **sections/**
Componentes de secciones grandes de la página:
- `Hero.tsx` - Banner principal/hero section
- `Features.tsx` - Características o beneficios
- `About.tsx` - Información sobre el proyecto/empresa
- `Courses.tsx` - Listado de cursos disponibles
- `PaymentSchedule.tsx` - Planes y opciones de pago
- `Testimonials.tsx` - Testimonios de estudiantes
- `TestSection.tsx` - Formulario de diagnóstico/test

#### **api/**
Funciones para comunicación con servidores:
- `supabase.ts` - Cliente Supabase y funciones de BD
- Otras funciones de integración con APIs

#### **lib/**
Utilidades y helpers reutilizables:
- `utils.ts` - Funciones de utilidad general (formateo, validaciones, etc.)
- Helpers específicos del dominio

#### **assets/**
Recursos estáticos:
- `images/` - Imágenes del sitio
- `icons/` - Iconos SVG/PNG
- `fonts/` - Fuentes locales

#### **types.ts**
Archivo de tipos e interfaces compartidas:
```typescript
export interface Course { ... }        // Estructura de cursos
export interface Testimonial { ... }   // Estructura de testimonios
export interface PaymentSchedule { ... } // Planes de pago
export interface ApiResponse<T> { ... } // Respuesta estándar
```

#### **App.tsx**
Componente raíz que ensambla todas las secciones.

---

### `api/` - Backend Serverless (Vercel)

Funciones serverless que se ejecutan en endpoints HTTP:

#### **send-email.ts**
```
POST /api/send-email
├─ Recibe: { name, email, phone, career, result, answers }
├─ Valida: email, nombres, longitudes
├─ Sanitiza: previene XSS
├─ Envía: email al admin + confirmación al usuario
└─ Retorna: { success, data, error }
```

#### **email-templates.ts**
Genera HTML profesional para:
- `generateLeadEmailHtml()` - Email al admin con info del lead
- `generateConfirmationEmailHtml()` - Email de confirmación al usuario

#### **utils.ts**
Funciones compartidas de API:
- `escapeHtml()` - Sanitización contra XSS
- `validateLeadData()` - Validación de formulario
- `isValidEmail()` - Validación de email

#### **README.md**
Documentación completa del API:
- Setup y variables de entorno
- Endpoint y request/response
- Validaciones
- Seguridad
- Troubleshooting

---

## 🔧 Configuración

### **vite.config.ts**
Configuración del bundler Vite:
- Plugin React
- Optimizaciones de build
- Dev server

### **tsconfig.json** / **tsconfig.app.json** / **tsconfig.node.json**
Configuración de TypeScript separada por contexto:
- `tsconfig.json` - Config base
- `tsconfig.app.json` - Config para src/
- `tsconfig.node.json` - Config para build/config

### **eslint.config.js**
Linting y análisis estático:
- Type-aware rules habilitadas
- React hooks checks
- TypeScript strict checking

---

## 📦 Dependencias Principales

### Production
- **react** - Framework UI
- **react-dom** - Rendering en DOM
- **@tailwindcss/vite** - Estilos con Tailwind
- **framer-motion** - Animaciones
- **@supabase/supabase-js** - Cliente Supabase
- **resend** - API de emails

### Development
- **vite** - Bundler/dev server
- **typescript** - Type checking
- **eslint** - Linting
- **@vitejs/plugin-react** - Plugin de React

---

## 🔐 Variables de Entorno

Ver `.env.example` para lista completa:

```bash
# Supabase (base de datos)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Resend (emails)
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_CONTACT_EMAIL=
```

---

## 🚀 Scripts Disponibles

```bash
npm run dev        # Dev server (http://localhost:5173)
npm run build      # Build para producción
npm run lint       # Linting con ESLint
npm run preview    # Preview del build
```

---

## 🔄 Flujo de Datos

```
Usuario rellena formulario (TestSection)
            ↓
Validación en frontend
            ↓
POST /api/send-email
            ↓
Validación en backend
            ↓
Sanitización de input
            ↓
Envío de 2 emails (Resend):
  1️⃣ Notificación al admin
  2️⃣ Confirmación al usuario
            ↓
Respuesta JSON al frontend
            ↓
Mostrar éxito/error al usuario
```

---

## 📋 Checklist de Desarrollo

Al añadir una nueva funcionalidad:

- [ ] Crear archivo/carpeta en la ubicación correcta
- [ ] Actualizar types.ts si necesitas nuevas interfaces
- [ ] Añadir documentación en README
- [ ] Pasar linting: `npm run lint`
- [ ] Probar en dev: `npm run dev`
- [ ] Build sin errores: `npm run build`

---

## 🆘 Dudas Frecuentes

**P: ¿Dónde pongo un nuevo componente?**
A: Si es pequeño y reutilizable → `src/components/`
   Si es una sección de página → `src/sections/`

**P: ¿Dónde pongo una nueva función de API?**
A: En `src/api/` si es cliente-side
   En `api/` si es serverless function

**P: ¿Dónde defino nuevos tipos?**
A: En `src/types.ts` para tipos compartidos
   En el componente si es local

**P: ¿Cómo añado una dependencia?**
A: `npm install <package-name>`
   Luego commit package.json y package-lock.json

---

## 📚 Recursos

- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Supabase Docs](https://supabase.com/docs)
- [Resend Docs](https://resend.com/docs)
