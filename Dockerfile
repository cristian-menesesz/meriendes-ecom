# ============================================
# Dockerfile para Next.js 16 con App Router
# Multi-stage build para optimizar tamaño de imagen
# ============================================

# ============================================
# Stage 1: Dependencies
# Instala solo dependencias de producción
# ============================================
FROM node:20-alpine AS deps

# Instalar libc6-compat para compatibilidad con binarios nativos
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias (producción + dev para build)
RUN npm ci

# ============================================
# Stage 2: Builder
# Compila la aplicación Next.js
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependencias desde stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Build arguments para variables de entorno públicas
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Set environment variables para build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN npm run build

# ============================================
# Stage 3: Runner
# Imagen final mínima solo con runtime
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# Variables de entorno de producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos públicos
COPY --from=builder /app/public ./public

# Copiar archivos de build de Next.js
# Next.js genera archivos en .next que necesitan ser servidos
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto (sobrescritas por docker-compose)
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check para monitoreo
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicio
CMD ["node", "server.js"]
