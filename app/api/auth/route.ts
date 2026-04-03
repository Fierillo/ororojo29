import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SESSION_COOKIE = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const validPassword = process.env.ADMIN_PASSWORD;

    if (password === validPassword) {
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + SESSION_DURATION).toUTCString();
      
      const response = NextResponse.json({ success: true });
      response.cookies.set(SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(expires),
        path: '/',
      });
      
      return response;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE);
  if (session?.value) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, '', { expires: new Date(0), path: '/' });
  return response;
}