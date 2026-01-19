import { NextResponse } from 'next/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log('[Admin Auth] Login attempt:', { 
      email, 
      hasEnvEmail: !!ADMIN_EMAIL, 
      hasEnvPassword: !!ADMIN_PASSWORD,
      envEmailLength: ADMIN_EMAIL.length,
      inputEmailMatch: email === ADMIN_EMAIL,
      inputPasswordMatch: password === ADMIN_PASSWORD
    });

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      console.log('[Admin Auth] Success');
      return NextResponse.json({ success: true });
    }

    console.log('[Admin Auth] Failed: Invalid credentials');
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}
