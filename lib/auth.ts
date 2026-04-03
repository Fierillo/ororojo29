import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import pool from '@/lib/db';

const SESSION_COOKIE = 'admin_session';

async function hashToken(token: string): Promise<string> {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  const session = request.cookies.get(SESSION_COOKIE);
  if (!session?.value) return false;

  const hashedToken = await hashToken(session.value);
  const result = await pool.query(
    'SELECT expires_at, invalidated FROM sessions WHERE token = $1',
    [hashedToken]
  );
  
  if (result.rows.length === 0) return false;
  
  const sessionData = result.rows[0];
  if (sessionData.invalidated) return false;
  
  return new Date(sessionData.expires_at) > new Date();
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}