import crypto from 'crypto';
import { cookies } from 'next/headers';
import { readDatabase, StoredUser } from './serverStore';

export const SESSION_COOKIE_NAME = 'studysphere_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days

function getSecret(): string {
  return (
    process.env.AUTH_SECRET ||
    'studysphere-local-dev-secret-change-in-production-env-9f4c2b8a1d7e'
  );
}

export function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, actualSalt, 64).toString('hex');
  return { salt: actualSalt, hash: derived };
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const { hash } = hashPassword(password, salt);
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(storedHash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function hashResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function createSessionToken(userId: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${userId}.${expiresAt}`;
  const sig = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [userId, expiresStr, sig] = parts;
  const expiresAt = Number(expiresStr);
  if (!userId || Number.isNaN(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) {
    return null;
  }
  const payload = `${userId}.${expiresStr}`;
  const expectedSig = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
  const a = Buffer.from(sig, 'hex');
  const b = Buffer.from(expectedSig, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return null;
  }
  return userId;
}

export function getAuthenticatedUser(): StoredUser | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    const userId = verifySessionToken(token);
    if (!userId) return null;
    const db = readDatabase();
    return db.users.find((u) => u.id === userId) || null;
  } catch {
    return null;
  }
}

export function getSessionCookieMaxAge(): number {
  return SESSION_TTL_SECONDS;
}
