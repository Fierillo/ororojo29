# Oro Rojo 29 - E-commerce de Productos de Cobre

Tienda web para venta de utensilios y productos de cobre artesanales.

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **CMS**: Payload CMS 3.0
- **Base de Datos**: Neon PostgreSQL
- **Estilos**: Tailwind CSS v4
- **Iconos**: Lucide React
- **Animaciones**: Framer Motion
- **Email**: Resend
- **Hosting**: Vercel

## Estructura del Proyecto

```
ororojo29/
├── app/                         # Páginas (App Router)
│   ├── (payload)/               # Payload CMS routes
│   │   ├── admin/               # Admin panel
│   │   └── api/                # API routes
│   ├── page.tsx                 # Home
│   ├── productos/              # Catálogo
│   │   ├── page.tsx            # Listado
│   │   └── [slug]/page.tsx     # Detalle
│   ├── categorias/[categoria]/ # Productos por categoría
│   ├── contacto/               # WhatsApp + Formulario
│   └── api/contact/            # Contact form API
├── src/                         # Payload CMS config
│   ├── payload.config.ts       # Main config
│   ├── collections/            # Collections
│   │   ├── Users.ts           # User authentication
│   │   ├── Media.ts           # Media uploads
│   │   ├── Products.ts        # Products
│   │   └── Categories.ts      # Categories
│   ├── globals/               # Globals
│   │   └── AdminData.ts       # Site config (WhatsApp, footer, etc)
│   └── seed.ts                # Seed script
├── components/                  # Componentes reutilizables
│   ├── ui/                      # Button, Container, WhatsApp
│   ├── layout/                  # Navbar, Footer, MainLayout
│   ├── products/                # ProductCard
│   └── forms/                   # ContactForm
├── lib/                         # Utilidades
│   └── payload.ts              # Payload client
└── public/                      # Assets estáticos
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000)

## Admin Panel

Accedé al panel de admin en: [http://localhost:3000/admin](http://localhost:3000/admin)

### Credenciales

- **Email:** `admin@ororojo29.com`
- **Password:** Tu `PAYLOAD_SECRET` (del archivo `.env.local`)

El usuario admin se crea automáticamente la primera vez que iniciás el servidor.

## Variables de Entorno

Creá un archivo `.env.local` basándote en `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Variables necesarias:

| Variable | Descripción |
|----------|-------------|
| `POSTGRES_URL` | URL de conexión a Neon PostgreSQL |
| `PAYLOAD_SECRET` | Secreto para Payload CMS (usado también como password del admin) |
| `RESEND_API_KEY` | API Key de Resend (para emails del formulario) |
| `NEXT_PUBLIC_SERVER_URL` | URL del sitio (ej: http://localhost:3000) |

## Build

```bash
pnpm build
```

## Features

### Frontend

- [x] Home con productos destacados
- [x] Catálogo de productos
- [x] Filtro por categorías
- [x] Detalle de producto
- [x] Formulario de contacto con validación
- [x] Botón WhatsApp flotante
- [x] Responsive design
- [x] Dark theme con acentos en cobre

### Backend (Payload CMS)

- [x] Panel de administración
- [x] Colección Productos (CRUD)
- [x] Colección Categorías
- [x] Colección Media (uploads)
- [x] Global AdminData (configuración del sitio)
- [x] Sistema de autenticación simplificado
- [x] Registro de usuarios deshabilitado (solo 1 admin)

### API

- [x] `/api/contact` - Formulario de contacto (envía email via Resend)

## Deployment a Vercel

1. **Push a GitHub:**
   ```bash
   git add .
   git commit -m "feat: initial commit"
   git push origin main
   ```

2. **Deploy en Vercel:**
   - Ir a [vercel.com](https://vercel.com)
   - Importar el repositorio
   - Agregar las variables de entorno en Settings:
     - `POSTGRES_URL`
     - `PAYLOAD_SECRET`
     - `RESEND_API_KEY`
     - `NEXT_PUBLIC_SERVER_URL`
   - Deploy automático

3. **Primera vez:**
   - El `onInit` de Payload creará el usuario admin automáticamente
   - Accedé a `/admin` con email: `admin@ororojo29.com` y password: tu `PAYLOAD_SECRET`

## Colecciones Payload CMS

### Products
- `name` - Nombre del producto
- `slug` - URL amigable
- `description` - Descripción (rich text)
- `price` - Precio
- `images` - Imágenes (media)
- `category` - Relación a Categories
- `featured` - Producto destacado

### Categories
- `name` - Nombre
- `slug` - URL amigable
- `description` - Descripción

### AdminData (Global)
- `whatsapp` - Número de WhatsApp
- `footer` - Texto del footer
- `contactEmail` - Email de contacto

## Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.