import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/crud';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      const product = await products.getBySlug(slug);
      return NextResponse.json(product);
    }
    const allProducts = await products.getAll();
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { verifyAdminAuth } = await import('@/lib/auth');
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 });
    }
    if (typeof body.price !== 'number' || body.price < 0) {
      return NextResponse.json({ error: 'Precio debe ser un número positivo' }, { status: 400 });
    }
    if (!body.description || typeof body.description !== 'string') {
      return NextResponse.json({ error: 'Descripción requerida' }, { status: 400 });
    }
    
    // Validate optional fields
    let categoryId: number | null = null;
    if (body.category_id !== undefined) {
      const parsed = Number(body.category_id);
      if (isNaN(parsed) || parsed < 1) {
        return NextResponse.json({ error: 'Categoría inválida' }, { status: 400 });
      }
      categoryId = parsed;
    }

    const validatedData = {
      name: body.name.trim().slice(0, 200),
      price: Math.max(0, Math.min(body.price, 999999999)),
      description: body.description.trim().slice(0, 5000),
      category_id: categoryId,
      destacado: Boolean(body.destacado),
      image_id: body.image_id ? Number(body.image_id) : null,
      specs: typeof body.specs === 'string' ? body.specs.slice(0, 2000) : null,
    };
    
    const product = await products.create(validatedData);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}