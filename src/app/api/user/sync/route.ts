import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { readDatabase, writeDatabase } from '@/lib/serverStore';

export async function PUT(request: NextRequest) {
  const authUser = getAuthenticatedUser();
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const db = readDatabase();
    const user = db.users.find((u) => u.id === authUser.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (Array.isArray(body.bookmarks)) {
      user.bookmarks = body.bookmarks.slice(0, 300);
    }
    if (Array.isArray(body.interests)) {
      user.interests = body.interests.map(String).slice(0, 20);
    }
    if (typeof body.personalizationEnabled === 'boolean') {
      user.personalizationEnabled = body.personalizationEnabled;
    }
    if (body.completedSteps && typeof body.completedSteps === 'object') {
      user.completedSteps = body.completedSteps;
    }
    if (typeof body.name === 'string' && body.name.trim().length >= 2) {
      user.name = body.name.trim().slice(0, 80);
    }

    writeDatabase(db);

    return NextResponse.json({
      ok: true,
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
  } catch {
    return NextResponse.json({ error: 'Failed to sync study data.' }, { status: 500 });
  }
}
