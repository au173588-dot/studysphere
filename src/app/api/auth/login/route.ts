import { NextRequest, NextResponse } from 'next/server';
import {
  createSessionToken,
  getSessionCookieMaxAge,
  SESSION_COOKIE_NAME,
  verifyPassword,
} from '@/lib/auth';
import { readDatabase } from '@/lib/serverStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please enter both your email and password.' },
        { status: 400 }
      );
    }

    const db = readDatabase();
    const user = db.users.find((u) => u.email === email);
    if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const token = createSessionToken(user.id);
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        interests: user.interests,
        personalizationEnabled: user.personalizationEnabled,
      },
      bookmarks: user.bookmarks,
      completedSteps: user.completedSteps,
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: getSessionCookieMaxAge(),
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Sign in failed. Please try again.' }, { status: 500 });
  }
}
