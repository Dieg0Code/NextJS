# 🌐 Estado Global - Redux y Local Storage

En Next.js, la gestión del **estado global** se puede realizar de varias maneras. Una de las más robustas es utilizando **Redux**, una biblioteca que permite manejar el estado de la aplicación de manera predecible y centralizada.

Next.js trabaja principalmente con **Server Components**, por lo que no siempre es necesario usar estado global. Sin embargo, cuando necesitamos crear **Client Components** que compartan datos entre sí, Redux es una excelente opción.

## 📋 Temas de la sección

Esta sección se enfoca en dos objetivos principales:

- 💖 **Manejo de Favoritos**: Sistema de favoritos persistente
- 💾 **LocalStorage + Server Components**: Sincronización cliente-servidor

> ⚠️ **Nota importante**: LocalStorage es una API del navegador y **NO está disponible en el servidor**. En aplicaciones reales con bases de datos y cookies, el manejo de LocalStorage no es necesario, ya que la información se almacena en el servidor. Esto es solo una demostración educativa.

---

## 🤔 ¿Qué es Redux y por qué usarlo?

### 🎯 Problema que resuelve

**❌ Sin Redux (Estado local):**

```
ComponenteA (favoritos) ←→ ComponenteB (contador) ←→ ComponenteC (lista)
     ↑                           ↑                         ↑
   useState                  useState                  useState

🚫 Cada componente maneja su propio estado
🚫 Difícil compartir datos entre componentes
🚫 Props drilling (pasar props a través de muchos niveles)
```

**✅ Con Redux (Estado global):**

```
                    🏪 REDUX STORE (Estado Global)
                           ↙️    ↓    ↘️
                ComponenteA  ComponenteB  ComponenteC
                (favoritos)  (contador)   (lista)

✅ Un solo lugar para el estado
✅ Cualquier componente puede acceder/modificar
✅ Cambios predecibles y controlados
```

### 💡 Conceptos fundamentales (explicados simple)

**🏪 Store (Tienda)**

- Es como un **gran almacén** que guarda TODA la información de tu app
- Solo hay UNA store por aplicación
- Todos los componentes pueden "comprar" datos de esta tienda

**🔄 Reducer (Cajero)**

- Es como el **cajero de la tienda**
- Recibe instrucciones (acciones) y actualiza el inventario (estado)
- Siempre sigue reglas específicas para cambiar el estado

**📝 Action (Nota de pedido)**

- Es como una **nota que le das al cajero**
- Describe QUÉ quieres hacer: "Agregar Pikachu a favoritos"
- Contiene la información necesaria para el cambio

**📤 Dispatch (Entregar la nota)**

- Es la acción de **entregar tu pedido al cajero**
- Envía la acción al reducer para que procese el cambio

**🔍 Selector (Consultar inventario)**

- Es como **preguntar qué hay en stock**
- Permite leer partes específicas del estado

### 🌰 Analogía completa: Redux como una cafetería

```
👤 Cliente (Componente) → 📝 Orden (Action) → 👨‍💼 Barista (Reducer) → ☕ Café (Nuevo Estado)
                                                        ↓
                                              📦 Inventario actualizado (Store)
```

---

## 🏗️ Configuración del proyecto

### 📁 Estructura inicial

Primero, creemos las pantallas necesarias:

```typescript
// app/dashboard/favorites/page.tsx
import { PokemonsGrid } from "@/pokemons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favoritos - Pokédex",
  description: "Gestión de Pokémon favoritos con estado global",
};

export default function FavoritesPage() {
  return (
    <div className="flex flex-col">
      <span className="text-5xl my-2">
        Pokémons Favoritos <small className="text-blue-500">Global State</small>
      </span>

      {/* Por ahora mostramos un array vacío, luego conectaremos Redux */}
      <PokemonsGrid pokemons={[]} />
    </div>
  );
}
```

### 🧭 Actualizar Sidebar

```typescript
// En tu componente Sidebar, agrega:
{
  path: "/dashboard/favorites",
  icon: <IoHeartOutline size={40} />,
  title: "Favoritos",
  subtitle: "Global State",
}
```

### 🏠 Dashboard principal con widget

```typescript
// app/dashboard/main/page.tsx
import { SimpleWidget } from "@/components";

export default function MainPage() {
  return (
    <div className="text-black p-2">
      <h1 className="mt-2 text-3xl">Dashboard</h1>
      <span className="text-xl">Información General</span>

      <div className="flex flex-wrap p-2 items-center justify-center">
        <SimpleWidget />
      </div>
    </div>
  );
}
```

### 🎨 Componente Widget

```typescript
// components/SimpleWidget.tsx
import { IoCafeOutline } from "react-icons/io5";

export const SimpleWidget = () => {
  return (
    <div className="bg-white shadow-xl p-3 sm:min-w-[25%] min-w-full rounded-2xl border border-gray-200 mx-2 my-2">
      <div className="flex flex-col">
        {/* Header */}
        <div>
          <h2 className="font-bold text-gray-600 text-center">Contador</h2>
        </div>

        {/* Content */}
        <div className="my-3">
          <div className="flex flex-row items-center justify-center space-x-3">
            <div className="flex-shrink-0">
              <IoCafeOutline size={50} className="text-blue-500" />
            </div>
            <div className="text-center">
              <h4 className="text-4xl font-bold text-gray-800">0</h4>
              <p className="text-xs text-gray-500">Pokémon favoritos</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full text-right border-t-2 border-gray-100 mt-2 pt-2">
          <a
            href="/dashboard/favorites"
            className="text-indigo-600 text-xs font-medium hover:text-indigo-800 transition-colors"
          >
            Ver todos →
          </a>
        </div>
      </div>
    </div>
  );
};
```

---

## ⚙️ Instalación y configuración de Redux Toolkit

### 📦 Instalación

[Redux Toolkit](https://redux-toolkit.js.org/) es la versión moderna y simplificada de Redux, creada por el mismo equipo. Elimina la complejidad del Redux tradicional.

```bash
npm install @reduxjs/toolkit react-redux
```

### 🏪 Configuración de la Store

```typescript
// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    // Aquí irán nuestros reducers
    // pokemons: pokemonsReducer,
    // counter: counterReducer,
  },
});

// 📘 Tipos de TypeScript para usar en toda la app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 📖 Glosario Redux (Diccionario completo)

**🏪 Store**

```typescript
// El "cerebro central" de tu aplicación
const store = configureStore({
  reducer: {
    /* todos tus reducers */
  },
});
```

**🔄 Reducer**

```typescript
// Función que dice CÓMO cambiar el estado
const pokemonReducer = (state, action) => {
  switch (action.type) {
    case "ADD_FAVORITE":
      return { ...state, favorites: [...state.favorites, action.pokemon] };
    default:
      return state;
  }
};
```

**📝 Action**

```typescript
// Objeto que describe QUÉ pasó
const action = {
  type: "ADD_FAVORITE",
  payload: { id: 1, name: "pikachu" },
};
```

**📤 Dispatch**

```typescript
// Función para "enviar" acciones
dispatch({ type: "ADD_FAVORITE", payload: pokemon });
```

**🔍 Selector**

```typescript
// Función para "leer" del estado
const favorites = useSelector((state) => state.pokemons.favorites);
```

**⚙️ Middleware**

```typescript
// Funciones que interceptan acciones (para logging, async, etc.)
const logger = (store) => (next) => (action) => {
  console.log("Dispatching:", action);
  return next(action);
};
```

**🔗 Slice (Redux Toolkit)**

```typescript
// Agrupa reducer + actions en un solo lugar
const pokemonSlice = createSlice({
  name: "pokemons",
  initialState: { favorites: [] },
  reducers: {
    addFavorite: (state, action) => {
      state.favorites.push(action.payload); // ¡Mutable gracias a Immer!
    },
  },
});
```

---

## 🎯 ¿Por qué Redux Toolkit en lugar de Redux tradicional?

### ❌ Redux tradicional (mucho código)

```typescript
// Action Types
const ADD_FAVORITE = "ADD_FAVORITE";
const REMOVE_FAVORITE = "REMOVE_FAVORITE";

// Action Creators
const addFavorite = (pokemon) => ({
  type: ADD_FAVORITE,
  payload: pokemon,
});

// Reducer
const pokemonReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_FAVORITE:
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    default:
      return state;
  }
};

// Store
const store = createStore(pokemonReducer);
```

### ✅ Redux Toolkit (código simple)

```typescript
// Todo en un Slice
const pokemonSlice = createSlice({
  name: "pokemons",
  initialState: { favorites: [] },
  reducers: {
    addFavorite: (state, action) => {
      state.favorites.push(action.payload); // ¡Parece mutable pero es inmutable!
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter((p) => p.id !== action.payload);
    },
  },
});

// Actions generadas automáticamente
export const { addFavorite, removeFavorite } = pokemonSlice.actions;
export default pokemonSlice.reducer;
```

### 🚀 Beneficios de Redux Toolkit

- ✅ **Menos código**: 70% menos boilerplate
- ✅ **Inmutabilidad automática**: Usando Immer por debajo
- ✅ **DevTools incluidas**: Debugging automático
- ✅ **TypeScript mejorado**: Mejor tipado por defecto
- ✅ **Configuración predeterminada**: Buenas prácticas incluidas

---

## 🔧 Cómo usar Redux Toolkit en Next.js

### 1️⃣ Crear un componente Providers

```typescript
// src/store/Providers.tsx
"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from ".";

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>;
};
```

> ⚠️ **Importante**: Este componente DEBE ser un Client Component (`"use client"`) porque Redux funciona en el lado del cliente.

### 2️⃣ Envolver el Root Layout con el Provider

```typescript
// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/store/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js + Redux",
  description: "Aplicación con estado global usando Redux Toolkit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 3️⃣ Crear un Slice

```typescript
// src/store/counter/counterSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  count: number;
  isReady: boolean;
}

const initialState: CounterState = {
  count: 5,
  isReady: false,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    // Inicializar estado desde props o API
    initCounterState(state, action) {
      if (state.isReady) return;
      state.count = action.payload;
      state.isReady = true;
    },

    addOne(state) {
      state.count++;
    },

    subtractOne(state) {
      if (state.count === 0) return;
      state.count--;
    },

    resetCount(state, action) {
      if (action.payload < 0) action.payload = 0;
      state.count = action.payload;
    },
  },
});

export const { initCounterState, addOne, subtractOne, resetCount } =
  counterSlice.actions;

export default counterSlice.reducer;
```

### 4️⃣ Conectar el Slice a la Store

```typescript
// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import counterReducer from "./counter/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

// 📘 Tipos de TypeScript para toda la aplicación
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 🎯 Hooks tipados para usar en componentes
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

---

## 🧮 Implementando el Counter con Redux

### 💻 Componente CartCounter

```typescript
// src/shopping-cart/components/CartCounter.tsx
"use client";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addOne,
  subtractOne,
  initCounterState,
} from "@/store/counter/counterSlice";
import { useEffect } from "react";

interface Props {
  value?: number;
}

export const CartCounter = ({ value = 0 }: Props) => {
  const { count, isReady } = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();

  // 🔄 Sincronizar estado inicial desde props
  useEffect(() => {
    dispatch(initCounterState(value));
  }, [dispatch, value]);

  // ⏳ Mostrar loading mientras se inicializa
  if (!isReady) {
    return (
      <div className="flex flex-col items-center">
        <div className="animate-pulse">
          <div className="h-24 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="flex space-x-2">
            <div className="h-12 w-24 bg-gray-200 rounded"></div>
            <div className="h-12 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <span className="text-9xl font-bold text-gray-800">{count}</span>

      <div className="flex space-x-2">
        <button
          onClick={() => dispatch(subtractOne())}
          className="flex items-center justify-center p-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all w-[100px] font-semibold"
          disabled={count <= 0}
        >
          -1
        </button>
        <button
          onClick={() => dispatch(addOne())}
          className="flex items-center justify-center p-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all w-[100px] font-semibold"
        >
          +1
        </button>
      </div>
    </div>
  );
};
```

### 📄 Página del Counter

```typescript
// app/dashboard/counter/page.tsx
import { CartCounter } from "@/shopping-cart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart - Contador",
  description: "Contador de productos con estado global Redux",
};

export default function CounterPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🛒 Carrito de Compras
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Productos en el carrito
        </p>
        <CartCounter value={20} />
      </div>
    </div>
  );
}
```

---

## 🌐 RESTful API - Endpoints en Next.js

### 📡 Crear API Routes

A partir de Next.js 13+ con App Router, podemos crear endpoints REST desde cualquier carpeta dentro de `app` usando el archivo `route.ts`:

```typescript
// app/api/counter/route.ts
import { NextResponse } from "next/server";

// 📊 Simulamos una base de datos
let counterValue = 100;

export async function GET(request: Request) {
  console.log("📡 GET /api/counter - Solicitando contador");

  return NextResponse.json({
    method: request.method,
    count: counterValue,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const { action, amount = 1 } = await request.json();

    console.log("📡 POST /api/counter - Acción:", action);

    switch (action) {
      case "increment":
        counterValue += amount;
        break;
      case "decrement":
        counterValue = Math.max(0, counterValue - amount);
        break;
      case "reset":
        counterValue = amount;
        break;
      default:
        return NextResponse.json(
          { error: "Acción no válida" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      method: request.method,
      action,
      count: counterValue,
      message: "Contador actualizado correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar la petición" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { count } = await request.json();

    if (typeof count !== "number" || count < 0) {
      return NextResponse.json(
        { error: "El valor debe ser un número positivo" },
        { status: 400 }
      );
    }

    counterValue = count;

    return NextResponse.json({
      method: request.method,
      count: counterValue,
      message: "Contador establecido correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al establecer el contador" },
      { status: 500 }
    );
  }
}
```

### 🔧 Reglas importantes para API Routes

1. **📁 Nombre del archivo**: Debe ser exactamente `route.ts` o `route.js`
2. **🚫 Conflictos**: No puede coexistir con `page.tsx` en la misma carpeta
3. **📝 Métodos HTTP**: Los nombres de función deben ser exactos: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
4. **❌ 405 Error**: Métodos no implementados retornan Method Not Allowed
5. **📤 Respuestas**: Siempre usar `NextResponse.json()` para responses

---

## 🔄 Integración API + Redux

### 🏭 Servicio de API

```typescript
// src/services/counterApi.ts
export interface CounterResponse {
  method: string;
  count: number;
  timestamp?: string;
  message?: string;
}

export interface CounterUpdateRequest {
  action: "increment" | "decrement" | "reset";
  amount?: number;
}

class CounterApi {
  private baseUrl = "/api/counter";

  async getCounter(): Promise<CounterResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error al obtener contador:", error);
      throw error;
    }
  }

  async updateCounter(data: CounterUpdateRequest): Promise<CounterResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error al actualizar contador:", error);
      throw error;
    }
  }

  async setCounter(count: number): Promise<CounterResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error al establecer contador:", error);
      throw error;
    }
  }
}

export const counterApi = new CounterApi();
```

### 🔄 Componente con API Integration

```typescript
// src/shopping-cart/components/CartCounter.tsx
"use client";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addOne,
  subtractOne,
  initCounterState,
} from "@/store/counter/counterSlice";
import { counterApi, type CounterResponse } from "@/services/counterApi";
import { useEffect, useState } from "react";

interface Props {
  value?: number;
}

export const CartCounter = ({ value = 0 }: Props) => {
  const { count, isReady } = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🌐 Cargar contador inicial desde API
  useEffect(() => {
    const loadInitialCounter = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await counterApi.getCounter();
        dispatch(initCounterState(response.count));

        console.log("✅ Contador cargado desde API:", response.count);
      } catch (error) {
        console.error("❌ Error al cargar contador:", error);
        setError("Error al cargar el contador");
        // Fallback al valor de prop
        dispatch(initCounterState(value));
      } finally {
        setLoading(false);
      }
    };

    loadInitialCounter();
  }, [dispatch, value]);

  // 🎨 Loading state
  if (loading || !isReady) {
    return (
      <div className="flex flex-col items-center">
        <div className="animate-pulse">
          <div className="h-24 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="flex space-x-2">
            <div className="h-12 w-24 bg-gray-200 rounded"></div>
            <div className="h-12 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Cargando contador...</p>
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="flex flex-col items-center text-red-600">
        <p className="text-lg font-semibold">⚠️ {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <span className="text-9xl font-bold text-gray-800">{count}</span>
        <p className="text-sm text-gray-500">Sincronizado con servidor</p>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => dispatch(subtractOne())}
          className="flex items-center justify-center p-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all w-[100px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={count <= 0}
        >
          -1
        </button>
        <button
          onClick={() => dispatch(addOne())}
          className="flex items-center justify-center p-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all w-[100px] font-semibold"
        >
          +1
        </button>
      </div>
    </div>
  );
};
```

---

## 🎯 Beneficios de esta arquitectura

### ✅ Ventajas obtenidas

1. **🔄 Estado Predecible**: Redux garantiza cambios controlados
2. **🌐 Sincronización API**: Datos consistentes entre cliente y servidor
3. **⚡ Experiencia de Usuario**: Loading states y error handling
4. **🔧 Escalabilidad**: Fácil agregar nuevos slices y features
5. **🐛 Debugging**: Redux DevTools para inspeccionar cambios
6. **📱 Responsive**: Estados que persisten entre navegación

### 🎮 Patrones aplicados

- **📦 Container/Presentation**: Separación de lógica y UI
- **🔄 Unidirectional Data Flow**: Flujo de datos predecible
- **🏭 Service Layer**: APIs centralizadas y reutilizables
- **🛡️ Error Boundaries**: Manejo graceful de errores
- **⏳ Loading States**: Feedback visual para el usuario

Con esta configuración completa, tienes una base sólida para aplicaciones Next.js con estado global robusto y sincronización con APIs. ¡La combinación de Redux Toolkit + Next.js es muy potente! 🚀
