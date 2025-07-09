# ---- Etapa 1: Builder ----
# Usamos una imagen de Node.js con Alpine Linux para la fase de construcción.
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Instalamos pnpm globalmente.
RUN npm install -g pnpm

# Copiamos los archivos de manifiesto del proyecto.
COPY package.json pnpm-lock.yaml ./

# Instalamos las dependencias de producción.
RUN pnpm install --frozen-lockfile

# Copiamos el resto del código fuente.
COPY . .

# Obtenemos la variable de entorno para la API desde el archivo Secret.txt.
# Para mayor seguridad, la pasamos como un argumento en tiempo de construcción.
ARG API_URL
ENV NEXT_PUBLIC_API_URL=$API_URL

# Construimos la aplicación para producción.
RUN pnpm build

# ---- Etapa 2: Runner ----
# Usamos la misma imagen base para la fase de ejecución.
FROM node:20-alpine

WORKDIR /app

# Instalamos pnpm para poder ejecutar el script "start".
RUN npm install -g pnpm

# Copiamos solo los artefactos necesarios desde la etapa 'builder'.
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Exponemos el puerto en el que Next.js se ejecuta por defecto.
EXPOSE 3000

# El comando para iniciar la aplicación en modo producción.
CMD ["pnpm", "start"]