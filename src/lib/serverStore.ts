import fs from 'fs';
import path from 'path';
import { BookmarkItem } from '@/types';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordSalt: string;
  passwordHash: string;
  emailVerified: boolean;
  verificationToken?: string;
  resetTokenHash?: string;
  resetTokenExpires?: number;
  createdAt: string;
  interests: string[];
  personalizationEnabled: boolean;
  bookmarks: BookmarkItem[];
  completedSteps: Record<string, number[]>;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  deliveredViaEmail: boolean;
}

export interface NewsletterSubscriber {
  email: string;
  focusSubject: string;
  subscribedAt: string;
}

interface DatabaseSchema {
  users: StoredUser[];
  contactMessages: ContactSubmission[];
  newsletterSubscribers: NewsletterSubscriber[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

const EMPTY_DB: DatabaseSchema = {
  users: [],
  contactMessages: [],
  newsletterSubscribers: [],
};

export function readDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(STORE_PATH, JSON.stringify(EMPTY_DB, null, 2), 'utf-8');
      return structuredClone(EMPTY_DB);
    }
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      contactMessages: Array.isArray(parsed.contactMessages) ? parsed.contactMessages : [],
      newsletterSubscribers: Array.isArray(parsed.newsletterSubscribers)
        ? parsed.newsletterSubscribers
        : [],
    };
  } catch {
    return structuredClone(EMPTY_DB);
  }
}

export function writeDatabase(db: DatabaseSchema): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(db, null, 2), 'utf-8');
}
