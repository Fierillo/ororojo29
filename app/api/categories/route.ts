import { NextRequest, NextResponse } from 'next/server';
import { categories } from '@/lib/crud';

export async function GET(request: NextRequest) {
  const { verifyAdminAuth } = await import('@/lib/auth');
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const cat = await categories.getById?.(Number(id));
      return NextResponse.json(cat || null);
    }
    const all = await categories.getAll();
    return NextResponse.json(all);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { verifyAdminAuth } = await import('@/lib/auth');
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, image_id } = await request.json();
    
    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Nombre de categoría requerido' }, { status: 400 });
    }
    
    const sanitizedName = name.trim().slice(0, 100);
    
    let imageId: number | null = null;
    if (image_id !== undefined && image_id !== null) {
      const parsed = Number(image_id);
      if (!isNaN(parsed) && parsed > 0) {
        imageId = parsed;
      }
    }
    
    const cat = await categories.create(sanitizedName, undefined, imageId);
    return NextResponse.json(cat, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
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
    if (!idStr) return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    
    const id = Number(idStr);
    if (isNaN(id) || id < 1) {
      return NextResponse.json({ error: 'Category ID inválido' }, { status: 400 });
    }

    await categories.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { verifyAdminAuth } = await import('@/lib/auth');
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    if (!idStr) return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    
    const id = Number(idStr);
    if (isNaN(id) || id < 1) {
      return NextResponse.json({ error: 'Category ID inválido' }, { status: 400 });
    }

    const body = await request.json();
    const { name, intro_text, image_id } = body;

    if (!name && intro_text === undefined && image_id === undefined) {
      return NextResponse.json({ error: 'Se requiere al menos un campo para actualizar' }, { status: 400 });
    }

    const updateData: { name?: string; intro_text?: string; image_id?: number | null } = {};
    if (name && typeof name === 'string' && name.trim().length > 0) {
      updateData.name = name.trim().slice(0, 100);
    }
    if (intro_text !== undefined) {
      updateData.intro_text = typeof intro_text === 'string' ? intro_text.slice(0, 2000) : '';
    }
    if (image_id !== undefined) {
      updateData.image_id = image_id === null ? null : (Number(image_id) > 0 ? Number(image_id) : null);
    }

    const cat = await categories.update(id, updateData);
    if (!cat) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    return NextResponse.json(cat);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}