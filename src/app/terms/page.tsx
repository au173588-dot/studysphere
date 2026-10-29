import React from 'react';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: `Terms of Use and third-party copyright attribution terms for ${siteConfig.brandName}.`,
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card sm:p-10">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-royal">
          Last Updated: {siteConfig.legal.lastUpdated}
        </span>
        <h1 className="mt-1.5 text-2xl font-extrabold text-brand-navy sm:text-3xl">
          Terms of Use
        </h1>

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="text-base font-bold text-brand-navy">
              1. Discovery Directory Service
            </h2>
            <p className="mt-1.5">
              {siteConfig.brandName} is an educational resource discovery index and self-study
              organizer. Unless explicitly labeled as an original {siteConfig.brandName} study
              template, educational materials linked on this site are created and hosted by their
              respective universities, nonprofits, authors, and open repositories.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-brand-navy">
              2. Third-Party Copyrights & Open Licenses
            </h2>
            <p className="mt-1.5">
              {siteConfig.legal.attributionNotice} Users must respect the license terms (such as
              Creative Commons attribution or non-commercial clauses) specified on each provider’s
              website.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-brand-navy">
              3. Non-Accreditation Disclaimer
            </h2>
            <p className="mt-1.5">
              Curated learning paths and progress checklists on {siteConfig.brandName} are
              organizational self-study tools. They do not represent accredited academic courses,
              university enrollment, or professional certification.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-brand-navy">
              4. Ethical Advertising & Affiliate Disclosure
            </h2>
            <p className="mt-1.5">
              Any future sponsored educational placements or affiliate book/course recommendations
              will always carry a clear, visible disclosure badge. {siteConfig.brandName} never
              charges users to open third-party resources that are free at their original source.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
