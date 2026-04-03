# Oro Rojo 29 - E-commerce de Productos de Cobre

Tienda web para venta de utensilios y productos de cobre artesanales.

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
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
│   ├── admin/                   # Panel admin custom
│   ├── page.tsx                 # Home
│   ├── productos/               # Catálogo
│   │   ├── page.tsx             # Listado
│   │   └── [slug]/page.tsx     # Detalle
│   ├── categorias/[categoria]/  # Productos por categoría
│   ├── contacto/                # Contacto
│   └── api/                     # API routes
│       ├── products/           # CRUD productos
│       ├── categories/         # CRUD categorías
│       ├── images/             # Upload de imágenes
│       ├── auth/               # Login simple
│       └── contact/            # Contact form
├── components/                  # Componentes reutilizables
│   ├── ui/                      # WhatsApp, Button
│   ├── layout/                  # Navbar, Footer
│   └── products/                # ProductCard
├── lib/                         # Utilidades
│   ├── db.ts                   # Conexión PostgreSQL
│   ├── data.ts                 # Funciones para obtener datos
│   └── types.ts                # Tipos TypeScript
└── public/images/               # Imágenes estáticas
    └── placeholder.svg          # Fallback para productos sin imagen
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

- **Password:** `ADMIN_PASSWORD` (del archivo `.env.local`)

El panel permite:
- Agregar/editar/eliminar productos
- Agregar/eliminar categorías
- Subir imágenes directamente a la DB

## Variables de Entorno

```bash
cp .env.local.example .env.local
```

Variables necesarias:

| Variable | Descripción |
|----------|-------------|
| `POSTGRES_URL` | URL de conexión a Neon PostgreSQL |
| `ADMIN_PASSWORD` | Password para acceder al admin |
| `RESEND_API_KEY` | API Key de Resend (para emails) |
| `NEXT_PUBLIC_SERVER_URL` | URL del sitio |

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
- [x] Formulario de contacto
- [x] Botón WhatsApp flotante
- [x] Responsive design
- [x] Dark theme con acentos en cobre
- [x] Placeholder para productos sin imagen

### Backend (API Custom)
- [x] Panel admin simple (sin Payload CMS)
- [x] CRUD Productos (sin imágenes complicadas)
- [x] CRUD Categorías
- [x] Upload de imágenes a PostgreSQL (BYTEA)
- [x] Autenticación simple por password

### API Routes

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/products` | GET | Listar productos |
| `/api/products` | POST | Crear producto |
| `/api/products?id={id}` | PUT | Editar producto |
| `/api/products?id={id}` | DELETE | Eliminar producto |
| `/api/categories` | GET | Listar categorías |
| `/api/categories` | POST | Crear categoría |
| `/api/categories?id={id}` | DELETE | Eliminar categoría |
| `/api/images` | POST | Subir imagen (max 2MB) |
| `/api/images?id={id}` | GET | Ver imagen |
| `/api/auth` | POST | Validar password |

## Base de Datos

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `products` | Catálogo de productos |
| `categories` | Categorías de productos |
| `images` | Imágenes almacenadas como BYTEA |

### Schema Products
- `id` - ID único
- `name` - Nombre
- `slug` - URL amigable (auto-generado)
- `price` - Precio
- `description` - Descripción
- `category_id` - FK a categories
- `stock` - Stock (nullable)
- `featured` - Boolean (destacado)
- `image_id` - FK a images (nullable)
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### Schema Categories
- `id` - ID único
- `name` - Nombre
- `slug` - URL amigable (auto-generado)
- `description` - Descripción
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### Schema Images
- `id` - ID único
- `filename` - Nombre del archivo
- `mime_type` - Tipo MIME
- `data` - Binary de la imagen

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
   - Agregar las variables de entorno:
     - `POSTGRES_URL`
     - `ADMIN_PASSWORD`
     - `RESEND_API_KEY`
   - Deploy automático

3. **La DB ya tiene datos** - Los productos y categorías se mantienen.

## Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.