# 🌐 Estado Global - Pokémon Favoritos

En esta sección vamos a implementar un sistema completo de favoritos para nuestros Pokémon usando **Redux Toolkit**. Aprenderemos a manejar estado persistente con **LocalStorage** y buenas prácticas para **Next.js SSR**.

## 📋 Objetivos de la sección

- 💖 **Sistema de Favoritos**: Marcar/desmarcar Pokémon como favoritos
- 💾 **Persistencia LocalStorage**: Mantener favoritos entre sesiones
- 🏗️ **Middlewares Redux**: Manejo correcto de efectos secundarios
- ⚡ **Hidratación SSR**: Sincronización servidor-cliente
- 🎨 **UI Estados**: Loading, vacío y error states

---

## 🏪 Crear el Pokémon Slice

### 📁 Estructura del Slice

Creamos un nuevo slice para manejar el estado de los Pokémon favoritos:

```typescript
// src/store/pokemons/pokemonsSlice.ts
import { SimplePokemon } from "@/pokemons";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PokemonState {
  favorites: { [key: string]: SimplePokemon };
  isLoading: boolean;
  isHydrated: boolean; // Para evitar hidratation mismatch
}

const initialState: PokemonState = {
  favorites: {},
  isLoading: false,
  isHydrated: false,
};

const pokemonsSlice = createSlice({
  name: "pokemons",
  initialState,
  reducers: {
    // 🔄 Hidratar favoritos desde localStorage
    setFavoritePokemons(
      state,
      action: PayloadAction<{ [key: string]: SimplePokemon }>
    ) {
      state.favorites = action.payload;
      state.isHydrated = true;
    },

    // ❤️ Toggle favorito
    toggleFavorite(state, action: PayloadAction<SimplePokemon>) {
      const pokemon = action.payload;
      const { id } = pokemon;

      if (state.favorites[id]) {
        delete state.favorites[id];
      } else {
        state.favorites[id] = pokemon;
      }
    },

    // 🔄 Estados de carga
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    // 🧹 Limpiar favoritos
    clearFavorites(state) {
      state.favorites = {};
    },
  },
});

export const {
  setFavoritePokemons,
  toggleFavorite,
  setLoading,
  clearFavorites,
} = pokemonsSlice.actions;

export default pokemonsSlice.reducer;
```

### 🔧 Integrar el Slice al Store

```typescript
// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import counterReducer from "./counter/counterSlice";
import pokemonsReducer from "./pokemons/pokemonsSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    pokemons: pokemonsReducer,
  },
});

// 📘 Tipos de TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 🎯 Hooks tipados
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

> 💡 **Tip**: Usa el snippet `rxslice + Tab` en VS Code para crear slices rápidamente

---

## 💖 Sistema de Favoritos en PokemonCard

### 🎨 Componente PokemonCard Mejorado

```typescript
// src/pokemons/components/PokemonCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleFavorite } from "@/store/pokemons/pokemonsSlice";
import { SimplePokemon } from "../interfaces/simple-pokemon";

interface Props {
  pokemon: SimplePokemon;
}

export const PokemonCard = ({ pokemon }: Props) => {
  const { id, name } = pokemon;
  const { favorites, isHydrated } = useAppSelector((state) => state.pokemons);
  const dispatch = useAppDispatch();

  // ✅ Verificar si es favorito
  const isFavorite = !!favorites[id];

  // 🎯 Manejar toggle de favorito
  const onToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Evitar navegación del Link padre
    dispatch(toggleFavorite(pokemon));
  };

  return (
    <div className="mx-auto right-0 mt-2 w-60">
      <div className="flex flex-col bg-white rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        {/* 🖼️ Header con imagen */}
        <div className="flex flex-col items-center justify-center text-center p-6 bg-gray-800 border-b">
          <Image
            key={pokemon.id}
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
            width={100}
            height={100}
            alt={pokemon.name}
            priority={false}
            className="drop-shadow-lg"
          />
          <p className="pt-2 text-lg font-semibold text-gray-50 capitalize">
            {name}
          </p>
          <div className="mt-5">
            <Link
              href={`/dashboard/pokemon/${name}`}
              className="border rounded-full py-2 px-4 text-xs font-semibold text-gray-100 hover:bg-gray-700 transition-colors"
            >
              Más información
            </Link>
          </div>
        </div>

        {/* ❤️ Sección de favoritos */}
        <div className="border-b">
          <button
            onClick={onToggleFavorite}
            disabled={!isHydrated}
            className="w-full px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer transition-colors disabled:opacity-50"
          >
            <div className="text-red-600 flex-shrink-0">
              {!isHydrated ? (
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
              ) : isFavorite ? (
                <IoHeart size={20} />
              ) : (
                <IoHeartOutline size={20} />
              )}
            </div>
            <div className="pl-3">
              <p className="text-sm font-medium text-gray-800 leading-none text-left">
                {!isHydrated
                  ? "Cargando..."
                  : isFavorite
                  ? "Es Favorito"
                  : "Marcar como favorito"}
              </p>
              <p className="text-xs text-gray-500 text-left">
                {isHydrated ? "Click para cambiar" : "Sincronizando..."}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 🎯 Características implementadas

- ✅ **Estado visual**: Corazón lleno vs vacío
- ⏳ **Loading state**: Placeholder durante hidratación
- 🚫 **Prevención**: Evita clicks antes de la hidratación
- 🎨 **Transiciones**: Hover effects suaves
- 📱 **Accesibilidad**: Button semántico con disabled state

---

## 📄 Página de Favoritos

### 🗂️ Separación Server/Client Components

```typescript
// app/dashboard/favorites/page.tsx
import { FavoritePokemons } from "@/pokemons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favoritos - Pokédex",
  description: "Gestión de Pokémon favoritos con estado global",
};

export default function FavoritesPage() {
  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h1 className="text-5xl font-bold text-gray-800 mb-2">
          Pokémon Favoritos
        </h1>
        <p className="text-xl text-blue-600">Gestión con Estado Global</p>
      </div>

      {/* ✅ Client Component separado */}
      <FavoritePokemons />
    </div>
  );
}
```

### 🎨 Componente FavoritePokemons

```typescript
// src/pokemons/components/FavoritePokemons.tsx
"use client";

import { useAppSelector } from "@/store";
import { PokemonsGrid } from "./PokemonsGrid";
import { IoHeartOutline } from "react-icons/io5";

export const FavoritePokemons = () => {
  const { favorites, isHydrated, isLoading } = useAppSelector(
    (state) => state.pokemons
  );

  // 📊 Convertir objeto a array
  const favoritePokemons = Object.values(favorites);

  // ⏳ Loading state
  if (!isHydrated || isLoading) {
    return <LoadingSkeleton />;
  }

  // 🈳 Estado vacío
  if (favoritePokemons.length === 0) {
    return <NoFavorites />;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-lg text-gray-600">
          {favoritePokemons.length} Pokémon
          {favoritePokemons.length !== 1 ? "s" : ""} favorito
          {favoritePokemons.length !== 1 ? "s" : ""}
        </p>
      </div>
      <PokemonsGrid pokemons={favoritePokemons} />
    </div>
  );
};

// 🈳 Estado sin favoritos
export const NoFavorites = () => {
  return (
    <div className="flex flex-col h-[50vh] items-center justify-center">
      <IoHeartOutline size={100} className="text-red-300 mb-4" />
      <h3 className="text-2xl font-semibold text-gray-600 mb-2">
        No hay favoritos aún
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        Explora la Pokédex y marca tus Pokémon favoritos haciendo clic en el
        corazón
      </p>
    </div>
  );
};

// ⏳ Loading skeleton
const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="bg-gray-200 h-48 animate-pulse" />
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};
```

---

## 💾 Persistencia con LocalStorage

### 🚫 El Problema de SSR

```typescript
// ❌ PROBLEMÁTICO - localStorage no existe en el servidor
const getInitialStateFromLocalStorage = (): PokemonState => {
  const favorites = JSON.parse(
    localStorage.getItem("favorite-pokemons") ?? "{}"
  );
  return favorites;
};
```

**Errores que causa:**

- 🚫 `ReferenceError: localStorage is not defined` en build
- ⚠️ `Text content does not match server-rendered HTML` (hydration mismatch)

### ✅ Solución: Hidratación Diferida

```typescript
// src/store/Providers.tsx
"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from ".";
import { setFavoritePokemons } from "./pokemons/pokemonsSlice";

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  useEffect(() => {
    // 💾 Cargar favoritos desde localStorage
    const loadFavorites = () => {
      try {
        const storedFavorites = localStorage.getItem("favorite-pokemons");
        const favorites = storedFavorites ? JSON.parse(storedFavorites) : {};

        store.dispatch(setFavoritePokemons(favorites));
        console.log(
          "✅ Favoritos cargados desde localStorage:",
          Object.keys(favorites).length
        );
      } catch (error) {
        console.error("❌ Error al cargar favoritos:", error);
        store.dispatch(setFavoritePokemons({}));
      }
    };

    loadFavorites();
  }, []);

  return <Provider store={store}>{children}</Provider>;
};
```

---

## 🔧 Redux Middlewares (Buenas Prácticas)

### 📚 ¿Por qué Middlewares?

**❌ Reducer con efectos secundarios (MALO):**

```typescript
toggleFavorite(state, action) {
  // ... lógica del estado

  // 🚫 MALO: Efecto secundario en reducer
  localStorage.setItem("favorite-pokemons", JSON.stringify(state.favorites));
}
```

**✅ Middleware separado (BUENO):**

```typescript
// src/store/middlewares/localStorageMiddleware.ts
import { Action, Dispatch, MiddlewareAPI } from "@reduxjs/toolkit";
import { RootState } from "..";

export const localStorageMiddleware = (
  api: MiddlewareAPI<Dispatch, RootState>
) => {
  return (next: Dispatch) => (action: Action) => {
    // ⚡ Ejecutar la acción primero
    const result = next(action);

    // 🎯 Reaccionar a acciones específicas
    if (
      action.type === "pokemons/toggleFavorite" ||
      action.type === "pokemons/clearFavorites"
    ) {
      try {
        const { pokemons } = api.getState();
        localStorage.setItem(
          "favorite-pokemons",
          JSON.stringify(pokemons.favorites)
        );
        console.log("💾 Favoritos guardados en localStorage");
      } catch (error) {
        console.error("❌ Error al guardar en localStorage:", error);
      }
    }

    return result;
  };
};
```

### 🔧 Registrar Middleware en el Store

```typescript
// src/store/index.ts
import { configureStore, Middleware } from "@reduxjs/toolkit";
import { localStorageMiddleware } from "./middlewares/localStorageMiddleware";
import counterReducer from "./counter/counterSlice";
import pokemonsReducer from "./pokemons/pokemonsSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    pokemons: pokemonsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar estas rutas para el check de serialización
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(localStorageMiddleware as Middleware),
});

// Resto de la configuración...
```

### 🧹 Slice Limpio (Sin Efectos Secundarios)

```typescript
// src/store/pokemons/pokemonsSlice.ts - Versión limpia
const pokemonsSlice = createSlice({
  name: "pokemons",
  initialState,
  reducers: {
    setFavoritePokemons(
      state,
      action: PayloadAction<{ [key: string]: SimplePokemon }>
    ) {
      state.favorites = action.payload;
      state.isHydrated = true;
    },

    toggleFavorite(state, action: PayloadAction<SimplePokemon>) {
      const pokemon = action.payload;
      const { id } = pokemon;

      if (state.favorites[id]) {
        delete state.favorites[id];
      } else {
        state.favorites[id] = pokemon;
      }
      // ✅ SIN efectos secundarios - el middleware se encarga
    },

    clearFavorites(state) {
      state.favorites = {};
    },
  },
});
```

---

## 🧮 Widget de Contador Actualizado

### 📊 SimpleWidget con Estado Global

```typescript
// components/SimpleWidget.tsx
"use client";

import { IoCafeOutline } from "react-icons/io5";
import { useAppSelector } from "@/store";

export const SimpleWidget = () => {
  const { favorites, isHydrated } = useAppSelector((state) => state.pokemons);
  const favoritesCount = Object.keys(favorites).length;

  return (
    <div className="bg-white shadow-xl p-3 sm:min-w-[25%] min-w-full rounded-2xl border border-gray-200 mx-2 my-2">
      <div className="flex flex-col">
        {/* Header */}
        <div>
          <h2 className="font-bold text-gray-600 text-center">Favoritos</h2>
        </div>

        {/* Content */}
        <div className="my-3">
          <div className="flex flex-row items-center justify-center space-x-3">
            <div className="flex-shrink-0">
              <IoCafeOutline size={50} className="text-blue-500" />
            </div>
            <div className="text-center">
              {isHydrated ? (
                <h4 className="text-4xl font-bold text-gray-800">
                  {favoritesCount}
                </h4>
              ) : (
                <div className="w-16 h-12 bg-gray-200 rounded animate-pulse" />
              )}
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

## 🚀 Build y Deploy - Manejo de Errores SSR

### ✅ Checklist para Producción

1. **🔍 Verificación de localStorage:**

```typescript
const isLocalStorageAvailable = () => {
  try {
    return typeof window !== "undefined" && window.localStorage;
  } catch {
    return false;
  }
};
```

2. **⚠️ Manejo de errores:**

```typescript
const safeLocalStorageGet = (key: string, defaultValue: any = null) => {
  if (!isLocalStorageAvailable()) return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};
```

3. **🔄 Hydration mismatch prevention:**

```typescript
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

if (!isClient) {
  return <LoadingSkeleton />;
}
```

### 🏗️ Comando de Build

```bash
# ✅ Debería funcionar sin errores
npm run build

# 🚀 Y también el start
npm run start
```

---

## 🎯 Resultado Final

Con esta implementación completa tendremos:

### ✅ Funcionalidades

- 💖 **Sistema de favoritos** completo y funcional
- 💾 **Persistencia** entre sesiones con localStorage
- ⚡ **Hidratación SSR** sin mismatch errors
- 🧹 **Código limpio** con middlewares para efectos secundarios
- 🎨 **UI estados** para loading, vacío y error
- 📱 **Responsive** y accesible

### 🏗️ Arquitectura Robusta

- **🔧 Middlewares Redux**: Efectos secundarios controlados
- **🌊 Hydration Strategy**: Evita errores SSR/Client
- **📊 State Management**: Estado global predecible
- **🎯 TypeScript**: Tipado completo y seguro
- **⚡ Performance**: Renders optimizados

### 🎮 Experiencia de Usuario

- **🔄 Estados visuales**: Loading, vacío, error
- **⚡ Respuesta inmediata**: UI optimista
- **💾 Persistencia**: Favoritos entre sesiones
- **📱 Responsive**: Funciona en todos los dispositivos

¡Con esta implementación tienes una base sólida para cualquier sistema de favoritos en Next.js + Redux! 🚀
