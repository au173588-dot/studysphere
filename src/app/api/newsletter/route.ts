import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/serverStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const focusSubject = String(body?.focusSubject || 'all').trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const db = readDatabase();
    const existing = db.newsletterSubscribers.find((s) => s.email === email);
    if (existing) {
      existing.focusSubject = focusSubject;
      writeDatabase(db);
      return NextResponse.json({
        ok: true,
        message: 'Your study update preferences have been updated on our server list.',
      });
    }

    db.newsletterSubscribers.push({
      email,
      focusSubject,
      subscribedAt: new Date().toISOString(),
    });
    writeDatabase(db);

    return NextResponse.json({
      ok: true,
      message:
        'Subscribed! Your email is saved to our server study-updates list. You can unsubscribe anytime.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Could not save subscription. Please try again.' },
      { status: 500 }
    );
  }
}
