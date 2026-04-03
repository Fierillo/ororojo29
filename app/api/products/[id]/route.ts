import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/crud';

export async function PUT(request: NextRequest) {
  const { verifyAdminAuth } = await import('@/lib/auth');
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    if (!idStr) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    
    const id = Number(idStr);
    if (isNaN(id) || id < 1) {
      return NextResponse.json({ error: 'Product ID inválido' }, { status: 400 });
    }

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
    
    let categoryId: number | null = null;
    if (body.category_id !== undefined && body.category_id !== null) {
      const parsed = Number(body.category_id);
      if (isNaN(parsed) || parsed < 1) {
        return NextResponse.json({ error: 'Categoría inválida' }, { status: 400 });
      }
      categoryId = parsed;
    }
    
    let imageId: number | null = null;
    if (body.image_id !== undefined && body.image_id !== null) {
      const parsed = Number(body.image_id);
      if (isNaN(parsed) || parsed < 1) {
        return NextResponse.json({ error: 'Imagen inválida' }, { status: 400 });
      }
      imageId = parsed;
    }

    const validatedData = {
      name: body.name.trim().slice(0, 200),
      price: Math.max(0, Math.min(body.price, 999999999)),
      description: body.description.trim().slice(0, 5000),
      category_id: categoryId,
      destacado: Boolean(body.destacado),
      image_id: imageId,
      specs: typeof body.specs === 'string' ? body.specs.slice(0, 2000) : null,
    };

    const product = await products.update(id, validatedData);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { verifyAdminAuth } = await import('@/lib/auth');
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    if (!idStr) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    
    const id = Number(idStr);
    if (isNaN(id) || id < 1) {
      return NextResponse.json({ error: 'Product ID inválido' }, { status: 400 });
    }

    await products.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}