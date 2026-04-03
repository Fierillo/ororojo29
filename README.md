# Oro Rojo 29 - E-commerce de Productos de Cobre

Tienda web para venta de utensilios y productos de cobre artesanales.

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Base de Datos**: Neon PostgreSQL con cliente `pg`
- **Estilos**: Tailwind CSS v4
- **Iconos**: Lucide React
- **Animaciones**: Framer Motion
- **Email**: Resend
- **Testing**: Vitest

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
- Configuración del sitio (whatsapp, email, horario)
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

## Testing

```bash
# Run all tests
pnpm test:run

# Run penetration tests (hacker-*)
pnpm test:hacker

# Run with coverage
pnpm test:coverage
```

### Tests de Penetración (hacker-*)

Los tests en `tests/hacker-*.test.ts` verifican la seguridad del sistema:

| Test | Verifica |
|------|----------|
| `hacker-xss-contact.test.ts` | XSS sanitization en contact form |
| `hacker-rate-limit-contact.test.ts` | Rate limiting en contact form |
| `hacker-sql-injection.test.ts` | SQL injection bloqueado |
| `hacker-invalid-input.test.ts` | Validación de input |
| `hacker-auth-bypass.test.ts` | Auth bypass bloqueado |

## Security Features

### Implementado

- ✅ Tokens de sesión con hash SHA-256 almacenados en DB
- ✅ Rate limiting (5 intentos/15min en auth, 10 en contact)
- ✅ Validación MIME de imágenes (file-type)
- ✅ Sanitización HTML en contact form
- ✅ Validación de input en products/categories
- ✅ Cookies httpOnly + secure + sameSite:strict
- ✅ Mensajes de error genéricos

### Tablas de Seguridad

| Tabla | Descripción |
|-------|-------------|
| `sessions` | Tokens de sesión (token hash, expires_at, invalidated) |
| `auth_attempts` | Intentos de login (ip_address, success, created_at) |

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
├── components/                  # Componentes reutilizables
│   ├── ui/                      # WhatsApp, Button
│   ├── layout/                  # Navbar, Footer
│   └── products/                # ProductCard
├── lib/                         # Utilidades
│   ├── db.ts                   # Conexión PostgreSQL (pg)
│   ├── crud.ts                 # Queries a DB
│   ├── auth.ts                 # Verificación de sesión
│   ├── cropImage.ts            # Utilidades de imagen
│   └── data.ts                 # Funciones para obtener datos
├── tests/                       # Tests
│   ├── cropImage.test.ts       # Tests de utilidades de imagen
│   ├── crud.test.ts            # Tests de lógica de negocio
│   └── hacker-*.test.ts        # Tests de penetración
└── public/images/               # Imágenes estáticas
    ├── placeholder.svg          # Fallback para productos sin imagen
    ├── cazuela.svg              # Imagen genérica Cocina
    ├── decoracion.svg          # Imagen genérica Decoración
    └── copas.svg                # Imagen genérica Copas y Vasos
```

## API Routes

| Endpoint | Método | Auth | Descripción |
|----------|--------|------|-------------|
| `/api/products` | GET | ❌ | Listar productos |
| `/api/products` | POST | ✅ | Crear producto |
| `/api/products?id={id}` | PUT | ✅ | Editar producto |
| `/api/products?id={id}` | DELETE | ✅ | Eliminar producto |
| `/api/categories` | GET | ✅ | Listar categorías |
| `/api/categories` | POST | ✅ | Crear categoría |
| `/api/categories?id={id}` | DELETE | ✅ | Eliminar categoría |
| `/api/images` | POST | ✅ | Subir imagen (max 2MB, solo imágenes) |
| `/api/images/{id}` | GET | ❌ | Ver imagen |
| `/api/auth` | POST | ❌ | Login (rate limited) |
| `/api/auth` | GET | ❌ | Verificar sesión |
| `/api/auth` | DELETE | ❌ | Logout (invalida sesión) |
| `/api/site-config` | GET | ✅ | Ver configuración |
| `/api/site-config` | PUT | ✅ | Actualizar configuración |
| `/api/contact` | POST | ❌ | Enviar mensaje (rate limited, sanitizado) |

## Base de Datos

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `products` | Catálogo de productos |
| `categories` | Categorías de productos |
| `images` | Imágenes almacenadas como BYTEA |
| `site_config` | Configuración del sitio (JSON) |
| `sessions` | Tokens de sesión con hash |
| `auth_attempts` | Intentos de autenticación |

## Build

```bash
pnpm build
```

## Deployment a Vercel

1. **Push a GitHub:**
   ```bash
   git add .
   git commit -m "feat: security patches applied"
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

## Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.