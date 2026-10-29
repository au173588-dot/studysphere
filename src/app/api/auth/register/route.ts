import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  createSessionToken,
  getSessionCookieMaxAge,
  hashPassword,
  SESSION_COOKIE_NAME,
} from '@/lib/auth';
import { readDatabase, StoredUser, writeDatabase } from '@/lib/serverStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');
    const initialInterests = Array.isArray(body?.interests) ? body.interests.slice(0, 12) : [];
    const initialBookmarks = Array.isArray(body?.bookmarks) ? body.bookmarks.slice(0, 200) : [];
    const initialSteps =
      body?.completedSteps && typeof body.completedSteps === 'object' ? body.completedSteps : {};

    if (name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 80 characters.' },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const db = readDatabase();
    if (db.users.some((u) => u.email === email)) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.' },
        { status: 409 }
      );
    }

    const { salt, hash } = hashPassword(password);
    const verificationToken = crypto.randomBytes(20).toString('hex');

    const newUser: StoredUser = {
      id: `usr_${crypto.randomBytes(8).toString('hex')}`,
      name,
      email,
      passwordSalt: salt,
      passwordHash: hash,
      emailVerified: false,
      verificationToken,
      createdAt: new Date().toISOString(),
      interests: initialInterests,
      personalizationEnabled: true,
      bookmarks: initialBookmarks,
      completedSteps: initialSteps,
    };

    db.users.push(newUser);
    writeDatabase(db);

    const token = createSessionToken(newUser.id);
    const response = NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        emailVerified: newUser.emailVerified,
        createdAt: newUser.createdAt,
        interests: newUser.interests,
        personalizationEnabled: newUser.personalizationEnabled,
      },
      bookmarks: newUser.bookmarks,
      completedSteps: newUser.completedSteps,
      verificationPreviewToken: process.env.RESEND_API_KEY ? undefined : verificationToken,
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: getSessionCookieMaxAge(),
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
