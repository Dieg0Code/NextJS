# ⚖️ Server Side Rendering y Client Side Rendering

En Next.js 13+, todo el contenido se renderiza **del lado del servidor (SSR)** por defecto, optimizando el rendimiento, la experiencia de usuario y el SEO. Sin embargo, también podemos usar **renderizado del lado del cliente (CSR)** cuando necesitamos interactividad.

## 📋 Temas de la sección

En esta sección exploraremos cómo combinar **Server Components** con estado manejado del lado del cliente:

1. 🎨 **Tailwind CSS**: Estructura de un Dashboard profesional
2. 🔄 **useState**: Manejo de estado en componentes
3. 💻 **"use client"**: Directiva para Client Components
4. 🔗 **Next Link**: Navegación optimizada
5. 🖼️ **Next Image**: Optimización de imágenes
6. 📁 **Estructura de proyecto**: Organización profesional
7. 🌐 **Imágenes externas**: Configuración de dominios permitidos

---

## 🚀 Proyecto de ejemplo

Trabajaremos con un proyecto llamado **my-dashboard** que demuestra estos conceptos:

```bash
npx create-next-app@latest my-dashboard
cd my-dashboard
```

**Configuración recomendada:**

- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ App Router

---

## 📝 Conceptos y componentes clave

### 🔄 Componente Redirect

Next.js proporciona una función `redirect` para redirigir usuarios a URLs específicas. Es útil para manejar rutas obsoletas o redirigir después de acciones como login.

```tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/dashboard/counter");
}
```

**Casos de uso:**

- 🏠 Redirigir desde la página raíz a una sección específica
- 🔐 Redirigir usuarios no autenticados
- 📱 Redirigir según el tipo de dispositivo

### 🎨 Tailwind CSS y componentes preconstruidos

**Tailwind CSS** es un framework CSS utility-first que permite crear interfaces modernas de forma rápida y eficiente.

#### **Ventajas principales:**

- ⚡ **Desarrollo rápido**: Clases utilitarias predefinidas
- 📱 **Diseño responsivo**: Fácil adaptación a diferentes pantallas
- 🎯 **Personalización**: Control granular sobre el diseño
- 📦 **Tamaño optimizado**: Solo incluye CSS que realmente usas

#### **Recursos útiles:**

- 🛠️ **[Tailwind Components](https://tailwindcomponents.com/)**: Componentes preconstruidos
- 🎨 **[Creative Tim](https://www.creative-tim.com/twcomponents/component/dashboard-navigation)**: Componentes para dashboards

### 🖼️ Componente Image optimizado

El componente `Image` de Next.js optimiza automáticamente las imágenes para mejor rendimiento:

```tsx
import Image from "next/image";

export default function MyImage() {
  return (
    <Image
      src="/path/to/image.jpg"
      alt="Descripción de la imagen"
      width={500}
      height={300}
    />
  );
}
```

#### **Beneficios del componente Image:**

- ⚡ **Carga optimizada**: Lazy loading automático
- 📱 **Responsive**: Adaptación automática a diferentes tamaños
- 🗜️ **Compresión**: Formatos modernos (WebP, AVIF)
- 🎯 **Mejor SEO**: Optimización automática de imágenes

#### **Configuración para imágenes externas:**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
```

**Seguridad:** Esta configuración previene la carga de imágenes desde dominios no autorizados.

### 🎯 Iconos con react-icons

**react-icons** proporciona acceso a múltiples bibliotecas de iconos:

```bash
npm install react-icons --save
```

```typescript
import { FaHome, FaUser, FaCog, FaShoppingCart } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

export default function MyIcons() {
  return (
    <div className="flex space-x-4">
      <FaHome className="text-2xl text-blue-500" />
      <FaUser className="text-2xl text-green-500" />
      <FaCog className="text-2xl text-gray-500" />
      <FaShoppingCart className="text-2xl text-red-500" />
    </div>
  );
}
```

**Bibliotecas disponibles:**

- 🅰️ **Font Awesome** (Fa)
- 🎨 **Material Design** (Md)
- 🔵 **Ionicons** (Io)
- 🎯 **Bootstrap Icons** (Bs)

---

## 🔄 Manejo de estado con useState

El hook `useState` permite crear componentes interactivos que respondan a acciones del usuario.

### 💻 Implementación básica

```tsx
"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4">
      <p className="text-xl mb-4">Contador: {count}</p>
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

### 📚 ¿Qué es un Hook?

Un **Hook** es una función que permite:

- 🔄 **Definir estado**: Almacenar valores que pueden cambiar
- ⚡ **Actualizar estado**: Funciones para modificar esos valores
- 🎯 **Reactividad**: Re-renderizar componentes cuando el estado cambia

#### **Hooks comunes:**

- **`useState`**: Manejo de estado local
- **`useEffect`**: Efectos secundarios y ciclo de vida
- **`useContext`**: Acceso al contexto global de la aplicación

---

## ⚠️ Problema: metadata en Client Components

Los Client Components **no pueden usar metadata** porque es una característica exclusiva de Server Components.

### ❌ Implementación problemática:

```tsx
// ❌ Esto NO funciona
"use client";
import { Metadata } from "next";
import { useState } from "react";

export const metadata: Metadata = {
  title: "Counter Page",
  description: "Un simple contador",
};

export default function CounterPage() {
  const [count, setCount] = useState(5);
  // ... resto del componente
}
```

### ✅ Solución: Separación de responsabilidades

#### **1. Crear el Client Component (solo la parte interactiva):**

```tsx
"use client";
import { useState } from "react";

export const CartCounter = () => {
  const [count, setCount] = useState(5);

  return (
    <>
      <span className="text-9xl">{count}</span>

      <div className="flex">
        <button
          onClick={() => setCount(count + 1)}
          className="flex items-center justify-center p-2 rounded-xl bg-gray-900 text-white hover:bg-gray-600 transition-all w-[100px] mr-2"
        >
          +1
        </button>
        <button
          onClick={() => setCount(count - 1)}
          className="flex items-center justify-center p-2 rounded-xl bg-gray-900 text-white hover:bg-gray-600 transition-all w-[100px] mr-2"
        >
          -1
        </button>
      </div>
    </>
  );
};
```

#### **2. Usar el componente en una página Server Component:**

```tsx
import { CartCounter } from "@/components/CartCounter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Un simple contador",
};

export default function CounterPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <span>Productos del carrito</span>
      <CartCounter />
    </div>
  );
}
```

---

## 🔄 Comunicación Server → Client con Props

Para pasar datos del servidor al cliente, utiliza **props**:

### 📥 Client Component con props:

```tsx
//CartCounter.tsx
"use client";
import { useState } from "react";

interface Props {
  value?: number;
}

export const CartCounter = ({ value = 0 }: Props) => {
  const [count, setCount] = useState(value);

  return (
    <>
      <span className="text-9xl">{count}</span>

      <div className="flex">
        <button
          onClick={() => setCount(count + 1)}
          className="flex items-center justify-center p-2 rounded-xl bg-gray-900 text-white hover:bg-gray-600 transition-all w-[100px] mr-2"
        >
          +1
        </button>
        <button
          onClick={() => setCount(count - 1)}
          className="flex items-center justify-center p-2 rounded-xl bg-gray-900 text-white hover:bg-gray-600 transition-all w-[100px] mr-2"
        >
          -1
        </button>
      </div>
    </>
  );
};
```

### 📤 Server Component pasando datos:

```tsx
// filepath: app/counter/page.tsx
import { CartCounter } from "@/components/CartCounter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Un simple contador",
};

export default function CounterPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <span>Productos del carrito</span>
      <CartCounter value={20} />
    </div>
  );
}
```

---

## 🚀 Arquitectura híbrida: Lo mejor de ambos mundos

Esta combinación de Server y Client Components es **extremadamente poderosa**:

### 🖥️ **Server Components pueden:**

- 🗄️ **Acceder a bases de datos** directamente
- 🔐 **Manejar lógica de autenticación** de forma segura
- 🌐 **Hacer llamadas a APIs** en el servidor
- 📊 **Procesar datos** antes de enviarlos al cliente

### 💻 **Client Components pueden:**

- 🖱️ **Manejar interacciones** del usuario
- 🔄 **Actualizar estado** dinámicamente
- 📱 **Usar APIs del navegador** (localStorage, geolocalización)
- ⚡ **Proporcionar feedback inmediato** sin recargas

### 🎯 **Resultado:**

- ✅ **Experiencia fluida**: Sin recargas innecesarias
- ✅ **Performance optimizada**: Menos JavaScript en el cliente
- ✅ **SEO mejorado**: Contenido pre-renderizado en el servidor
- ✅ **Interactividad rica**: Estado dinámico donde sea necesario

Esta arquitectura permite crear aplicaciones web modernas que combinan la eficiencia del renderizado del servidor con la interactividad del cliente, proporcionando la mejor experiencia posible para los usuarios.
