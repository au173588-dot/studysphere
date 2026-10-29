import React from 'react';
import Link from 'next/link';
import {
  BookmarkCheck,
  Compass,
  FileSpreadsheet,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { siteConfig } from '@/config/site';

const CORE_BENEFITS = [
  {
    title: 'Unified Multi-Source Search',
    description:
      'Search across open textbooks, MIT lecture notes, MDN documentation, and live public repositories from one clean interface.',
    Icon: Compass,
  },
  {
    title: 'Strictly Verified Links',
    description:
      'No fabricated star ratings, fake download counters, or scraped mirror pages. Every link points straight to the legitimate provider.',
    Icon: ShieldCheck,
  },
  {
    title: 'Bookmarks & Collections',
    description:
      'Save resources into custom study folders immediately as a guest in your browser, or create an optional account to sync.',
    Icon: BookmarkCheck,
  },
  {
    title: 'Privacy-First Personalization',
    description:
      'Choose your study subjects for transparent recommendations—and pause or wipe your local history with a single click.',
    Icon: LockKeyhole,
  },
  {
    title: 'Mobile-Light & Accessible',
    description:
      'Engineered for fast loading on mobile data connections, full keyboard navigation, strong text contrast, and reduced-motion respect.',
    Icon: Smartphone,
  },
  {
    title: 'Free Access Preserved',
    description:
      'Third-party open educational resources are never paywalled or gated behind mandatory registration.',
    Icon: Sparkles,
  },
];

export function BenefitsSection() {
  return (
    <section
      aria-labelledby="platform-benefits-heading"
      className="border-t border-slate-200/80 bg-white py-12 lg:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-royal">
            Built for Serious Learners
          </span>
          <h2
            id="platform-benefits-heading"
            className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl"
          >
            Why Students & Self-Learners Use {siteConfig.brandName}
          </h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Designed for secondary students, undergraduates, exam candidates, self-taught
            programmers, and researchers who value clarity over clutter.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_BENEFITS.map(({ title, description, Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200/80 bg-brand-canvas p-6 transition-colors hover:border-brand-royal/30"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy text-sky-300">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-brand-navy">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>
            </div>
          ))}
        </div>

        {/* Ethical Sustainability & Transparent Monetization Slots (Section 15) */}
        {(siteConfig.monetization.showOriginalStudyGuides ||
          siteConfig.monetization.showPartnerSponsorshipSlot) && (
          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {siteConfig.monetization.showOriginalStudyGuides && (
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-brand-soft/60 p-5">
                <div>
                  <span className="inline-block rounded-md bg-brand-navy px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Original Digital Study Tools
                  </span>
                  <h3 className="mt-3 flex items-center gap-2 text-base font-bold text-brand-navy">
                    <FileSpreadsheet className="h-4 w-4 text-brand-royal" />
                    StudySphere Original Planners
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Space reserved for original printable revision timetables, Cornell note templates,
                    and exam checklists created by {siteConfig.brandName}. Third-party links always
                    remain 100% free.
                  </p>
                </div>
                <Link
                  href="/saved"
                  className="mt-4 inline-flex text-xs font-semibold text-brand-royal hover:underline"
                >
                  Export your free Markdown study list in Saved Resources →
                </Link>
              </div>
            )}

            {siteConfig.monetization.showPartnerSponsorshipSlot && (
              <div className="flex flex-col justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <div>
                  <span className="inline-block rounded-md border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    Sponsored Placement Slot (Unfilled)
                  </span>
                  <h3 className="mt-3 text-base font-bold text-brand-navy">
                    Verified Educational Organizations
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Accredited universities, open textbook foundations, and verified educators may
                    inquire about clearly badged partner placements. Sponsored cards are never mixed
                    into organic rankings unmarked.
                  </p>
                </div>
                <Link
                  href="/contact?topic=sponsorship"
                  className="mt-4 inline-flex text-xs font-semibold text-brand-navy hover:text-brand-royal hover:underline"
                >
                  Inquire about ethical educational sponsorship →
                </Link>
              </div>
            )}

            {siteConfig.monetization.showOptionalPlusPreview && (
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5">
                <div>
                  <span className="inline-block rounded-md bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-royal">
                    Architecture Ready • Optional Plus
                  </span>
                  <h3 className="mt-3 text-base font-bold text-brand-navy">
                    Cloud Study Workspace & Exports
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Create a free optional StudySphere account today to sync bookmarks, custom
                    collections, and learning-path progress across devices.
                  </p>
                </div>
                <Link
                  href="/account"
                  className="mt-4 inline-flex text-xs font-semibold text-brand-royal hover:underline"
                >
                  Set up free synced study account →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
