# 🚀 NextJs

Notas y apuntes sobre NextJs - Framework de React para desarrollo web moderno

## 📦 Crear un proyecto nuevo

```bash
npx create-next-app@latest nombre-proyecto
```

**Opciones de configuración disponibles:**

- 🔤 **TypeScript**: Añade tipado estático para mayor robustez del código
- 🔍 **ESLint**: Herramienta de análisis de código para mantener buenas prácticas
- 🎨 **Tailwind CSS**: Framework CSS utility-first para desarrollo rápido
- 📁 **App Router**: Sistema de enrutamiento basado en archivos (recomendado)
- ⚡ **Turbopack**: Bundler de alta performance para desarrollo

## 🏃‍♂️ Iniciar el proyecto

```bash
cd nombre-proyecto
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura de carpetas

### Directorios principales:

- **`app/`** 📂: Directorio principal que contiene las rutas, páginas y componentes de la aplicación
- **`public/`** 🖼️: Archivos estáticos servidos directamente (imágenes, iconos, documentos)
- **`.next/`** ⚡: Directorio generado automáticamente con archivos compilados y optimizados
- **`node_modules/`** 📦: Dependencias del proyecto instaladas por npm/yarn

### Archivos de configuración:

- **`package.json`** 📄: Configuración del proyecto, dependencias y scripts
- **`next.config.js`** ⚙️: Configuración específica de Next.js
- **`tsconfig.json`** 🔤: Configuración de TypeScript (si está habilitado)
- **`eslint.config.js`** 🔧: Configuración de ESLint para análisis de código
- **README.md** 📖: Documentación del proyecto

## ⚡ Turbopack

**¿Qué es Turbopack?**

Turbopack es el nuevo bundler desarrollado por Vercel, diseñado para ser significativamente más rápido que Webpack en proyectos Next.js. Mejora los tiempos de compilación y recarga en caliente durante el desarrollo.

### Habilitación:

**Durante la creación del proyecto:**
Seleccionar "Yes" en la opción de Turbopack

**Modificación manual en `package.json`:**

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build --turbo",
    "start": "next start"
  }
}
```

**Requisitos:** Next.js 13.5 o superior

## 🗺️ Sistema de Rutas y Páginas

Next.js utiliza un **sistema de enrutamiento basado en archivos** dentro del directorio `app/`. Cada archivo y carpeta se convierte automáticamente en una ruta accesible.

### 📍 Rutas estáticas:

- `app/page.js` → `/` (página principal)
- `app/about/page.js` → `/about`
- `app/contact/page.js` → `/contact`
- `app/services/page.js` → `/services`

### 🔄 Rutas dinámicas:

Las rutas dinámicas utilizan corchetes `[]` para definir parámetros variables:

#### Parámetro único:

- `app/blog/[slug]/page.js`
  - Accesible en: `/blog/introduccion-nextjs`, `/blog/tutorial-react`
  - El parámetro `slug` contiene el valor dinámico

#### Múltiples parámetros:

- `app/blog/[year]/[month]/[slug]/page.js`
  - Accesible en: `/blog/2024/01/primer-post`
  - Parámetros: `year: "2024"`, `month: "01"`, `slug: "primer-post"`

#### Rutas API:

- `app/api/users/route.js` → Endpoint: `/api/users`
- `app/api/users/[id]/route.js` → Endpoint: `/api/users/123`

### 💻 Ejemplo de implementación:

```javascript
export default function BlogPost({ params }) {
  return (
    <div>
      <h1>Artículo: {params.slug}</h1>
      <p>Contenido del blog post...</p>
    </div>
  );
}
```

### 📋 Archivos especiales en el directorio `app/`:

- **`page.js`**: Define el componente de la página para esa ruta
- **`layout.js`**: Define el layout compartido para rutas anidadas
- **`loading.js`**: Componente de carga mostrado mientras se renderiza la página
- **`error.js`**: Componente de error para manejo de errores en esa ruta
- **`not-found.js`**: Página 404 personalizada

Este sistema proporciona una estructura clara y predecible para organizar las rutas de la aplicación, facilitando el desarrollo y mantenimiento del código.

Por ejemplo para crear una página de contacto, simplemente creamos el archivo `app/contact/page.js`:

```javascript
export default function ContactPage() {
  return (
    <div>
      <h1>Contacto</h1>
      <p>Formulario de contacto aquí...</p>
    </div>
  );
}
```

Con esto estamos haciendo accesible la ruta `localhost:3000/contact` que mostrará el contenido del componente `ContactPage`.

## 🏷️ Metadata - Metatags

Los metadatos son elementos fundamentales para el **SEO** y la indexación de páginas web. Los motores de búsqueda como Google utilizan esta información para clasificar y mostrar contenido relevante en los resultados de búsqueda.

### 📋 Metadatos esenciales:

- **`title`** 📝: Título principal de la página
- **`description`** 📄: Descripción concisa del contenido (150-160 caracteres recomendados)
- **`keywords`** 🔍: Palabras clave relevantes para el contenido
- **`author`** ✍️: Autor o creador del contenido
- **`viewport`** 📱: Configuración de visualización para dispositivos móviles
- **`robots`** 🤖: Instrucciones para los crawlers de motores de búsqueda

**Ejemplo práctico:** Si tu sitio vende zapatos, los metadatos deben incluir términos como "comprar zapatos online", "zapatos deportivos", "calzado", etc., para que los usuarios encuentren tu contenido al buscar estos términos.

### ⚙️ Implementación en Next.js 13+

En Next.js 13 y versiones posteriores, los metadatos se definen mediante la exportación de una constante `metadata` en cada archivo `page.js`:

```typescript
export const metadata = {
  title: "Mi Sitio Web",
  description: "Descripción breve de mi sitio web",
  keywords: "zapatos, comprar zapatos online, zapatos deportivos",
  author: "Tu Nombre",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};
```

**Ventajas:**

- ✅ Cada página puede tener metadatos específicos
- ✅ Configuración sencilla y declarativa
- ✅ Soporte completo para SEO

### 🎯 Configuración con TypeScript

Para mayor precisión y autocompletado, utiliza el tipo `Metadata` de Next.js:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Sitio Web",
  description: "Descripción breve de mi sitio web",
  keywords: ["zapatos", "comprar zapatos online", "zapatos deportivos"],
};
```

**Beneficios del tipado:**

- 🔍 Autocompletado con `Ctrl + Espacio`
- ⚠️ Validación de tipos en tiempo de desarrollo
- 📖 Mejor documentación integrada

> 💡 **Tip de VS Code:** Usa el snippet `mr + Tab` para generar rápidamente la estructura básica de metadatos.

## 🏗️ Layouts y Layouts Anidados

Un **layout** es un componente que define la estructura común compartida entre múltiples páginas. Funciona como un **Higher-Order Component (HOC)** que envuelve el contenido de las páginas, proporcionando consistencia visual y funcional.

### 📐 Características principales:

- ♻️ **Reutilización**: Evita duplicación de código estructural
- 🎨 **Consistencia**: Mantiene diseño uniforme en toda la aplicación
- ⚡ **Performance**: Se ejecuta antes que las páginas
- 🔄 **Persistencia**: Mantiene estado entre navegaciones

### 🔧 Layout básico

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <title>Mi Sitio Web</title>
      </head>
      <body>
        <header>
          <nav>{/* Navegación principal */}</nav>
        </header>
        <main>{children}</main>
        <footer>{/* Pie de página */}</footer>
      </body>
    </html>
  );
}
```

**Elementos clave:**

- **`children`**: Prop de tipo `React.ReactNode` que representa el contenido específico de cada página
- **Estructura HTML**: Define elementos comunes como header, nav, main, footer
- **Orden de ejecución**: Se renderiza antes que las páginas individuales

### 🏢 Layouts anidados

Los layouts anidados permiten crear **estructuras jerárquicas** con diferentes niveles de diseño:

```typescript
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <header>
        <h1>Panel de Administración</h1>
      </header>
      <nav>{/* Navegación específica de admin */}</nav>
      <main>{children}</main>
    </div>
  );
}
```

**Aplicación:** Este layout en `app/admin/layout.js` se aplicará a todas las páginas dentro del directorio `admin/`.

### 📁 Agrupación de rutas con Route Groups

Para agrupar rutas bajo un layout específico **sin afectar la URL**, utiliza paréntesis `()` en el nombre del directorio:

```bash
app/
├── (admin)/
│   ├── layout.js          # Layout específico para admin
│   ├── dashboard/
│   │   └── page.js        # Ruta: /dashboard
│   └── users/
│       └── page.js        # Ruta: /users
├── (marketing)/
│   ├── layout.js          # Layout para marketing
│   └── landing/
│       └── page.js        # Ruta: /landing
└── page.js                # Ruta: /
```

**Resultado:**

- ✅ `/dashboard` y users usan el layout de `(admin)`
- ✅ `/landing` usa el layout de `(marketing)`
- ✅ Las URLs **no incluyen** `(admin)` o `(marketing)`
- ✅ Organización clara sin impacto en rutas

> 💡 **Tip de VS Code:** Usa el snippet `lrc + Tab` para generar rápidamente la estructura básica de un layout.

### 🎯 Casos de uso comunes:

- **Dashboard administrativo**: Layout con sidebar y navegación específica
- **Área de usuario**: Layout con menú de perfil y configuraciones
- **Sección pública**: Layout con header marketing y footer completo
- **Área de autenticación**: Layout minimalista para login/registro

## 🧭 Componente de Navegación

La barra de navegación es un **elemento fundamental** para la experiencia de usuario y la accesibilidad de la aplicación. Al ser un componente compartido entre múltiples páginas, se organiza dentro de un directorio dedicado a componentes reutilizables.

### 📂 Organización de componentes

Los componentes compartidos se almacenan en el directorio `components/` en la raíz del proyecto, siguiendo una estructura modular:

```bash
components/
├── navbar/
│   └── Navbar.tsx
└── index.ts              # Archivo de exportación centralizada
```

**Beneficios de esta estructura:**

- 🗂️ **Organización clara**: Cada componente en su propio directorio
- 📦 **Importación simplificada**: Exportación centralizada desde `index.ts`
- 🔧 **Mantenibilidad**: Fácil localización y modificación de componentes
- ♻️ **Reutilización**: Acceso desde cualquier parte de la aplicación

### 🎨 Implementación del componente Navbar

```typescript
export const Navbar = () => {
  return (
    <nav className="flex bg-blue-800 bg-opacity-30 p-2 m-2 rounded">
      <ul className="flex space-x-4">
        <li>
          <a href="/" className="text-white hover:text-blue-300">
            Inicio
          </a>
        </li>
        <li>
          <a href="/about" className="text-white hover:text-blue-300">
            Acerca de
          </a>
        </li>
        <li>
          <a href="/contact" className="text-white hover:text-blue-300">
            Contacto
          </a>
        </li>
        <li>
          <a href="/services" className="text-white hover:text-blue-300">
            Servicios
          </a>
        </li>
      </ul>
    </nav>
  );
};
```

**Características del componente:**

- 🎯 **Funcional**: Componente de función moderno
- 🎨 **Estilizado**: Utiliza Tailwind CSS para estilos responsivos
- 🔗 **Enlaces**: Navegación básica con efecto hover
- 📱 **Responsive**: Diseño adaptable a diferentes dispositivos

### 📦 Sistema de exportación centralizada

```typescript
export * from "./navbar/Navbar";
```

**Ventajas:**

- ✨ **Importación limpia**: `import { Navbar } from "@/components"`
- 📊 **Gestión centralizada**: Un solo punto de exportación
- 🚀 **Escalabilidad**: Fácil adición de nuevos componentes

### 🏗️ Integración en layouts

```typescript
import { Navbar } from "@/components";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <title>Mi Sitio Web</title>
      </head>
      <body>
        <Navbar /> {/* Navegación compartida globalmente */}
        <main>{children}</main>
        <footer>{/* Pie de página */}</footer>
      </body>
    </html>
  );
}
```

**Resultado:** La barra de navegación aparece en todas las páginas de la aplicación manteniendo consistencia visual y funcional.

## ⚡ Server Components con Async/Await

En Next.js, todos los componentes son **Server Components** por defecto, ejecutándose en el servidor antes de enviarse al cliente. Esta arquitectura permite el uso nativo de operaciones asíncronas para una carga de datos más eficiente.

### 🖥️ ¿Qué significa Server-Side Rendering?

El **renderizado del lado del servidor** implica que:

1. 🔧 La aplicación se construye y ejecuta en el servidor
2. 📄 Se genera HTML completamente renderizado
3. 📤 El HTML final se envía al navegador del usuario
4. ⚡ El usuario ve contenido inmediatamente, sin esperas de JavaScript

### 🚀 Ventajas de los Server Components

#### **Performance y Velocidad:**

- ⚡ **Carga inicial optimizada**: HTML pre-renderizado para visualización inmediata
- 📦 **Menor JavaScript**: Reduce significativamente el código enviado al cliente
- 🎯 **Time to First Contentful Paint mejorado**: Contenido visible más rápido

#### **SEO y Accesibilidad:**

- 🔍 **SEO optimizado**: Los motores de búsqueda indexan contenido completo
- 🤖 **Meta tags dinámicos**: Generación server-side de metadatos
- 📱 **Mejor accesibilidad**: Contenido disponible sin JavaScript

#### **Seguridad y Datos:**

- 🔒 **Protección de datos sensibles**: Lógica crítica permanece en el servidor
- 🛡️ **API keys seguras**: Credenciales nunca expuestas al cliente
- 🔐 **Validación server-side**: Procesamiento seguro de datos

### 💡 Implementación práctica

Los Server Components permiten el uso directo de `async/await` sin configuración adicional:

```typescript
async function ProductsPage() {
  // Llamada directa a API o base de datos
  const products = await fetch("https://api.example.com/products");
  const data = await products.json();

  return (
    <div>
      <h1>Productos</h1>
      {data.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductsPage;
```

**Características destacadas:**

- 🔄 **Asincronía nativa**: No requiere hooks como `useEffect`
- 📊 **Carga de datos eficiente**: Datos disponibles antes del renderizado
- 🎯 **Simplificación del código**: Lógica directa y legible

Esta arquitectura representa un cambio paradigmático hacia aplicaciones más rápidas, seguras y eficientes, aprovechando las capacidades del servidor moderno.

## 🔗 Next/Link - Navegación Optimizada

El componente `Link` de Next.js es una **herramienta fundamental** para la navegación interna de aplicaciones. Reemplaza los enlaces HTML tradicionales con un sistema optimizado que mejora significativamente la experiencia del usuario y el rendimiento de la aplicación.

### ⚠️ Problema con navegación tradicional

En el ejemplo actual del componente `Navbar`, utilizamos elementos `<a>` estándar que provocan:

- 🐌 **Recarga completa** de la página en cada navegación
- ⏳ **Pérdida de estado** de la aplicación
- 🔄 **Re-descarga** de recursos ya cargados
- 📉 **Experiencia de usuario degradada**

### ⚡ Solución con Next/Link

El componente `Link` implementa **Client-Side Navigation**, permitiendo transiciones instantáneas entre páginas sin recargas completas.

#### 📥 Importación del componente:

```typescript
import Link from "next/link";
```

#### 🔧 Implementación optimizada del Navbar:

```typescript
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="flex bg-blue-800 bg-opacity-30 p-2 m-2 rounded">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="text-white hover:text-blue-300">
            Inicio
          </Link>
        </li>
        <li>
          <Link href="/about" className="text-white hover:text-blue-300">
            Acerca de
          </Link>
        </li>
        <li>
          <Link href="/contact" className="text-white hover:text-blue-300">
            Contacto
          </Link>
        </li>
        <li>
          <Link href="/services" className="text-white hover:text-blue-300">
            Servicios
          </Link>
        </li>
      </ul>
    </nav>
  );
};
```

### 🚀 Beneficios clave del componente Link

#### **Performance y Velocidad:**

- ⚡ **Navegación instantánea**: Cambios de página sin recargas
- 🔮 **Prefetching inteligente**: Pre-carga automática de páginas enlazadas
- 💾 **Conservación de estado**: Mantiene el estado de la aplicación entre navegaciones
- 📦 **Reutilización de recursos**: Evita re-descargas innecesarias

#### **Experiencia de Usuario:**

- 🎯 **Transiciones fluidas**: Navegación sin interrupciones visuales
- 📱 **Responsive nativo**: Adaptación automática a diferentes dispositivos
- 🎨 **Soporte completo de CSS**: Aplicación directa de estilos y clases
- 🔗 **Compatibilidad con rutas dinámicas**: Funciona perfectamente con `[slug]` y rutas anidadas

#### **SEO y Accesibilidad:**

- 🔍 **Crawling optimizado**: Los motores de búsqueda pueden indexar enlaces correctamente
- ♿ **Accesibilidad mejorada**: Soporte completo para lectores de pantalla
- 🌐 **Historial del navegador**: Integración completa con botones atrás/adelante

### ⚠️ Mejores prácticas y limitaciones

#### **✅ Casos de uso recomendados:**

- 🏠 **Navegación interna**: Enlaces entre páginas de la misma aplicación
- 📄 **Rutas dinámicas**: Enlaces con parámetros como `/blog/[slug]`
- 🔗 **Rutas anidadas**: Navegación en estructuras complejas

#### **❌ Cuándo NO usar Link:**

```typescript
// ❌ Enlaces externos - Usar <a> tradicional
<a href="https://google.com" target="_blank" rel="noopener noreferrer">
  Google
</a>

// ❌ Enlaces con target="_blank" - No soportado nativamente
<a href="/document.pdf" target="_blank">
  Ver PDF
</a>

// ❌ Anclas en la misma página - Usar <a>
<a href="#seccion">
  Ir a sección
</a>
```

#### **🔧 Casos especiales:**

```typescript
// ✅ Enlaces externos con Next/Link (cuando sea necesario)
<Link href="https://external-site.com">
  <a target="_blank" rel="noopener noreferrer">
    Sitio externo
  </a>
</Link>

// ✅ Manejo de eventos onClick
<Link href="/dashboard" onClick={(e) => {
  // Lógica personalizada antes de la navegación
  console.log('Navegando a dashboard');
}}>
  Dashboard
</Link>
```

### 💡 Optimizaciones adicionales

El componente `Link` incluye configuraciones avanzadas para casos específicos:

```typescript
// Prefetching condicional
<Link href="/heavy-page" prefetch={false}>
  Página pesada
</Link>

// Enlaces con scroll personalizado
<Link href="/contact" scroll={false}>
  Contacto (sin scroll automático)
</Link>

// Reemplazo del historial
<Link href="/login" replace>
  Login (reemplaza entrada del historial)
</Link>
```

Esta implementación transforma la navegación básica en una experiencia moderna, rápida y optimizada que aprovecha al máximo las capacidades de Next.js.

## 🖥️ Arquitectura de Server Components

En Next.js 13+, la arquitectura de componentes se basa en el **renderizado del lado del servidor** como estrategia principal, optimizando el rendimiento y la experiencia del usuario mediante decisiones inteligentes sobre dónde ejecutar el código.

### 🏗️ Fundamentos de Server Components

#### **Renderizado por defecto:**

- 🖥️ **Server-first**: Todos los componentes son Server Components por defecto
- ⚡ **Renderizado estático**: Generación de contenido en tiempo de build cuando es posible
- 📦 **Optimización automática**: Reducción significativa del JavaScript enviado al cliente
- 🔄 **Hidratación selectiva**: Solo los componentes interactivos se hidratan en el cliente

#### **Restricciones importantes:**

- ❌ **Hooks de cliente**: `useState`, `useEffect`, `useContext` no están disponibles
- ❌ **Event handlers**: `onClick`, `onChange` requieren componentes de cliente
- ❌ **APIs del navegador**: `localStorage`, `sessionStorage`, `window` no son accesibles
- ❌ **Librerías cliente**: Muchas librerías de terceros requieren `"use client"`

### ⚙️ Configuración avanzada de Server Components

Next.js proporciona constantes de configuración para controlar el comportamiento de renderizado:

```typescript
export const dynamic = "auto"; // Modo de renderizado
export const dynamicParams = true; // Manejo de parámetros dinámicos
export const revalidate = 3600; // Revalidación cada hora
export const fetchCache = "auto"; // Estrategia de caché
export const runtime = "nodejs"; // Entorno de ejecución
export const preferredRegion = "auto"; // Región de despliegue

export default function ProductsPage() {
  // Lógica del componente
}
```

### 📋 Configuraciones detalladas

#### **`dynamic` - Control de renderizado:**

```typescript
export const dynamic = "auto"; // ✅ Decisión automática inteligente
export const dynamic = "force-static"; // 🏗️ Renderizado solo en build time
export const dynamic = "force-dynamic"; // 🔄 Renderizado en cada request
```

**Casos de uso:**

- `"force-static"`: Páginas de contenido estático (landing pages, documentación)
- `"force-dynamic"`: Páginas con datos en tiempo real (dashboards, feeds)
- `"auto"`: Permite que Next.js optimice automáticamente

#### **`revalidate` - Estrategia de actualización:**

```typescript
export const revalidate = false; // 🚫 Sin revalidación (estático permanente)
export const revalidate = 60; // ⏰ Revalidar cada 60 segundos
export const revalidate = 3600; // 🕐 Revalidar cada hora
```

#### **`fetchCache` - Control de caché de datos:**

```typescript
export const fetchCache = "force-cache"; // 💾 Forzar uso de caché
export const fetchCache = "no-store"; // 🚫 Sin caché, datos frescos siempre
export const fetchCache = "auto"; // 🎯 Decisión automática basada en uso
```

#### **`runtime` - Entorno de ejecución:**

```typescript
export const runtime = "nodejs"; // 🖥️ Node.js completo (por defecto)
export const runtime = "edge"; // ⚡ Edge Runtime (más rápido, limitado)
```

**Comparación de runtimes:**

- **Node.js**: Todas las APIs de Node.js, mayor compatibilidad
- **Edge**: Arranque ultra-rápido, menor latencia, APIs limitadas

### ⚠️ Consideraciones importantes

#### **Análisis estático requerido:**

```typescript
// ✅ Válido - Valor estático
export const revalidate = 600;

// ❌ Inválido - Expresión dinámica
export const revalidate = 60 * 10;

// ❌ Inválido - Variable
const REVALIDATE_TIME = 600;
export const revalidate = REVALIDATE_TIME;
```

### 💻 Transición a Client Components

Cuando necesitas interactividad o funcionalidades específicas del navegador, utiliza la directiva `"use client"`:

```typescript
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Contador: {count}</h2>
      <button
        onClick={() => setCount(count + 1)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Incrementar
      </button>
    </div>
  );
}
```

### 🎯 Cuándo usar Client Components

#### **✅ Casos que requieren `"use client"`:**

- 🖱️ **Interactividad**: Botones, formularios, eventos de usuario
- 📊 **Estado local**: Manejo de estado con `useState`, `useReducer`
- 🔄 **Efectos**: Llamadas a APIs del cliente, suscripciones
- 🌐 **APIs del navegador**: Geolocalización, localStorage, sensores
- 📱 **Librerías de UI**: Componentes que requieren hidratación

#### **❌ Mantener como Server Components:**

- 📄 **Contenido estático**: Texto, imágenes, layouts
- 🗃️ **Consultas a BD**: Fetch de datos desde APIs o bases de datos
- 🔐 **Lógica de negocio**: Validaciones, transformaciones de datos
- 🏷️ **SEO crítico**: Contenido que debe ser indexado

### 💡 Estrategia de arquitectura híbrida

```typescript
// Server Component (por defecto)
import { StaticChart } from "@/components/StaticChart";
import { InteractiveWidget } from "@/components/InteractiveWidget";

async function DashboardPage() {
  // Datos obtenidos en el servidor
  const data = await fetch("https://api.example.com/stats");
  const stats = await data.json();

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Server Component - Renderizado estático */}
      <StaticChart data={stats} />

      {/* Client Component - Interactivo */}
      <InteractiveWidget initialData={stats} />
    </div>
  );
}

export default DashboardPage;
```

### 🎯 Principio guía

> **Regla de oro**: Todo lo que puede ejecutarse en el servidor, **debe ejecutarse en el servidor**. Utiliza Client Components únicamente cuando la interactividad o las APIs del navegador sean estrictamente necesarias.

Esta arquitectura híbrida permite aprovechar lo mejor de ambos mundos: rendimiento óptimo del servidor con la interactividad necesaria del cliente.

## 🎯 usePathname - ActiveLink para Navegación Inteligente

El hook `usePathname` es una herramienta fundamental para crear **navegación contextual** que responde dinámicamente a la ruta actual del usuario. Permite implementar enlaces activos que mejoran significativamente la orientación y experiencia de navegación.

### 🚀 ¿Por qué usar ActiveLink?

#### **Beneficios de la navegación contextual:**

- 🎨 **Feedback visual**: El usuario siempre sabe dónde se encuentra
- 🧭 **Mejor UX**: Navegación más intuitiva y profesional
- ♿ **Accesibilidad**: Facilita la orientación para usuarios con discapacidades
- 📱 **Estándar moderno**: Patrón común en aplicaciones web actuales

#### **Limitación de Server Components:**

Los Server Components no pueden acceder a información del navegador como la URL actual, por lo que necesitamos un Client Component para esta funcionalidad.

### 🔧 Implementación del componente ActiveLink

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  path: string;
  text: string;
  className?: string;
}

export const ActiveLink = ({ path, text, className = "" }: Props) => {
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <Link
      href={path}
      className={`
        mr-2 px-3 py-2 rounded transition-colors duration-200
        ${
          isActive
            ? "bg-blue-600 text-white font-semibold"
            : "text-blue-100 hover:text-white hover:bg-blue-700"
        }
        ${className}
      `}
    >
      {text}
    </Link>
  );
};
```

### 🎨 Versión avanzada con estilos condicionales

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  path: string;
  text: string;
  icon?: ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  exact?: boolean;
}

export const ActiveLink = ({
  path,
  text,
  icon,
  className = "",
  activeClassName = "bg-blue-600 text-white font-semibold",
  inactiveClassName = "text-blue-100 hover:text-white hover:bg-blue-700",
  exact = true,
}: Props) => {
  const pathname = usePathname();

  // Lógica para determinar si el enlace está activo
  const isActive = exact ? pathname === path : pathname.startsWith(path);

  return (
    <Link
      href={path}
      className={`
        flex items-center px-3 py-2 rounded transition-colors duration-200
        ${isActive ? activeClassName : inactiveClassName}
        ${className}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </Link>
  );
};
```

### 📦 Integración en el Navbar

```typescript
"use client";

import { ActiveLink } from "@/components/ActiveLink";

export const Navbar = () => {
  return (
    <nav className="flex bg-blue-800 bg-opacity-30 p-2 m-2 rounded">
      <div className="flex space-x-2">
        <ActiveLink path="/" text="Inicio" icon="🏠" />
        <ActiveLink path="/about" text="Acerca de" icon="ℹ️" />
        <ActiveLink path="/contact" text="Contacto" icon="📧" />
        <ActiveLink path="/services" text="Servicios" icon="⚙️" />
        <ActiveLink
          path="/blog"
          text="Blog"
          icon="📝"
          exact={false} // Activo para /blog, /blog/post-1, etc.
        />
      </div>
    </nav>
  );
};
```

### 🎯 Configuraciones avanzadas

#### **Matching exacto vs. parcial:**

```typescript
// Exacto: Solo activo en la ruta exacta
<ActiveLink path="/blog" text="Blog" exact={true} />
// Activo solo en: /blog

// Parcial: Activo en rutas que empiecen con el path
<ActiveLink path="/blog" text="Blog" exact={false} />
// Activo en: /blog, /blog/post-1, /blog/categoría/tech
```

#### **Estilos personalizados por contexto:**

```typescript
// Navbar principal
<ActiveLink
  path="/dashboard"
  text="Dashboard"
  activeClassName="bg-green-600 text-white"
  inactiveClassName="text-gray-300 hover:text-white"
/>

// Sidebar de administración
<ActiveLink
  path="/admin/users"
  text="Usuarios"
  activeClassName="border-l-4 border-blue-500 bg-gray-100 text-blue-700"
  inactiveClassName="text-gray-600 hover:bg-gray-50"
/>
```

### ⚡ Optimizaciones de rendimiento

#### **Componente optimizado con memo:**

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

interface Props {
  path: string;
  text: string;
  className?: string;
}

export const ActiveLink = memo(({ path, text, className = "" }: Props) => {
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <Link
      href={path}
      className={`
        px-3 py-2 rounded transition-colors duration-200
        ${
          isActive
            ? "bg-blue-600 text-white font-semibold"
            : "text-blue-100 hover:text-white hover:bg-blue-700"
        }
        ${className}
      `}
    >
      {text}
    </Link>
  );
});

ActiveLink.displayName = "ActiveLink";
```

### 🌟 Casos de uso comunes

#### **Breadcrumbs dinámicos:**

```typescript
"use client";

import { usePathname } from "next/navigation";
import { ActiveLink } from "@/components/ActiveLink";

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center space-x-2 text-sm">
      <ActiveLink path="/" text="Inicio" />
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;

        return (
          <div key={path} className="flex items-center">
            <span className="mx-2">/</span>
            {isLast ? (
              <span className="text-gray-500 capitalize">{segment}</span>
            ) : (
              <ActiveLink path={path} text={segment} className="capitalize" />
            )}
          </div>
        );
      })}
    </nav>
  );
};
```

#### **Tabs dinámicos:**

```typescript
"use client";

import { ActiveLink } from "@/components/ActiveLink";

export const ProfileTabs = () => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        <ActiveLink
          path="/profile"
          text="Perfil"
          activeClassName="border-b-2 border-blue-500 text-blue-600"
          inactiveClassName="text-gray-500 hover:text-gray-700"
        />
        <ActiveLink
          path="/profile/settings"
          text="Configuración"
          activeClassName="border-b-2 border-blue-500 text-blue-600"
          inactiveClassName="text-gray-500 hover:text-gray-700"
        />
        <ActiveLink
          path="/profile/security"
          text="Seguridad"
          activeClassName="border-b-2 border-blue-500 text-blue-600"
          inactiveClassName="text-gray-500 hover:text-gray-700"
        />
      </nav>
    </div>
  );
};
```

### 💡 Mejores prácticas

#### **✅ Recomendaciones:**

- 🎯 **Uso específico**: Solo aplicar estilos activos donde aporten valor
- 🎨 **Consistencia visual**: Mantener estilos coherentes en toda la aplicación
- ⚡ **Performance**: Usar `memo` para componentes que se renderizan frecuentemente
- 📱 **Responsividad**: Asegurar que los estilos funcionen en todos los dispositivos

#### **❌ Evitar:**

- 🚫 **Overengineering**: No complicar innecesariamente la lógica de matching
- 🎨 **Estilos excesivos**: Mantener feedback visual sutil pero efectivo
- 📱 **Ignorar móviles**: Los estilos activos son especialmente importantes en pantallas pequeñas

Esta implementación de ActiveLink proporciona una navegación profesional y contextual que mejora significativamente la experiencia del usuario al navegar por la aplicación.
