# Oro Rojo - Tienda de Productos de Cobre

Tienda web para venta de utensilios y productos de cobre artesanales.

## Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Estilos**: Tailwind CSS + CSS custom
- **Iconos**: Lucide React
- **Animaciones**: Framer Motion
- **Hosting**: Vercel

## Estructura del Proyecto

```
ororojo29/
├── app/                      # Páginas (App Router)
│   ├── page.tsx              # Home
│   ├── productos/            # Catálogo
│   │   ├── page.tsx          # Listado
│   │   └── [slug]/page.tsx  # Detalle
│   ├── categorias/[categoria]/
│   └── contacto/             # WhatsApp + Formulario
├── components/               # Componentes reutilizables
│   ├── ui/                   # Button, Container, WhatsApp
│   ├── layout/               # Navbar, Footer, MainLayout
│   ├── products/             # ProductCard
│   └── forms/                # ContactForm
├── lib/                      # Utilidades y datos
│   ├── data.ts               # Productos y categorías (mock)
│   └── types.ts              # Tipos TypeScript
└── public/                   # Assets estáticos
    ├── logo.png
    └── images/
```

## Instalación

```bash
pnpm install
```

## Desarrollo

```bash
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000)

## Build

```bash
pnpm build
```

## Variables de Entorno

Creá un archivo `.env.local` basándote en `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Variables necesarias:

- `WHATSAPP_NUMBER`: Número de WhatsApp (sin +, formato: 5491112345678)
- `POSTGRES_URL` o `DATABASE_URL`: URL de conexión a PostgreSQL (para Payload CMS)
- `PAYLOAD_SECRET`: Secreto para Payload CMS
- `RESEND_API_KEY`: API Key de Resend (para emails)
- `NEXT_PUBLIC_SERVER_URL`: URL del sitio (ej: http://localhost:3000)

## Funcionalidades

### Frontend
- [x] Home con productos destacados
- [x] Catálogo de productos
- [x] Filtro por categorías
- [x] Detalle de producto
- [x] Formulario de contacto
- [x] Botón WhatsApp flotante
- [x] Responsive design
- [x] SEO optimizado

### Backend (próximamente)
- [ ] Payload CMS (panel admin)
- [ ] Base de datos PostgreSQL
- [ ] Integración email (Resend)

## Personalización

### Colores

Los colores están definidos en `app/globals.css`:

```css
--cobre: #b87333;
--cobre-light: #d4a76a;
--cobre-dark: #8b5a2b;
--energia: #ff6b35;
--energia-glow: #ff8c42;
--crema: #f5f0e6;
--oro: #c9a227;
```

### Productos

Los productos de ejemplo están en `lib/data.ts`. Para agregar productos:

1. Editá `lib/data.ts`
2. Agregá un nuevo producto con la estructura:

```typescript
{
  id: "nuevo-id",
  name: "Nombre del producto",
  slug: "slug-del-producto",
  description: "Descripción...",
  price: 15000,
  images: ["/images/producto.jpg"],
  category: categories[0], // usar categoría existente
  featured: true, // opcional
}
```

### Imágenes

Las imágenes de productos deben ir en `/public/images/`.

## Próximos Pasos

1. **Configurar Payload CMS**:
   ```bash
   npm install @payloadcms/next @payloadcms/db-vercel-postgres
   ```

2. **Variables de entorno**:
   - Crear base de datos en Vercel Postgres o Neon
   - Configurar `POSTGRES_URL` en `.env.local`

3. **Deploy en Vercel**:
   ```bash
   git push origin main
   ```
   Vercel detecta automáticamente Next.js y hace deploy.

## Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.