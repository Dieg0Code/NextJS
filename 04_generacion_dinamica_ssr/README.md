# 🔄 Generación Dinámica de Contenido en SSR

Next.js 13+ es por defecto un **framework de renderizado del lado del servidor (SSR)**. Esto significa que el código React se compila en el servidor y el cliente recibe HTML ya generado. Además, Next.js permite generar contenido del lado del cliente con funcionalidades como `"use client"` para usar estados y efectos de React.

La **arquitectura híbrida** es una de las características más potentes de Next.js: componentes que se envían listos desde el servidor conviven con componentes que manejan estados e interactúan con el usuario en la misma aplicación.

## 📋 Temas de la sección

- 🏷️ **Metadata dinámica**: Generación automática de metadatos
- 🖥️ **Páginas SSR**: Static Site Generation optimizada
- ❌ **Páginas de error**: Manejo personalizado de errores
- ✅ **Validación de argumentos**: Verificación de parámetros URL
- 🔀 **Redirecciones**: Control de flujo de navegación
- 🖼️ **Prioridad de imágenes**: Optimización de carga
- 🔄 **Revalidación**: Estrategias de actualización de datos
- 🎨 **Estructuras Tailwind**: Componentes responsivos

---

## 📊 Data Fetching - Obtención de datos

[Data Fetching](https://nextjs.org/docs/app/getting-started/fetching-data) es el mecanismo que Next.js utiliza para obtener datos del servidor, construido sobre la **API Fetch nativa** que permite obtener datos de forma asíncrona.

### 💾 Sistema de caché automático

**Comportamiento por defecto:** Cada petición con Fetch se agrega automáticamente a un caché inteligente.

```typescript
async function getComments() {
  const res = await fetch("https://..."); // ✅ Resultado agregado al caché
  return res.json();
}

const comments1 = await getComments(); // 🌐 Petición HTTP real
const comments2 = await getComments(); // ⚡ Datos obtenidos del caché
```

**Beneficios del caché:**

- ⚡ **Mejor rendimiento**: Evita peticiones innecesarias
- 🌐 **Reducción de latencia**: Respuestas instantáneas desde caché
- 💰 **Menor costo**: Reduce llamadas a APIs externas
- 🔋 **Mejor UX**: Carga más rápida para el usuario

### 🔄 Revalidación de datos

Permite actualizar datos en intervalos específicos sin perder los beneficios del caché:

```typescript
fetch("https://...", {
  next: {
    revalidate: 10, // Revalida cada 10 segundos
  },
});
```

**Funcionamiento:**

- 📅 Los datos se almacenan en caché durante el tiempo especificado
- ⏰ Al cumplirse el tiempo, Next.js hace una nueva petición
- 🔄 El caché se actualiza con los nuevos datos

### 🚀 Dynamic Data Fetching

Para datos que cambian constantemente, usa `cache: "no-store"`:

```typescript
fetch("https://...", {
  cache: "no-store", // 🔄 Siempre datos frescos
});
```

**Casos de uso:**

- 📊 **Dashboards en tiempo real**: Datos financieros, analíticas
- 💬 **Chats y mensajería**: Conversaciones actualizadas
- 🛒 **Inventarios**: Stock de productos en tiempo real

### ⚙️ Configuración sin Fetch API

Para el mismo comportamiento sin usar Fetch, exporta constantes en el archivo de página:

```typescript
export const revalidate = 10; // Revalida cada 10 segundos
export const dynamic = "force-dynamic"; // Fuerza revalidación en cada petición
```

> ⚠️ **Importante:** Esta configuración solo funciona en Server Components (SSR).

---

## 🐾 Integración con PokeAPI

Utilizaremos la [PokeAPI](https://pokeapi.co/) como ejemplo práctico para demostrar el data fetching:

```typescript
const getPokemons = async (limit = 20, offset = 0) => {
  const data = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  ).then((res) => res.json());

  return data;
};

export default async function PokemonsPage() {
  const pokemons = await getPokemons();

  return <div>{JSON.stringify(pokemons)}</div>;
}
```

### 🏷️ Tipado con TypeScript

Para aprovechar las ventajas de TypeScript, definimos interfaces para la respuesta de la API:

```typescript
export interface PokemonResponse {
  count: number;
  next: string;
  previous: string;
  results: Result[];
}

export interface Result {
  name: string;
  url: string;
}

export interface SimplePokemon {
  id: string;
  name: string;
}
```

### 🖼️ Implementación con imágenes optimizadas

```typescript
import { PokemonResponse, SimplePokemon } from "@/pokemons";
import Image from "next/image";

const getPokemons = async (
  limit = 20,
  offset = 0
): Promise<SimplePokemon[]> => {
  const data: PokemonResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  ).then((res) => res.json());

  const pokemons = data.results.map((pokemon) => ({
    id: pokemon.url.split("/").at(-2)!,
    name: pokemon.name,
  }));

  return pokemons;
};

export default async function PokemonsPage() {
  const pokemons = await getPokemons(151);

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-10 items-center justify-center">
        {pokemons.map((pokemon) => (
          <Image
            key={pokemon.id}
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
            width={100}
            height={100}
            alt={pokemon.name}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 🧩 Arquitectura de componentes modulares

### 🃏 Componente PokemonCard

Utilizamos un [componente de Tailwind](https://www.creative-tim.com/twcomponents/component/user-card-7) adaptado para mostrar información de cada Pokémon:

```typescript
import Link from "next/link";
import { SimplePokemon } from "../interfaces/simple-pokemon";
import Image from "next/image";
import { IoHeartOutline } from "react-icons/io5";

interface Props {
  pokemon: SimplePokemon;
}

export const PokemonCard = ({ pokemon }: Props) => {
  const { id, name } = pokemon;

  return (
    <div className="mx-auto right-0 mt-2 w-60">
      <div className="flex flex-col bg-white rounded overflow-hidden shadow-lg">
        <div className="flex flex-col items-center justify-center text-center p-6 bg-gray-800 border-b">
          <Image
            key={pokemon.id}
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
            width={100}
            height={100}
            alt={pokemon.name}
            priority={false}
          />
          <p className="pt-2 text-lg font-semibold text-gray-50 capitalize">
            {name}
          </p>
          <div className="mt-5">
            <Link
              href={`/dashboard/pokemon/${id}`}
              className="border rounded-full py-2 px-4 text-xs font-semibold text-gray-100"
            >
              Más información
            </Link>
          </div>
        </div>
        <div className="border-b">
          <Link
            href="/dashboard/main"
            className="px-4 py-2 hover:bg-gray-100 flex items-center"
          >
            <div className="text-green-600"></div>
            <IoHeartOutline className="text-red-600" />
            <div className="pl-3">
              <p className="text-sm font-medium text-gray-800 leading-none">
                No es favorito
              </p>
              <p className="text-xs text-gray-500">Gestionar favoritos</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
```

### 📋 Componente PokemonsGrid

Agrupa y organiza las tarjetas de Pokémon:

```typescript
import { SimplePokemon } from "../interfaces/simple-pokemon";
import { PokemonCard } from "./PokemonCard";

interface Props {
  pokemons: SimplePokemon[];
}

export const PokemonsGrid = ({ pokemons }: Props) => {
  return (
    <div className="flex flex-wrap gap-10 items-center justify-center">
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};
```

### 🏠 Página principal implementada

```typescript
import { PokemonResponse, PokemonsGrid, SimplePokemon } from "@/pokemons";

const getPokemons = async (
  limit = 20,
  offset = 0
): Promise<SimplePokemon[]> => {
  const data: PokemonResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  ).then((res) => res.json());

  const pokemons = data.results.map((pokemon) => ({
    id: pokemon.url.split("/").at(-2)!,
    name: pokemon.name,
  }));

  return pokemons;
};

export default async function PokemonsPage() {
  const pokemons = await getPokemons(151);

  return (
    <div className="flex flex-col">
      <span className="text-5xl my-2">
        Listado de Pokémons{" "}
        <small className="text-base text-gray-500">estático</small>
      </span>

      <PokemonsGrid pokemons={pokemons} />
    </div>
  );
}
```

---

## 🖼️ Optimización de carga de imágenes

### ⚡ Lazy Loading con Image Priority

Actualmente cargamos 151 imágenes simultáneamente, desperdiciando recursos. La estrategia **lazy loading** carga imágenes solo cuando son visibles.

```typescript
<Image
  key={pokemon.id}
  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
  width={100}
  height={100}
  alt={pokemon.name}
  priority={false} // ⚡ Habilita lazy loading
/>
```

**Beneficios del lazy loading:**

- 🚀 **Carga inicial más rápida**: Solo imágenes visibles
- 💾 **Menor uso de ancho de banda**: Descarga progresiva
- 📱 **Mejor rendimiento móvil**: Especialmente importante en conexiones lentas
- 🔍 **SEO mejorado**: Mejores métricas de Core Web Vitals

---

## ❌ Manejo de errores personalizados

Next.js permite [crear páginas de error](https://nextjs.org/docs/app/getting-started/error-handling) personalizadas mediante el archivo `error.tsx`:

```typescript
"use client"; // ⚠️ Error boundaries deben ser Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registrar error en servicio de monitoreo
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold text-red-600 mb-4">¡Algo salió mal!</h2>
      <button
        onClick={() => reset()}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Intentar nuevamente
      </button>
    </div>
  );
}
```

**Ubicación del archivo:**

- 📁 `app/error.tsx`: Error global para toda la aplicación
- 📁 `app/dashboard/error.tsx`: Solo para rutas de dashboard
- 📁 `app/pokemon/error.tsx`: Solo para rutas de Pokémon

---

## 🛣️ Rutas dinámicas y parámetros URL

Para crear páginas individuales de Pokémon, necesitamos **rutas dinámicas** usando la sintaxis `[parámetro]`:

### 📂 Estructura de archivos

```
app/dashboard/pokemon/[id]/page.tsx
```

### 🔧 Implementación básica

```typescript
interface Props {
  params: {
    id: string;
  };
}

export default function PokemonPage({ params }: Props) {
  return (
    <div>
      <h1>Pokemon {params.id}</h1>
    </div>
  );
}
```

### 📊 Props automáticas disponibles

Next.js pasa automáticamente estas props a las páginas:

```typescript
{
  params: {
    id: "150" // Parámetro de ruta dinámica
  },
  searchParams: {
    limit: "10",    // De ?limit=10
    offset: "0"     // De &offset=0
  }
}
```

**Ejemplos de URLs:**

- `/pokemon/150` → `params.id = "150"`
- `/pokemon/150?limit=10&offset=0` → `searchParams = { limit: "10", offset: "0" }`

### 🔍 Carga de datos específicos

```typescript
import { Pokemon } from "@/pokemons";

interface Props {
  params: {
    id: string;
  };
}

const getPokemon = async (id: string): Promise<Pokemon> => {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
    cache: "force-cache",
  }).then((resp) => resp.json());

  return pokemon;
};

export default async function PokemonPage({ params }: Props) {
  const pokemon = await getPokemon(params.id);

  return (
    <div>
      <h1>Pokemon {params.id}</h1>
      <div>{JSON.stringify(pokemon)}</div>
    </div>
  );
}
```

---

## 🏷️ Metadata dinámica

Para páginas dinámicas, generamos metadata específica para cada Pokémon:

```typescript
import { Pokemon } from "@/pokemons";
import { Metadata } from "next";

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id, name } = await getPokemon(params.id);

    return {
      title: `#${id} - ${name}`,
      description: `Información detallada del Pokémon ${name}`,
      keywords: [`pokemon`, name, `#${id}`, "pokedex"],
    };
  } catch {
    return {
      title: "Pokémon no encontrado",
      description: "El Pokémon solicitado no existe",
    };
  }
}

const getPokemon = async (id: string): Promise<Pokemon> => {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
    cache: "force-cache",
  }).then((resp) => resp.json());

  return pokemon;
};

export default async function PokemonPage({ params }: Props) {
  const pokemon = await getPokemon(params.id);

  return (
    <div>
      <h1>
        #{pokemon.id} - {pokemon.name}
      </h1>
      <div>{pokemon.name}</div>
    </div>
  );
}
```

**Beneficios de metadata dinámica:**

- 🔍 **SEO optimizado**: Títulos únicos para cada página
- 📱 **Mejor compartir**: Enlaces sociales con información específica
- 🎯 **Indexación precisa**: Motores de búsqueda entienden cada página

---

## 🎨 Interfaz de usuario completa

Implementación de una [página de perfil](https://www.creative-tim.com/twcomponents/component/profile-information-card-horizon-ui-tailwind) adaptada para Pokémon:

```typescript
export default async function PokemonPage({ params }: Props) {
  const pokemon = await getPokemon(params.id);

  return (
    <div className="flex mt-5 flex-col items-center text-slate-800">
      <div className="relative flex flex-col items-center rounded-[20px] w-[700px] mx-auto bg-white bg-clip-border shadow-lg p-3">
        {/* Encabezado */}
        <div className="mt-2 mb-8 w-full">
          <h1 className="px-2 text-xl font-bold text-slate-700 capitalize">
            #{pokemon.id} {pokemon.name}
          </h1>

          <div className="flex flex-col justify-center items-center">
            <Image
              src={pokemon.sprites.other?.dream_world.front_default ?? ""}
              width={150}
              height={150}
              alt={`Imagen del pokemon ${pokemon.name}`}
              className="mb-5"
            />

            {/* Movimientos limitados */}
            <div className="flex flex-wrap">
              {pokemon.moves.slice(0, 8).map((move) => (
                <span
                  key={move.move.name}
                  className="mr-2 mb-2 capitalize bg-gray-100 px-2 py-1 rounded text-sm"
                >
                  {move.move.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de información */}
        <div className="grid grid-cols-2 gap-4 px-2 w-full">
          {/* Tipos */}
          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 drop-shadow-lg">
            <p className="text-sm text-gray-600">Tipos</p>
            <div className="text-base font-medium text-navy-700 flex">
              {pokemon.types.map((type) => (
                <span
                  key={type.slot}
                  className="mr-2 capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded"
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>

          {/* Peso */}
          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 drop-shadow-lg">
            <p className="text-sm text-gray-600">Peso</p>
            <span className="text-base font-medium text-navy-700">
              {pokemon.weight / 10} kg
            </span>
          </div>

          {/* Sprites normales */}
          <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 drop-shadow-lg">
            <p className="text-sm text-gray-600">Sprites Normales</p>
            <div className="flex justify-center space-x-2">
              {pokemon.sprites.front_default && (
                <Image
                  src={pokemon.sprites.front_default}
                  width={100}
                  height={100}
                  alt={`sprite frontal ${pokemon.name}`}
                />
              )}
              {pokemon.sprites.back_default && (
                <Image
                  src={pokemon.sprites.back_default}
                  width={100}
                  height={100}
                  alt={`sprite trasero ${pokemon.name}`}
                />
              )}
            </div>
          </div>

          {/* Sprites shiny */}
          <div className="flex flex-col justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 drop-shadow-lg">
            <p className="text-sm text-gray-600">Sprites Shiny</p>
            <div className="flex justify-center space-x-2">
              {pokemon.sprites.front_shiny && (
                <Image
                  src={pokemon.sprites.front_shiny}
                  width={100}
                  height={100}
                  alt={`sprite shiny frontal ${pokemon.name}`}
                />
              )}
              {pokemon.sprites.back_shiny && (
                <Image
                  src={pokemon.sprites.back_shiny}
                  width={100}
                  height={100}
                  alt={`sprite shiny trasero ${pokemon.name}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 🌐 Configuración de imágenes externas

Para permitir imágenes desde GitHub (PokeAPI sprites):

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
        hostname: "raw.githubusercontent.com", // 🐾 Sprites de PokeAPI
      },
    ],
  },
};

export default nextConfig;
```

---

## 🔍 Debugging con Breakpoints

Los **breakpoints** son herramientas profesionales para depuración que superan a los `console.log` tradicionales.

### 🎯 ¿Qué son los breakpoints?

Los breakpoints permiten:

- ⏸️ **Pausar ejecución**: En puntos específicos del código
- 🔍 **Inspeccionar variables**: Ver estado en tiempo real
- 📊 **Analizar stack trace**: Entender el flujo de ejecución
- ⚡ **Ejecución paso a paso**: Control granular del programa

### 🛠️ Configuración en VS Code

#### **1. Establecer breakpoint:**

- 🖱️ **Click en el margen izquierdo** del editor de código
- 🔴 **Punto rojo indica** breakpoint activo

#### **2. Iniciar debugging:**

- `Ctrl + Shift + P` (Windows/Linux) o `Cmd + Shift + P` (Mac)
- Escribir: `Debug: Start Debugging`
- Seleccionar: `dev` para modo desarrollo

#### **3. Controles de debugging:**

- ▶️ **Continue**: Continuar hasta el siguiente breakpoint
- ⏭️ **Step Over**: Ejecutar línea actual
- ⬇️ **Step Into**: Entrar en funciones
- ⬆️ **Step Out**: Salir de función actual

### 💡 Ventajas sobre console.log

- 🎯 **Control total**: Pausar exactamente donde necesitas
- 📊 **Vista completa**: Variables, scope, call stack
- ⚡ **Sin modificar código**: No necesitas agregar logs
- 🔄 **Debugging interactivo**: Ejecutar comandos en tiempo real

---

## 📄 Página 404 personalizada

Next.js permite crear [páginas 404 personalizadas](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) mediante el archivo `not-found.tsx`:

### 🎨 Implementación personalizada

```typescript
import { Sidebar } from "@/components";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-slate-100 overflow-y-scroll w-screen h-screen antialiased text-slate-300 selection:bg-blue-600 selection:text-white">
      <div className="flex">
        <Sidebar />

        <div className="w-full text-slate-900">
          <main className="h-screen w-full flex flex-col justify-center items-center bg-[#1A2238]">
            <h1 className="text-9xl font-extrabold text-white tracking-widest">
              404
            </h1>
            <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">
              Página no encontrada
            </div>
            <button className="mt-5">
              <div className="relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none focus:ring">
                <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"></span>
                <span className="relative block px-8 py-3 bg-[#1A2238] border border-current">
                  <Link href="/dashboard/main">Volver al inicio</Link>
                </span>
              </div>
            </button>
          </main>
        </div>
      </div>
    </div>
  );
}
```

### 🛡️ Validación y redirección automática

Para validar IDs de Pokémon y redirigir automáticamente a 404:

```typescript
import { notFound } from "next/navigation";

const getPokemon = async (id: string): Promise<Pokemon> => {
  try {
    const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
      cache: "force-cache",
    }).then((resp) => {
      if (!resp.ok) {
        throw new Error(`Pokemon ${id} not found`);
      }
      return resp.json();
    });

    console.log("Pokémon cargado:", pokemon.name);
    return pokemon;
  } catch (error) {
    console.error("Error al obtener el Pokémon:", error);
    notFound(); // 🔄 Redirige automáticamente a 404
  }
};
```

### 📁 Ubicaciones de páginas 404

- 📁 `app/not-found.tsx`: 404 global para toda la aplicación
- 📁 `app/dashboard/not-found.tsx`: Solo para rutas de dashboard
- 📁 `app/pokemon/not-found.tsx`: Solo para rutas de Pokémon

Esta arquitectura completa proporciona una base sólida para aplicaciones Next.js profesionales con manejo robusto de datos, errores y optimizaciones de rendimiento.
