import { NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '@/lib/crud';

export async function GET(request: NextRequest) {
  const { verifyAdminAuth } = await import('@/lib/auth');
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const config = await siteConfig.get();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching site config:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { verifyAdminAuth } = await import('@/lib/auth');
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    await siteConfig.update(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating site config:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}