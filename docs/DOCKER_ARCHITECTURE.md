# 3.4 Diseño de Solución con Docker - Meriendes E-commerce

**Proyecto**: Meriendes E-commerce Platform  
**Fecha**: Diciembre 10, 2025  
**Versión**: 1.0  
**Enfoque**: Arquitectura de Contenedores y Pipeline CI/CD

---

## 1. Arquitectura de Contenedores

El sistema Meriendes E-commerce adopta una arquitectura de contenedores modular que desacopla los componentes principales de la aplicación, permitiendo escalabilidad, portabilidad y despliegues reproducibles.

### 1.1 Servicios del Sistema

La arquitectura propuesta consta de 4 servicios principales ejecutándose en contenedores Docker independientes:

#### **Servicio 1: Next.js Application (Frontend + Backend)**

- **Contenedor**: `meriendes-app`
- **Imagen base**: `node:20-alpine`
- **Puerto expuesto**: `3000`
- **Responsabilidades**:
  - Renderizado de Server Components (SSR)
  - Servir Client Components (CSR)
  - Ejecución de Server Actions (checkout, orders)
  - API Routes (webhooks de Stripe)
  - Middleware de autenticación
- **Dependencias externas**:
  - Supabase (PostgreSQL + Auth) - servicio externo
  - Stripe API - servicio externo
- **Variables de entorno requeridas**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`

**Justificación de diseño**: Next.js 16 con App Router combina frontend y backend en un monolito modular. Separar frontend/backend en contenedores distintos no aportaría valor dado que Next.js está diseñado para esta arquitectura unificada.

---

#### **Servicio 2: PostgreSQL Database (Desarrollo Local)**

- **Contenedor**: `meriendes-db`
- **Imagen base**: `postgres:16-alpine`
- **Puerto expuesto**: `5432`
- **Responsabilidades**:
  - Almacenamiento de datos persistente (22 tablas)
  - Ejecución de funciones PostgreSQL (inventory operations)
  - Enforcement de RLS policies
- **Volumen persistente**: `postgres-data:/var/lib/postgresql/data`
- **Variables de entorno**:
  - `POSTGRES_USER=meriendes`
  - `POSTGRES_PASSWORD=<secure_password>`
  - `POSTGRES_DB=meriendes_ecom`

**Nota importante**: En producción, se utiliza Supabase Cloud (PostgreSQL gestionado). Este contenedor solo se usa para desarrollo local y testing.

---

#### **Servicio 3: Redis Cache (Opcional - Futuro)**

- **Contenedor**: `meriendes-cache`
- **Imagen base**: `redis:7-alpine`
- **Puerto expuesto**: `6379`
- **Responsabilidades**:
  - Cache de sesiones de usuario
  - Cache de carritos de compra temporales
  - Rate limiting para APIs
- **Volumen persistente**: `redis-data:/data`

**Estado actual**: No implementado. Zustand con localStorage es suficiente para MVP. Redis se considerará para optimización post-lanzamiento.

---

#### **Servicio 4: Nginx Reverse Proxy (Opcional - Producción)**

- **Contenedor**: `meriendes-proxy`
- **Imagen base**: `nginx:alpine`
- **Puerto expuesto**: `80`, `443`
- **Responsabilidades**:
  - Terminación SSL/TLS
  - Load balancing entre múltiples instancias de app
  - Compresión gzip
  - Servir assets estáticos con cache headers

**Estado actual**: No necesario. Vercel maneja esto nativamente en producción. Solo relevante si se migra a infraestructura self-hosted.

---

### 1.2 Comunicación entre Servicios

```mermaid
graph TB
    subgraph "Docker Network: meriendes-network"
        App[meriendes-app:3000<br/>Next.js Application]
        DB[meriendes-db:5432<br/>PostgreSQL]
        Cache[meriendes-cache:6379<br/>Redis - Futuro]
    end

    subgraph "External Services"
        Supabase[Supabase Cloud<br/>PostgreSQL + Auth]
        Stripe[Stripe API<br/>Payment Processing]
        Vercel[Vercel CDN<br/>Static Assets]
    end

    Browser[Browser Client] -->|HTTP/HTTPS| App

    App -->|SQL Queries| DB
    App -.->|Cache Read/Write| Cache
    App -->|REST API| Supabase
    App -->|REST API| Stripe
    App -->|Asset Requests| Vercel

    style App fill:#90EE90
    style DB fill:#4682B4,color:#fff
    style Cache fill:#DC143C,color:#fff
    style Supabase fill:#3ECF8E
    style Stripe fill:#635bff,color:#fff
```

**Flujo de comunicación típico** (checkout de usuario):

1. **Browser → meriendes-app (puerto 3000)**
   - Protocolo: HTTPS
   - Request: `POST /checkout` con datos del formulario

2. **meriendes-app → meriendes-db (puerto 5432)** [SOLO EN DEV]
   - Protocolo: PostgreSQL wire protocol
   - Query: `SELECT * FROM products WHERE id = $1`
   - Validación de disponibilidad de inventario

3. **meriendes-app → Supabase Cloud** [PRODUCCIÓN]
   - Protocolo: HTTPS (REST API)
   - Endpoint: `https://<project>.supabase.co/rest/v1/products`
   - Headers: `apikey`, `Authorization`

4. **meriendes-app → Stripe API**
   - Protocolo: HTTPS
   - Endpoint: `https://api.stripe.com/v1/checkout/sessions`
   - Auth: Bearer token con `STRIPE_SECRET_KEY`

5. **Stripe → meriendes-app (webhook)**
   - Protocolo: HTTPS
   - Endpoint: `POST /api/webhooks/stripe`
   - Verificación de firma con `STRIPE_WEBHOOK_SECRET`

**Red Docker**: Todos los contenedores se conectan a una red bridge personalizada `meriendes-network`, permitiendo resolución de nombres DNS interna (ej: `postgres://meriendes-db:5432/meriendes_ecom`).

---

## 2. Dockerfiles Esquemáticos

### 2.1 Dockerfile Principal - Next.js Application

```dockerfile
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
```

**Características clave**:

- **Multi-stage build**: Reduce tamaño final de imagen de ~1GB a ~200MB
- **Usuario no-root**: Mejora seguridad (principio de mínimo privilegio)
- **Health check**: Permite a Docker/Kubernetes reiniciar contenedor automáticamente
- **Standalone output**: Next.js genera un bundle autocontenido que no requiere node_modules completo

---

### 2.2 Dockerfile para PostgreSQL (Desarrollo Local)

```dockerfile
# ============================================
# Dockerfile personalizado para PostgreSQL
# Incluye schema inicial y datos de seed
# ============================================

FROM postgres:16-alpine

# Instalar extensiones necesarias
RUN apk add --no-cache postgresql-contrib

# Variables de entorno por defecto
ENV POSTGRES_USER=meriendes
ENV POSTGRES_DB=meriendes_ecom
ENV POSTGRES_PASSWORD=changeme

# Copiar scripts de inicialización
# PostgreSQL ejecuta automáticamente archivos en /docker-entrypoint-initdb.d/
COPY docs/database-schema.sql /docker-entrypoint-initdb.d/01-schema.sql
COPY docs/rls-policies.sql /docker-entrypoint-initdb.d/02-rls-policies.sql
COPY docs/inventory-functions.sql /docker-entrypoint-initdb.d/03-functions.sql
COPY docs/seed-dev-data.sql /docker-entrypoint-initdb.d/04-seed.sql

# Configuraciones personalizadas de PostgreSQL
COPY docker/postgres/postgresql.conf /etc/postgresql/postgresql.conf

# Exponer puerto estándar
EXPOSE 5432

# Volume para persistencia de datos
VOLUME /var/lib/postgresql/data

# Health check
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD pg_isready -U meriendes -d meriendes_ecom || exit 1

# Comando por defecto (heredado de imagen base)
# CMD ["postgres"]
```

**Archivos de configuración adicionales**:

`docker/postgres/postgresql.conf`:

```ini
# Configuración optimizada para desarrollo local
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 10MB
min_wal_size = 1GB
max_wal_size = 4GB
```

---

### 2.3 Dockerfile para Redis (Futuro)

```dockerfile
# ============================================
# Dockerfile para Redis Cache
# ============================================

FROM redis:7-alpine

# Copiar configuración personalizada
COPY docker/redis/redis.conf /usr/local/etc/redis/redis.conf

# Crear directorio para persistencia
RUN mkdir -p /data && chown redis:redis /data

# Exponer puerto
EXPOSE 6379

# Volume para persistencia
VOLUME /data

# Health check
HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD redis-cli ping | grep PONG || exit 1

# Comando de inicio con configuración
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
```

`docker/redis/redis.conf`:

```ini
# Configuración básica de Redis
bind 0.0.0.0
port 6379
protected-mode no
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
appendonly yes
appendfilename "appendonly.aof"
```

---

## 3. Docker Compose

### 3.1 docker-compose.yml - Configuración Principal

```yaml
# ============================================
# Docker Compose - Meriendes E-commerce
# Orquestación de servicios para desarrollo local
# ============================================

version: '3.9'

services:
  # ==========================================
  # Next.js Application
  # ==========================================
  app:
    container_name: meriendes-app
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
    ports:
      - '3000:3000'
    environment:
      # Variables públicas (embebidas en build)
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}

      # Variables privadas (solo server-side)
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}

      # Database connection (dev local)
      - DATABASE_URL=postgresql://meriendes:changeme@db:5432/meriendes_ecom

      # Node environment
      - NODE_ENV=production
    depends_on:
      db:
        condition: service_healthy
    networks:
      - meriendes-network
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3000/api/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # ==========================================
  # PostgreSQL Database (Desarrollo Local)
  # ==========================================
  db:
    container_name: meriendes-db
    build:
      context: .
      dockerfile: docker/postgres/Dockerfile
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_USER=meriendes
      - POSTGRES_PASSWORD=changeme
      - POSTGRES_DB=meriendes_ecom
      - POSTGRES_INITDB_ARGS=--encoding=UTF-8 --lc-collate=en_US.utf8 --lc-ctype=en_US.utf8
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./docs/database-schema.sql:/docker-entrypoint-initdb.d/01-schema.sql:ro
      - ./docs/rls-policies.sql:/docker-entrypoint-initdb.d/02-rls-policies.sql:ro
      - ./docs/inventory-functions.sql:/docker-entrypoint-initdb.d/03-functions.sql:ro
      - ./docs/seed-dev-data.sql:/docker-entrypoint-initdb.d/04-seed.sql:ro
    networks:
      - meriendes-network
    restart: unless-stopped
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U meriendes -d meriendes_ecom']
      interval: 10s
      timeout: 5s
      retries: 5

  # ==========================================
  # Redis Cache (Opcional - Descomentado cuando se necesite)
  # ==========================================
  # cache:
  #   container_name: meriendes-cache
  #   build:
  #     context: .
  #     dockerfile: docker/redis/Dockerfile
  #   ports:
  #     - "6379:6379"
  #   volumes:
  #     - redis-data:/data
  #   networks:
  #     - meriendes-network
  #   restart: unless-stopped
  #   healthcheck:
  #     test: ["CMD", "redis-cli", "ping"]
  #     interval: 10s
  #     timeout: 3s
  #     retries: 3

# ==========================================
# Networks
# ==========================================
networks:
  meriendes-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16

# ==========================================
# Volumes (Persistencia de Datos)
# ==========================================
volumes:
  postgres-data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: ./docker/volumes/postgres

  # redis-data:
  #   driver: local
  #   driver_opts:
  #     type: none
  #     o: bind
  #     device: ./docker/volumes/redis
```

---

### 3.2 docker-compose.override.yml - Configuración de Desarrollo

```yaml
# ============================================
# Docker Compose Override - Desarrollo Local
# Este archivo se aplica automáticamente sobre docker-compose.yml
# ============================================

version: '3.9'

services:
  app:
    # Hot-reload para desarrollo
    build:
      target: development
    command: npm run dev
    volumes:
      # Montar código fuente para hot-reload
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
    # Habilitar modo watch de Next.js
    stdin_open: true
    tty: true

  db:
    # Exponer puerto para herramientas locales (pgAdmin, DBeaver)
    ports:
      - '5432:5432'
    # Logging verboso en desarrollo
    command: postgres -c log_statement=all -c log_destination=stderr
```

---

### 3.3 .env.example - Variables de Entorno

```bash
# ============================================
# Variables de Entorno - Meriendes E-commerce
# Copiar a .env y completar con valores reales
# ============================================

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Database (Local Development)
DATABASE_URL=postgresql://meriendes:changeme@localhost:5432/meriendes_ecom

# Redis (Opcional)
REDIS_URL=redis://localhost:6379

# Application
NODE_ENV=development
PORT=3000
```

---

### 3.4 Comandos de Docker Compose

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f app

# Rebuild de imágenes después de cambios
docker-compose up -d --build

# Ejecutar migraciones de base de datos
docker-compose exec db psql -U meriendes -d meriendes_ecom -f /docker-entrypoint-initdb.d/01-schema.sql

# Acceder a shell de PostgreSQL
docker-compose exec db psql -U meriendes -d meriendes_ecom

# Ejecutar tests dentro del contenedor
docker-compose exec app npm run test

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra datos)
docker-compose down -v

# Ver estado de servicios
docker-compose ps

# Verificar health checks
docker-compose ps --format json | jq '.[].Health'
```

---

## 4. Pipeline de CI/CD con Docker

El pipeline de CI/CD propuesto integra construcción de imágenes Docker, ejecución de pruebas automatizadas y despliegue a entornos staging/producción.

### 4.1 Arquitectura del Pipeline

```mermaid
flowchart TB
    Start([Git Push a develop/main])

    Start --> Trigger{Trigger Workflow}

    Trigger --> Checkout[Checkout Código<br/>actions/checkout@v4]

    Checkout --> SetupDocker[Setup Docker Buildx<br/>docker/setup-buildx-action@v3]

    SetupDocker --> BuildTest[Build Test Image<br/>docker build --target=test]

    BuildTest --> ParallelTests{Ejecutar Tests en Paralelo}

    subgraph "Tests en Contenedor"
        ParallelTests --> UnitTest[Unit Tests<br/>npm run test:coverage]
        ParallelTests --> Lint[Linting<br/>npm run lint]
        ParallelTests --> TypeCheck[Type Check<br/>tsc --noEmit]
    end

    UnitTest --> CollectResults{Tests Pasaron?}
    Lint --> CollectResults
    TypeCheck --> CollectResults

    CollectResults -->|Sí| BuildProd[Build Production Image<br/>docker build --target=runner]
    CollectResults -->|No| FailPipeline([❌ Pipeline Falla])

    BuildProd --> TagImage[Tag Image<br/>meriendes:latest<br/>meriendes:commit-sha]

    TagImage --> PushRegistry[Push a Registry<br/>Docker Hub / ECR / GCR]

    PushRegistry --> DeployDecision{Branch?}

    DeployDecision -->|develop| DeployStaging[Deploy a Staging<br/>docker-compose pull<br/>docker-compose up -d]
    DeployDecision -->|main| DeployProd[Deploy a Producción<br/>Requiere aprobación manual]

    DeployStaging --> SmokeTests[Smoke Tests<br/>Health checks automáticos]
    DeployProd --> SmokeTests

    SmokeTests --> Success{Tests OK?}

    Success -->|Sí| NotifySuccess[Notificación: Deploy OK<br/>Slack/Email]
    Success -->|No| Rollback[Rollback Automático<br/>docker-compose pull meriendes:previous]

    Rollback --> NotifyFailure[Notificación: Rollback Ejecutado]

    NotifySuccess --> End([✅ Pipeline Completo])
    NotifyFailure --> End
    FailPipeline --> End

    style Start fill:#90EE90
    style Success fill:#90EE90
    style NotifySuccess fill:#90EE90
    style FailPipeline fill:#ffcccc
    style NotifyFailure fill:#ffcccc
    style ParallelTests fill:#fff9c4
```

---

### 4.2 GitHub Actions Workflow con Docker

Crear archivo `.github/workflows/docker-ci-cd.yml`:

```yaml
name: Docker CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  REGISTRY: docker.io
  IMAGE_NAME: meriendes/ecommerce-app

permissions:
  contents: read
  pull-requests: write
  packages: write

jobs:
  # ==========================================
  # Job 1: Build y Test en Docker
  # ==========================================
  build-and-test:
    name: Build Docker Image & Run Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build test image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          target: builder
          tags: meriendes-test:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          load: true
          build-args: |
            NEXT_PUBLIC_SUPABASE_URL=${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
            NEXT_PUBLIC_SUPABASE_ANON_KEY=${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}

      - name: Run unit tests in container
        run: |
          docker run --rm \
            -e NODE_ENV=test \
            meriendes-test:${{ github.sha }} \
            npm run test:coverage

      - name: Run linting
        run: |
          docker run --rm \
            meriendes-test:${{ github.sha }} \
            npm run lint

      - name: Run type check
        run: |
          docker run --rm \
            meriendes-test:${{ github.sha }} \
            npx tsc --noEmit

      - name: Upload test coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info

  # ==========================================
  # Job 2: Build Production Image
  # ==========================================
  build-production:
    name: Build Production Docker Image
    needs: build-and-test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=semver,pattern={{version}}
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push production image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NEXT_PUBLIC_SUPABASE_URL=${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
            NEXT_PUBLIC_SUPABASE_ANON_KEY=${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}

  # ==========================================
  # Job 3: Deploy to Staging (develop branch)
  # ==========================================
  deploy-staging:
    name: Deploy to Staging Environment
    needs: build-production
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.meriendes.com

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /opt/meriendes-staging
            docker-compose pull
            docker-compose up -d --no-build
            docker-compose exec -T app npm run db:migrate

      - name: Run smoke tests
        run: |
          sleep 30  # Esperar a que la app inicie
          curl -f https://staging.meriendes.com/api/health || exit 1
          curl -f https://staging.meriendes.com/ || exit 1

      - name: Notify deployment success
        uses: 8398a7/action-slack@v3
        with:
          status: success
          text: '✅ Staging deployment successful'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

  # ==========================================
  # Job 4: Deploy to Production (main branch)
  # ==========================================
  deploy-production:
    name: Deploy to Production Environment
    needs: build-production
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://meriendes.com

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Deploy via SSH (Blue-Green)
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            cd /opt/meriendes-production

            # Pull nueva imagen
            docker-compose pull

            # Deploy a ambiente "green"
            docker-compose -f docker-compose.yml -f docker-compose.green.yml up -d

            # Health check
            sleep 30
            curl -f http://localhost:3001/api/health || exit 1

            # Switch traffic (Nginx reload)
            sudo nginx -s reload

            # Detener ambiente "blue" anterior
            docker-compose -f docker-compose.yml -f docker-compose.blue.yml down

      - name: Run production smoke tests
        run: |
          curl -f https://meriendes.com/api/health || exit 1
          curl -f https://meriendes.com/ || exit 1

      - name: Notify deployment success
        uses: 8398a7/action-slack@v3
        with:
          status: success
          text: '🚀 Production deployment successful'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

### 4.3 Estrategia de Despliegue Blue-Green

El sistema utiliza despliegue blue-green para cero downtime en producción:

**Configuración Nginx** (`/etc/nginx/sites-available/meriendes.com`):

```nginx
upstream meriendes_blue {
    server localhost:3000 max_fails=3 fail_timeout=30s;
}

upstream meriendes_green {
    server localhost:3001 max_fails=3 fail_timeout=30s;
}

# Variable para switch activo/inactivo
map $cookie_environment $backend {
    default meriendes_blue;
    green meriendes_green;
}

server {
    listen 80;
    listen 443 ssl http2;
    server_name meriendes.com www.meriendes.com;

    ssl_certificate /etc/letsencrypt/live/meriendes.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/meriendes.com/privkey.pem;

    location / {
        proxy_pass http://$backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check endpoint
    location /api/health {
        access_log off;
        proxy_pass http://$backend;
    }
}
```

**docker-compose.blue.yml**:

```yaml
version: '3.9'
services:
  app:
    container_name: meriendes-blue
    ports:
      - '3000:3000'
```

**docker-compose.green.yml**:

```yaml
version: '3.9'
services:
  app:
    container_name: meriendes-green
    ports:
      - '3001:3000'
```

---

### 4.4 Rollback Automático

Script de rollback (`scripts/rollback.sh`):

```bash
#!/bin/bash
# ============================================
# Script de Rollback Automático
# ============================================

set -e

ENVIRONMENT=${1:-staging}
PREVIOUS_VERSION=${2:-previous}

echo "🔄 Iniciando rollback a versión: $PREVIOUS_VERSION"

if [ "$ENVIRONMENT" == "staging" ]; then
    SSH_HOST=$STAGING_HOST
    SSH_USER=$STAGING_USER
    DEPLOY_PATH=/opt/meriendes-staging
elif [ "$ENVIRONMENT" == "production" ]; then
    SSH_HOST=$PRODUCTION_HOST
    SSH_USER=$PRODUCTION_USER
    DEPLOY_PATH=/opt/meriendes-production
else
    echo "❌ Ambiente inválido: $ENVIRONMENT"
    exit 1
fi

# Ejecutar rollback via SSH
ssh $SSH_USER@$SSH_HOST << EOF
    cd $DEPLOY_PATH

    # Pull imagen anterior
    docker-compose pull meriendes:$PREVIOUS_VERSION

    # Actualizar tag en docker-compose.yml
    sed -i 's/image: meriendes:.*/image: meriendes:$PREVIOUS_VERSION/' docker-compose.yml

    # Restart services
    docker-compose up -d --no-build

    # Verificar health
    sleep 30
    curl -f http://localhost:3000/api/health || exit 1
EOF

echo "✅ Rollback completado exitosamente"

# Notificar a Slack
curl -X POST $SLACK_WEBHOOK \
  -H 'Content-Type: application/json' \
  -d "{\"text\":\"⚠️ Rollback ejecutado en $ENVIRONMENT a versión $PREVIOUS_VERSION\"}"
```

---

## 5. Monitoreo y Observabilidad

### 5.1 Métricas de Contenedores

**Prometheus + Grafana Stack** (docker-compose.monitoring.yml):

```yaml
version: '3.9'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - '9090:9090'
    networks:
      - meriendes-network

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    volumes:
      - grafana-data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
    ports:
      - '3001:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    networks:
      - meriendes-network

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    ports:
      - '9100:9100'
    networks:
      - meriendes-network

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: cadvisor
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    ports:
      - '8080:8080'
    networks:
      - meriendes-network

volumes:
  prometheus-data:
  grafana-data:

networks:
  meriendes-network:
    external: true
```

---

## 6. Resumen Ejecutivo

### 6.1 Beneficios de la Arquitectura Docker

**Portabilidad**:

- La aplicación corre idénticamente en dev, staging y producción
- Elimina "funciona en mi máquina"

**Escalabilidad**:

- Fácil escalar horizontalmente (múltiples instancias del contenedor app)
- Docker Swarm o Kubernetes para orquestación avanzada

**Consistencia**:

- Dependencias embebidas en imagen
- Versiones de runtime (Node.js 20) garantizadas

**Velocidad de despliegue**:

- Deployment en <2 minutos con imágenes pre-construidas
- Rollback en <1 minuto

**Seguridad**:

- Imágenes ejecutan con usuario no-root
- Network isolation entre servicios
- Secrets management via environment variables cifradas

### 6.2 Próximos Pasos

1. **Implementar Dockerfiles**: Sprint actual
2. **Configurar Docker Hub registry**: Sprint 2
3. **Migrar CI/CD a Docker-based pipeline**: Sprint 3
4. **Setup de ambiente staging con Docker**: Sprint 3
5. **Blue-green deployment en producción**: Sprint 4

---

**Fin de Sección 3.4 - Diseño de Solución con Docker**

---

**Documento preparado por**: Equipo Meriendes E-commerce  
**Fecha**: Diciembre 10, 2025  
**Próxima revisión**: Post-implementación Sprint 3
