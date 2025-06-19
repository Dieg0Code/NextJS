# Generación dinámica de contenido en SSR

NextJs desde la versión 13+ es por defecto un framework de renderizado del lado del servidor (SSR). Esto significa que todo el código de React que escribimos se compila en el servidor y el cliente solo recibe el HTML generado. Next tiene también formas de generar contenido que se renderiza del lado del cliente, con funcionalidades como "use client", que nos permiten usar estados y efectos de React.

Que Next posea estas dos formas de renderizar contenido no significa que tengamos que usar solo una o la otra. Podemos mezclar el uso de ambas, de hecho, es una de las características de mas potentes de Next. Por un lado tenemos componentes que se envían listos desde el servidor, y por otro lado componentes que pueden manejar estados e interactuar con el usuario conviviendo en la misma aplicación.

## Temas de la sección

- Manejo de Metadata dinámica
- Páginas generadas del lado del servidor - SGR
- Páginas de errores
- Validación de argumentos
- Redirecciones
- Prioridad de carga de imágenes
- Tipos de revalidación de Fetch y sin Fetch
- Estructuras HTML con Tailwind
- Entre otras cosas

### Data Fetching

[Data Fetching](https://nextjs.org/docs/app/getting-started/fetching-data) es la forma en que NextJS obtiene datos del servidor, está construido sobre la API Fetch, y nos permite obtener datos de forma asíncrona.

Cada petición que se hace con Fetch son agregados a un cache, esto quiere decir que cuando hacemos esa misma petición nuevamente, NextJS no vuelve a hacer la petición al servidor, sino que obtiene los datos del cache. Esto es muy útil para mejorar el rendimiento de la aplicación y evitar peticiones innecesarias al servidor.

```typescript
async function getComments() {
  const res = await fetch("https://..."); // El resultado es agregado al cache
  return res.json();

  const comments = await getComments(); // Esta petición se ejecuta normalmente

  const comments = await getComments(); // Esta petición obtiene los datos del cache
}
```

Esto es el comportamiento por defecto, sin embargo podemos modificarlo. Por ejemplo, tenemos la opción de hacer una revalidación. Esta funcionalidad permite por ejemplo, volver a hacer la petición al servidor cada cierto tiempo, o incluso forzar una revalidación en un momento determinado.

```typescript
fetch("https://...", {
  next: {
    revalidate: 10, // Revalida cada 10 segundos
  },
});
```

La revalidación funciona almacenando en cache los datos obtenidos de la petición durante el intervalo de tiempo especificado, es decir, si especificamos 10 segundos, NextJs almacena los datos en cache durante 10 segundos, y luego vuelve a hacer la petición al servidor para obtener los datos actualizados.

#### Dynamic Data Fetching

Para obtener data fresca en cada petición, podemos usar la opción `cache: "no-store"` en la función Fetch. Esto significa que NextJS no almacenará los datos en cache y siempre hará una petición al servidor para obtener los datos más recientes.

```typescript
fetch("https://...", {
  cache: "no-store", // No almacena los datos en cache
});
```

#### Sin Fetch API

Si no queremos usar la API Fetch de NextJs, podemos obtener el mismo comportamiento exportando constantes como por ejemplo `revalidate` o `dynamic` en el archivo de la página. Esto nos permite definir cómo se comporta la página en términos de revalidación y dinámica.

```typescript
export const revalidate = 10; // Revalida cada 10 segundos
export const dynamic = "force-dynamic"; // Fuerza la revalidación en cada petición
```

Esto solo funciona en SSR.

### PokeAPI

Para este ejemplo vamos a usar la [PokeAPI](https://pokeapi.co/) para obtener datos desde una API externa.

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

### Asignar tipo de datos y mostrar imágenes

Para aprovechar las ventajas de TypeScript, podemos definir tipos de datos para capturar la respuesta de la PokeAPI. Esto nos permite tener una mejor experiencia de desarrollo y evitar errores en tiempo de ejecución.

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
```

```typescript
export interface SimplePokemon {
  id: string;
  name: string;
}
```

Con estas interfaces, definimos la estructura de datos que esperamos recibir de la PokeAPI. Luego, podemos usar estas interfaces para tipar las respuestas de nuestras funciones Fetch.

```typescript
import { PokemonResponse, SimplePokemon } from "@/app/pokemons";
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

### Pensemos en componentes pequeños

Para mostrar cada uno de los pokémons vamos a usar [este componente](https://www.creative-tim.com/twcomponents/component/user-card-7) de Tailwind.

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
          />
          <p className="pt-2 text-lg font-semibold text-gray-50 capitalize">
            {name}
          </p>
          <div className="mt-5">
            <Link
              href={`dashboard/pokemon/${id}`}
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
              <p className="text-xs text-gray-500">View your campaigns</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
```

Estas tarjetas van a renderizar la información de cada pokémon, y las vamos a usar en la página principal de pokémons mediante un componente que las agrupe.

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

```typescript
import { PokemonResponse, PokemonsGrid, SimplePokemon } from "@/app/pokemons";

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
        Listado de Pokémons <small>estático</small>
      </span>

      <PokemonsGrid pokemons={pokemons} />
    </div>
  );
}
```

### Image Priority - Prioridad de carga de imágenes

Ahora mismo estamos cargando las 151 imágenes de los pokémons, pero puede que el usuario ni vea todas las imágenes, entonces estamos desperdiciando recursos. Para optimizar esto, podemos uar una estrategia llamada **lazy loading**. Esto significa que las imágenes se cargarán solo cuando el usuario las vea en pantalla.

Para implementar esto, podemos usar la propiedad [`priority`](https://nextjs.org/docs/app/api-reference/components/image#priority) del componente `Image` de NextJS. Esto le indica a NextJS si esta imagen es importante o no, y si debe cargarse inmediatamente o de manera diferida. Por defecto el `priority` es `true`, pero podemos establecerlo en `false` para que las imágenes se carguen de forma diferida.

```typescript
<Image
  key={pokemon.id}
  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
  width={100}
  height={100}
  alt={pokemon.name}
  priority={false}
/>
```

Con solo esta configuración, NextJS se encargará de cargar las imágenes a medida que el usuario las va viendo en pantalla, no las carga todas de una vez. Esto mejora el rendimiento de la aplicación, mejora el SEO y la experiencia del usuario.

### Next - Error Pages

NextJS nos permite [manejar errores](https://nextjs.org/docs/app/getting-started/error-handling) de forma sencilla, podemos crear una página de error personalizada para manejar errores 404, 500, etc. Para esto, simplemente creamos un archivo `error.tsx` en la carpeta del mismo nivel del componente que queremos manejar el error.

```typescript
"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
```

Las páginas de error se deben renderizar del lado del cliente, por lo que debemos usar `"use client"` al inicio del archivo.

> Podemos personalizar las páginas de error como queramos, por ejemplo, [esta](https://www.creative-tim.com/twcomponents/component/tailwind-css-500-server-error-illustration) es un buen ejemplo de una página de error 500.

### Rutas dinámicas - Argumentos por URL
