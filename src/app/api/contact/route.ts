import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { readDatabase, writeDatabase } from '@/lib/serverStore';

const ipSubmissions = new Map<string, number[]>();

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const now = Date.now();
    const recent = (ipSubmissions.get(ip) || []).filter((ts) => now - ts < 60_000);
    if (recent.length >= 5) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const subject = String(body?.subject || '').trim();
    const message = String(body?.message || '').trim();
    const websiteHoneypot = String(body?.website || '').trim();

    // Silent honeypot protection against automated spam bots
    if (websiteHoneypot) {
      return NextResponse.json({
        ok: true,
        referenceId: 'MSG-FILTERED',
        deliveredViaEmail: false,
        statusMessage: 'Thank you for your message.',
      });
    }

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: 'Please enter your name (2–100 characters).' },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }
    if (subject.length < 3 || subject.length > 140) {
      return NextResponse.json(
        { error: 'Please enter a clear subject line (3–140 characters).' },
        { status: 400 }
      );
    }
    if (message.length < 15 || message.length > 4000) {
      return NextResponse.json(
        { error: 'Please write a message between 15 and 4,000 characters.' },
        { status: 400 }
      );
    }

    const referenceId = `MSG-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    let deliveredViaEmail = false;

    const resendKey = process.env.RESEND_API_KEY?.trim();
    const notifyEmail =
      process.env.CONTACT_NOTIFICATION_EMAIL?.trim() || siteConfig.contact.supportEmail;

    if (resendKey && !notifyEmail.endsWith('.example.org')) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'StudySphere Contact <onboarding@resend.dev>',
            to: [notifyEmail],
            reply_to: email,
            subject: `[StudySphere ${referenceId}] ${subject}`,
            text: `From: ${name} <${email}>\nReference: ${referenceId}\n\n${message}`,
          }),
          signal: AbortSignal.timeout(5000),
        });
        deliveredViaEmail = emailRes.ok;
      } catch {
        deliveredViaEmail = false;
      }
    }

    const db = readDatabase();
    db.contactMessages.unshift({
      id: referenceId,
      name,
      email,
      subject,
      message,
      submittedAt: new Date().toISOString(),
      deliveredViaEmail,
    });
    writeDatabase(db);

    recent.push(now);
    ipSubmissions.set(ip, recent);

    return NextResponse.json({
      ok: true,
      referenceId,
      deliveredViaEmail,
      statusMessage: deliveredViaEmail
        ? `Your message (${referenceId}) was saved and forwarded to our support inbox.`
        : `Your inquiry (${referenceId}) has been securely saved to the StudySphere server inbox. (Note: External email forwarding will activate automatically once RESEND_API_KEY and CONTACT_NOTIFICATION_EMAIL are configured in .env.local.)`,
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to process your submission right now. Please try again.' },
      { status: 500 }
    );
  }
}
