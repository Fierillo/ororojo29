import { NextRequest, NextResponse } from 'next/server';
import { images } from '@/lib/crud';
import { fileTypeFromBuffer } from 'file-type';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

export async function POST(request: NextRequest) {
  const { verifyAdminAuth } = await import('@/lib/auth');
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 2MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileType = await fileTypeFromBuffer(buffer);
    
    if (!fileType || !ALLOWED_MIME_TYPES.includes(fileType.mime)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images allowed.' }, 
        { status: 400 }
      );
    }

    const id = await images.create(file.name, fileType.mime, buffer);
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}