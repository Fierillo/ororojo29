import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'admin_session';

export function verifyAdminAuth(request: NextRequest): boolean {
  return request.cookies.has(SESSION_COOKIE);
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}