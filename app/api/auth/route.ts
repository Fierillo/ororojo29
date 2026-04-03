import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import pool from '@/lib/db';

const SESSION_COOKIE = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

async function hashToken(token: string): Promise<string> {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function isTokenValid(token: string): Promise<boolean> {
  const hashedToken = await hashToken(token);
  const result = await pool.query(
    'SELECT expires_at, invalidated FROM sessions WHERE token = $1',
    [hashedToken]
  );
  
  if (result.rows.length === 0) return false;
  
  const session = result.rows[0];
  if (session.invalidated) return false;
  
  return new Date(session.expires_at) > new Date();
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW);
  
  const result = await pool.query(
    `SELECT COUNT(*) as attempts FROM auth_attempts 
     WHERE ip_address = $1 AND created_at > $2`,
    [ip, windowStart]
  );
  
  const attempts = parseInt(result.rows[0].attempts);
  return attempts < MAX_ATTEMPTS;
}

async function recordAttempt(ip: string, success: boolean) {
  await pool.query(
    'INSERT INTO auth_attempts (ip_address, success) VALUES ($1, $2)',
    [ip, success]
  );
}

async function cleanupOldAttempts() {
  const cutoff = new Date(Date.now() - RATE_LIMIT_WINDOW);
  await pool.query('DELETE FROM auth_attempts WHERE created_at < $1', [cutoff]);
}

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Intenta más tarde.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { password } = body;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (password !== validPassword) {
      await recordAttempt(ip, false);
      return NextResponse.json({ error: 'Password incorrecto' }, { status: 401 });
    }

    await recordAttempt(ip, true);
    cleanupOldAttempts().catch(console.error);

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await hashToken(sessionToken);
    const expiresAt = new Date(Date.now() + SESSION_DURATION);
    
    await pool.query(
      'INSERT INTO sessions (token, expires_at) VALUES ($1, $2)',
      [hashedToken, expiresAt]
    );

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: expiresAt,
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE);
  if (!session?.value) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const isValid = await isTokenValid(session.value);
  if (!isValid) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE);
  
  if (session?.value) {
    const hashedToken = await hashToken(session.value);
    await pool.query('UPDATE sessions SET invalidated = TRUE WHERE token = $1', [hashedToken]);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, '', { expires: new Date(0), path: '/' });
  return response;
}