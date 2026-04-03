import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

const SESSION_COOKIE = 'admin_session';

export async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  const session = request.cookies.get(SESSION_COOKIE);
  if (!session?.value) return false;

  const result = await pool.query(
    'SELECT expires_at FROM sessions WHERE token = $1',
    [session.value]
  );
  
  if (result.rows.length === 0) return false;
  return new Date(result.rows[0].expires_at) > new Date();
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}