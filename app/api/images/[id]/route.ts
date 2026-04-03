import { NextRequest, NextResponse } from 'next/server';
import { images } from '@/lib/crud';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Image ID required' }, { status: 400 });

  try {
    const img = await images.get(Number(id));
    if (!img) return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    return new NextResponse(img.data, {
      headers: { 'Content-Type': img.mime_type || 'image/jpeg', 'Cache-Control': 'public, max-age=31536000' },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}