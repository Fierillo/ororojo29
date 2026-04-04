import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import pool from '@/lib/db';

const SESSION_COOKIE = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

async function isTokenValid(token: string): Promise<boolean> {
  const result = await pool.query(
    'SELECT expires_at FROM sessions WHERE token = $1',
    [token]
  );
  
  if (result.rows.length === 0) return false;
  return new Date(result.rows[0].expires_at) > new Date();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (password !== validPassword) {
      return NextResponse.json({ error: 'Password incorrecto' }, { status: 401 });
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_DURATION);
    
    await pool.query(
      'INSERT INTO sessions (token, expires_at) VALUES ($1, $2)',
      [sessionToken, expiresAt]
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
    await pool.query('DELETE FROM sessions WHERE token = $1', [session.value]);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, '', { expires: new Date(0), path: '/' });
  return response;
}