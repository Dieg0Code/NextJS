# 🚀 Despliegue de Aplicaciones Next.js

Guía para llevar tu aplicación Next.js de desarrollo a producción usando Vercel y Docker.

## 📋 Temas de la sección

1. 🔨 **Build de producción**: Generar la versión optimizada de la aplicación
2. ✅ **Pruebas locales**: Validar el funcionamiento antes del despliegue
3. ☁️ **Despliegue en Vercel**: Hosting optimizado para Next.js
4. 🐳 **Imagen Docker**: Containerización de la aplicación
5. 🏗️ **Dockerfile optimizado**: Siguiendo las recomendaciones de Next.js
6. 🚢 **Ejecución en Docker**: Correr la aplicación en contenedores

---

## 🔨 Generar el build de producción

Para preparar tu aplicación Next.js para producción, utiliza el siguiente comando:

```bash
npm run build
```

### 📦 ¿Qué hace este comando?

El proceso de build realiza varias optimizaciones importantes:

- ⚡ **Compila la aplicación**: Convierte el código para producción
- 🗂️ **Genera contenido estático**: Páginas y rutas optimizadas
- 🗜️ **Minifica el código**: Reduce el tamaño de archivos JS y CSS
- 🖼️ **Optimiza imágenes**: Comprime assets automáticamente
- 📊 **Elimina código no usado**: Tree shaking para menor tamaño

### 🎯 Resultado del build

Los archivos optimizados se almacenan en el directorio `.next/`, que contiene todo lo necesario para ejecutar la aplicación en producción con **mejor rendimiento** y **tiempos de carga más rápidos**.

### ✅ Probar el build localmente

Antes de desplegar, siempre valida que el build funciona correctamente:

```bash
npm run start
```

Este comando inicia el **servidor de producción**, sirviendo los archivos optimizados del directorio `.next/`. Verifica que todas las funcionalidades trabajen correctamente en modo producción.

---

## ☁️ Despliegue en Vercel

**Vercel** es la plataforma de hosting creada por el mismo equipo que desarrolla Next.js, ofreciendo **integración perfecta** y características avanzadas específicas para aplicaciones Next.js.

### 🛠️ Pasos para desplegar

#### **1. Crear cuenta y configurar CLI**

```bash
# Instalar CLI de Vercel
npm install -g vercel

# Iniciar sesión
vercel login
```

#### **2. Desplegar desde terminal**

```bash
# En el directorio de tu proyecto
vercel
```

Vercel te guiará a través del proceso preguntando por:

- 📁 Configuración del proyecto
- 🗂️ Directorio de salida (normalmente `.next`)
- ⚙️ Configuraciones específicas del framework

#### **3. Despliegue automático desde Git**

También puedes conectar tu repositorio de **GitHub**, **GitLab** o **Bitbucket** para despliegue automático:

- 🔄 **Deploy automático**: Cada push a la rama principal despliega la aplicación
- 🌐 **URL temporal**: Vercel proporciona un dominio para acceder inmediatamente
- 🏷️ **Dominio personalizado**: Configurable desde el panel de control

### 🎯 Funcionalidades adicionales

Una vez desplegada, desde el panel de Vercel puedes:

- 🌍 **Configurar dominio personalizado**
- 🔧 **Gestionar variables de entorno**
- 📊 **Ver registros de despliegue**
- ⚙️ **Administrar configuraciones del proyecto**

---

## 🐳 Generar una imagen de Docker

Docker permite empaquetar tu aplicación con todas sus dependencias en un **contenedor portable** que funciona consistentemente en cualquier entorno.

### 📋 Archivo .dockerignore

Primero, crea un archivo `.dockerignore` para evitar copiar archivos innecesarios:

```plaintext
node_modules
.next
Dockerfile
.dockerignore
.git
.env
.vscode
*.log
README.md
```

### 🏗️ Dockerfile básico

```dockerfile
# Usa una imagen base oficial de Node.js
FROM node:20-alpine AS builder
# Establece el directorio de trabajo
WORKDIR /app
# Copia los archivos de configuración y dependencias
COPY package*.json ./
# Instala las dependencias de producción
RUN npm install --production
# Copia el resto de la aplicación
COPY . .
# Genera el build de producción
RUN npm run build

# Usa una imagen base de Node.js para producción
FROM node:20-alpine AS runner
# Establece el directorio de trabajo
WORKDIR /app
# Copia las dependencias instaladas y el build de producción
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
# Copia los archivos estáticos y de configuración
COPY --from=builder /app/public ./public
# Exponer el puerto en el que la aplicación escuchará
EXPOSE 3000
# Comando para iniciar la aplicación en modo producción
CMD ["npm", "run", "start"]
```

### 🔨 Comandos para Docker

**Construir la imagen:**

```bash
docker build -t nombre-imagen .
```

**Ejecutar el contenedor:**

```bash
docker run -p 3000:3000 nombre-imagen
```

La aplicación estará disponible en `http://localhost:3000`.

---

## 🏆 Dockerfile recomendado por Next.js

Next.js proporciona un **Dockerfile optimizado** que sigue todas las mejores prácticas para crear imágenes eficientes:

```dockerfile
# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

### ⚙️ Configuración necesaria para standalone

Para que este Dockerfile funcione correctamente, debes agregar la configuración `standalone` en tu `next.config.js`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Otras configuraciones de Next.js
};

export default nextConfig;
```

### 🎯 Ventajas del Dockerfile oficial

Este Dockerfile está **optimizado para producción** y utiliza:

- 🏗️ **Múltiples etapas**: Reduce el tamaño de la imagen final
- 🐳 **Alpine Linux**: Imagen base ligera y segura
- 📦 **Gestión inteligente**: Detecta automáticamente tu package manager (npm, yarn, pnpm)
- 🔒 **Usuario no-root**: Mejora la seguridad del contenedor
- 📁 **Output standalone**: Solo incluye archivos necesarios para la ejecución

La imagen final contiene únicamente los archivos necesarios para ejecutar tu aplicación Next.js en producción de manera eficiente y segura.
