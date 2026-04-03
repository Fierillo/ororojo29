import { NextRequest, NextResponse } from 'next/server';
import { images } from '@/lib/crud';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    if (!id) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
    }

    const img = await images.get(Number(id));
    
    if (!img) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return new NextResponse(img.data, {
      headers: { 
        'Content-Type': img.mimeType || 'image/jpeg', 
        'Cache-Control': 'public, max-age=31536000' 
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}