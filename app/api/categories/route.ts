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
    const { name } = await request.json();
    const cat = await categories.create(name);
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
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Category ID required' }, { status: 400 });

    await categories.delete(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}