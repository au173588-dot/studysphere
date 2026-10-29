import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, hashResetToken } from '@/lib/auth';
import { readDatabase, writeDatabase } from '@/lib/serverStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = String(body?.action || 'request');

    if (action === 'request') {
      const email = String(body?.email || '').trim().toLowerCase();
      const db = readDatabase();
      const user = db.users.find((u) => u.email === email);

      if (!user) {
        // Prevent account enumeration while remaining clear
        return NextResponse.json({
          ok: true,
          message:
            'If an account matches that email, a password reset token has been generated.',
        });
      }

      const rawToken = crypto.randomBytes(18).toString('hex');
      user.resetTokenHash = hashResetToken(rawToken);
      user.resetTokenExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
      writeDatabase(db);

      const hasEmailProvider = Boolean(process.env.RESEND_API_KEY?.trim());
      return NextResponse.json({
        ok: true,
        message: hasEmailProvider
          ? 'Password reset instructions have been sent to your email.'
          : 'Local setup mode (no RESEND_API_KEY configured): use the single-use reset token below within 30 minutes.',
        devResetToken: hasEmailProvider ? undefined : rawToken,
      });
    }

    if (action === 'confirm') {
      const email = String(body?.email || '').trim().toLowerCase();
      const token = String(body?.token || '').trim();
      const newPassword = String(body?.newPassword || '');

      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: 'New password must be at least 8 characters.' },
          { status: 400 }
        );
      }

      const db = readDatabase();
      const user = db.users.find((u) => u.email === email);
      if (
        !user ||
        !user.resetTokenHash ||
        !user.resetTokenExpires ||
        user.resetTokenExpires < Date.now() ||
        user.resetTokenHash !== hashResetToken(token)
      ) {
        return NextResponse.json(
          { error: 'Invalid or expired reset token.' },
          { status: 400 }
        );
      }

      const { salt, hash } = hashPassword(newPassword);
      user.passwordSalt = salt;
      user.passwordHash = hash;
      user.resetTokenHash = undefined;
      user.resetTokenExpires = undefined;
      writeDatabase(db);

      return NextResponse.json({
        ok: true,
        message: 'Your password has been updated. You can now sign in.',
      });
    }

    if (action === 'verify-email') {
      const token = String(body?.token || '').trim();
      const db = readDatabase();
      const user = db.users.find((u) => u.verificationToken && u.verificationToken === token);
      if (!user) {
        return NextResponse.json({ error: 'Invalid verification token.' }, { status: 400 });
      }
      user.emailVerified = true;
      user.verificationToken = undefined;
      writeDatabase(db);
      return NextResponse.json({ ok: true, message: 'Email verified!' });
    }

    return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Password reset request failed.' }, { status: 500 });
  }
}
