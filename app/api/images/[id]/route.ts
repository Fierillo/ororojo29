import { NextRequest, NextResponse } from 'next/server';
import { images } from '@/lib/crud';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const idStr = resolvedParams.id;
    
    if (!idStr) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    const id = Number(idStr);
    if (isNaN(id) || id < 1) {
      return NextResponse.json({ error: 'Image ID inválido' }, { status: 400 });
    }
    
    const img = await images.get(id);
    
    if (!img) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return new NextResponse(img.data, {
      headers: { 
        'Content-Type': img.mime_type || 'image/jpeg', 
        'Cache-Control': 'public, max-age=31536000' 
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}