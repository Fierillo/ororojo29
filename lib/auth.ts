import { NextRequest, NextResponse } from 'next/server';

export function verifyAdminAuth(request: NextRequest): boolean {
  const adminPassword = request.headers.get('x-admin-password');
  const validPassword = process.env.ADMIN_PASSWORD;
  
  return adminPassword === validPassword;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}