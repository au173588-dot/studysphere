import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${siteConfig.brandName} handles browser bookmarks, optional user accounts, and privacy controls.`,
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card sm:p-10">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-royal">
          Last Updated: {siteConfig.legal.lastUpdated}
        </span>
        <h1 className="mt-1.5 text-2xl font-extrabold text-brand-navy sm:text-3xl">
          Privacy Policy
        </h1>

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="text-base font-bold text-brand-navy">
              1. Minimal Data Collection by Design
            </h2>
            <p className="mt-1.5">
              You can browse, search, filter, and save educational resources on{' '}
              {siteConfig.brandName} without creating an account or sharing personal information.
              For guest visitors, bookmarks, custom folders, study interests, and learning-path
              milestones are stored solely in your own browser’s <code className="font-mono">localStorage</code>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-brand-navy">
              2. Optional User Accounts & Security
            </h2>
            <p className="mt-1.5">
              If you choose to create a {siteConfig.brandName} account to synchronize bookmarks
              across devices, we store your chosen display name, email address, and a cryptographic{' '}
              <code className="font-mono">scrypt</code> password hash (never plain-text passwords).
              Sessions use signed <code className="font-mono">HttpOnly</code> cookies. You may delete
              your account permanently at any time from the{' '}
              <Link href="/account" className="font-semibold text-brand-royal hover:underline">
                Account & Privacy page
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-brand-navy">
              3. Live Repository Search Requests
            </h2>
            <p className="mt-1.5">
              When you enable “Live Open Repositories” during search, our server queries official
              public endpoints (Wikipedia MediaWiki API, Internet Archive Open Library API, arXiv
              API, and optionally YouTube Data API v3) on your behalf so your browser IP is not
              broadcast across multiple external search APIs until you click to open an external
              resource.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-brand-navy">
              4. Contact & Study Digest Submissions
            </h2>
            <p className="mt-1.5">
              Messages submitted via our Contact form or optional email digest form are stored only
              for responding to your inquiry or sending requested study updates. We never sell or
              rent email addresses to third parties.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
