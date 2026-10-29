import { NextResponse } from 'next/server';
import { getAuthenticatedUser, SESSION_COOKIE_NAME } from '@/lib/auth';
import { readDatabase, writeDatabase } from '@/lib/serverStore';

export async function GET() {
  const user = getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
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
}

export async function DELETE() {
  const user = getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const db = readDatabase();
  db.users = db.users.filter((u) => u.id !== user.id);
  writeDatabase(db);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
