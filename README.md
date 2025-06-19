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
