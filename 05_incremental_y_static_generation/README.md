# 🚀 Generación Incremental y Estática en Next.js

La **generación estática** es una estrategia de optimización donde Next.js pre-genera páginas HTML en el momento de la construcción (**build time**), en lugar de generarlas en cada petición del usuario. Esto resulta en tiempos de carga ultra-rápidos y mejor SEO.

La **generación incremental** permite actualizar estas páginas estáticas de forma selectiva sin reconstruir todo el sitio, manteniendo el contenido fresco automáticamente.

## 📋 Temas de la sección

- 🏗️ **Static Site Generation (SSG)**: Pre-generación en build time
- 🔄 **Incremental Static Regeneration (ISR)**: Actualización automática
- ⚡ **generateStaticParams**: Generación masiva de rutas dinámicas
- 🕒 **Estrategias de revalidación**: Control de actualización de contenido
- 🎯 **Casos de uso optimales**: Cuándo usar cada estrategia

---

## 🎯 ¿Por qué usar generación estática?

### 🔥 Problemas que resuelve:

**❌ Problema tradicional:**

```
Usuario solicita → Servidor consulta BD → Genera HTML → Responde
⏱️ Tiempo: ~500ms - 2s por página
```

**✅ Con generación estática:**

```
Usuario solicita → Servidor entrega HTML pre-generado → Responde
⚡ Tiempo: ~50ms - 100ms por página
```

### 💡 Beneficios clave:

- ⚡ **Velocidad extrema**: Páginas servidas desde CDN
- 🔍 **SEO optimizado**: HTML completo disponible para crawlers
- 💰 **Menor costo**: Menos procesamiento del servidor
- 🌐 **Mejor escalabilidad**: Soporta millones de usuarios
- 📱 **Mejor UX móvil**: Carga instantánea en conexiones lentas

---

## 🏗️ Static Site Generation (SSG) - Conceptos básicos

### 🎯 ¿Cuándo usar SSG?

**✅ Perfecto para:**

- 📄 Blogs y documentación
- 🛒 Catálogos de productos
- 🏢 Páginas corporativas
- 📊 Dashboards con datos que cambian poco

**❌ No recomendado para:**

- 💬 Chats en tiempo real
- 👤 Contenido altamente personalizado
- 📈 Dashboards con datos en tiempo real

### 🔧 Implementación básica

```typescript
// Sin generación estática (SSR)
export default async function PokemonPage({
  params,
}: {
  params: { id: string };
}) {
  // ❌ Se ejecuta en CADA petición
  const pokemon = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${params.id}`
  ).then((res) => res.json());

  return <div>{pokemon.name}</div>;
}
```

```typescript
// Con generación estática (SSG)
export async function generateStaticParams() {
  // ✅ Se ejecuta SOLO en build time
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await response.json();

  return data.results.map((pokemon: any) => ({
    id: pokemon.url.split("/").at(-2),
  }));
}

export default async function PokemonPage({
  params,
}: {
  params: { id: string };
}) {
  // ✅ Se ejecuta en build time, resultado se cachea
  const pokemon = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${params.id}`
  ).then((res) => res.json());

  return <div>{pokemon.name}</div>;
}
```

---

## ⚡ generateStaticParams - Generación masiva

### 🎯 ¿Qué hace generateStaticParams?

Esta función le dice a Next.js: _"Genera estas páginas específicas durante el build, no esperes a que el usuario las solicite"_.

### 🔧 Implementación completa

```typescript
// app/dashboard/pokemons/[name]/page.tsx

interface Props {
  params: {
    name: string;
  };
}

// 🏗️ PASO 1: Generar lista de parámetros en build time
export async function generateStaticParams() {
  console.log("🏗️ Generando páginas estáticas de Pokémon...");

  const data: PokemonResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=151`, // Los primeros 151 Pokémon
    { cache: "force-cache" }
  ).then((resp) => resp.json());

  // Devolver array de parámetros para las páginas a generar
  return data.results.map((pokemon) => ({
    name: pokemon.name, // Cada objeto genera una página /pokemons/[name]
  }));
}

// 🏷️ PASO 2: Generar metadata para cada página
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const pokemon = await getPokemon(params.name);

    return {
      title: `${pokemon.name} - Pokédex`,
      description: `Información detallada sobre ${pokemon.name}`,
      openGraph: {
        title: `${pokemon.name} - Pokédex`,
        description: `Descubre todo sobre ${pokemon.name}`,
        images: [pokemon.sprites.other?.dream_world.front_default || ""],
      },
    };
  } catch {
    return {
      title: "Pokémon no encontrado",
      description: "El Pokémon solicitado no existe",
    };
  }
}

// 📊 PASO 3: Obtener datos específicos del Pokémon
const getPokemon = async (name: string): Promise<Pokemon> => {
  try {
    const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
      cache: "force-cache", // Cachear permanentemente
    }).then((resp) => {
      if (!resp.ok) throw new Error(`Pokemon ${name} not found`);
      return resp.json();
    });

    return pokemon;
  } catch (error) {
    notFound(); // Redirigir a 404 si no existe
  }
};

// 🎨 PASO 4: Renderizar la página
export default async function PokemonPage({ params }: Props) {
  const pokemon = await getPokemon(params.name);

  return (
    <div className="flex mt-5 flex-col items-center text-slate-800">
      <div className="relative flex flex-col items-center rounded-[20px] w-[700px] mx-auto bg-white bg-clip-border shadow-lg p-3">
        <div className="mt-2 mb-8 w-full">
          <h1 className="px-2 text-xl font-bold text-slate-700 capitalize">
            #{pokemon.id} {pokemon.name}
          </h1>

          <div className="flex flex-col justify-center items-center">
            <Image
              src={
                pokemon.sprites.other?.dream_world.front_default ??
                "/placeholder.png"
              }
              width={150}
              height={150}
              alt={`${pokemon.name} oficial artwork`}
              className="mb-5"
            />

            <div className="flex flex-wrap justify-center gap-2">
              {pokemon.types.map((type) => (
                <span
                  key={type.slot}
                  className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800"
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 px-2 w-full">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Estadísticas</h3>
            <div className="space-y-1">
              <p>Altura: {pokemon.height / 10} m</p>
              <p>Peso: {pokemon.weight / 10} kg</p>
              <p>Experiencia base: {pokemon.base_experience}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Habilidades</h3>
            <div className="space-y-1">
              {pokemon.abilities.slice(0, 3).map((ability) => (
                <p key={ability.ability.name} className="capitalize">
                  {ability.ability.name}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 🚀 Snippet de VS Code

Puedes usar el snippet `gsp` en VS Code para generar rápidamente el boilerplate:

```typescript
// Escribe: gsp + Tab
export async function generateStaticParams() {
  return [
    // Array de parámetros
  ];
}
```

---

## 🔄 Incremental Static Regeneration (ISR)

### 🎯 ¿Qué es ISR?

ISR combina lo mejor de ambos mundos:

- ⚡ **Velocidad de páginas estáticas**
- 🔄 **Contenido actualizado automáticamente**

### 📊 Flujo de ISR

```
Build time → Genera páginas estáticas
     ↓
Usuario 1 → Recibe página estática (rápido)
     ↓
Pasa tiempo de revalidación
     ↓
Usuario 2 → Recibe página estática (rápido)
     ↓      + Triggers regeneración en background
     ↓
Usuario 3 → Recibe nueva página estática actualizada
```

### 🛠️ Implementación con Fetch API

```typescript
const getPokemon = async (name: string): Promise<Pokemon> => {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
    next: {
      revalidate: 60 * 60 * 24, // 🔄 Revalidar cada 24 horas
    },
  }).then((resp) => resp.json());

  return pokemon;
};
```

### ⚙️ Revalidación sin Fetch API

Si usas Axios u otras librerías, exporta la constante `revalidate`:

```typescript
// app/dashboard/pokemons/[name]/page.tsx

export const revalidate = 3600; // 🔄 Revalidar cada hora (3600 segundos)

// O configuraciones más específicas:
export const dynamic = "force-static"; // Forzar generación estática
export const dynamicParams = true; // Permitir parámetros no generados
export const fetchCache = "force-cache"; // Cachear todas las peticiones
```

### 🎮 Estrategias de revalidación

```typescript
// ⚡ Contenido muy estático (documentación, páginas corporativas)
export const revalidate = 60 * 60 * 24 * 7; // 1 semana

// 🔄 Contenido moderadamente dinámico (blogs, productos)
export const revalidate = 60 * 60; // 1 hora

// 🚀 Contenido semi-dinámico (noticias, feeds)
export const revalidate = 60 * 5; // 5 minutos

// 🔥 Sin revalidación (contenido que nunca cambia)
export const revalidate = false;
```

---

## 📈 Casos de uso y mejores prácticas

### ✅ Ideal para SSG + ISR

```typescript
// 🛒 E-commerce - Catálogo de productos
export async function generateStaticParams() {
  const products = await getPopularProducts(); // Top 1000 productos
  return products.map((product) => ({ id: product.id }));
}

export const revalidate = 60 * 60; // Actualizar precios cada hora
```

```typescript
// 📰 Blog - Artículos
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export const revalidate = 60 * 60 * 24; // Actualizar una vez al día
```

### 🎯 Configuración híbrida

```typescript
// Generar solo los más populares estáticamente
export async function generateStaticParams() {
  const popularPokemons = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=50" // Solo los primeros 50
  ).then((res) => res.json());

  return popularPokemons.results.map((pokemon: any) => ({
    name: pokemon.name,
  }));
}

// Los demás se generarán on-demand
export const dynamicParams = true;
export const revalidate = 60 * 60 * 12; // 12 horas
```

### 🔧 Monitoreo y debugging

```typescript
export async function generateStaticParams() {
  console.log("🏗️ [BUILD] Generando páginas estáticas...");

  const start = Date.now();
  const data = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151").then(
    (res) => res.json()
  );

  console.log(
    `✅ [BUILD] ${data.results.length} páginas generadas en ${
      Date.now() - start
    }ms`
  );

  return data.results.map((pokemon: any) => ({
    name: pokemon.name,
  }));
}
```

---

## 🎯 Resultado final

Con esta configuración, tendrás:

- ⚡ **151 páginas de Pokémon pre-generadas** en build time
- 🔄 **Actualización automática** cada 24 horas
- 🚀 **Carga ultra-rápida** desde CDN
- 🔍 **SEO perfecto** con HTML completo
- 📱 **Excelente UX** en cualquier dispositivo

La generación estática e incremental es una de las características más potentes de Next.js, permitiendo crear aplicaciones que son tanto rápidas como dinámicas. ¡Es la mejor forma de escalar aplicaciones modernas! 🚀
