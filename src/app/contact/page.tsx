import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Info, Mail, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact & Resource Submissions',
  description:
    'Get in touch with StudySphere to suggest verified educational resources, report broken links, or inquire about educational partnerships.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage({
  searchParams,
}: {
  searchParams: { topic?: string };
}) {
  const defaultSubject =
    searchParams?.topic === 'sponsorship'
      ? 'Educational Organization Sponsorship Inquiry'
      : '';

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-royal">
          Support & Editorial Submissions
        </span>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
          Contact {siteConfig.brandName}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
          Have a trusted university OpenCourseWare link, open textbook, or broken resource URL to
          report? Use the form below to log a message directly to our backend inbox.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm defaultSubject={defaultSubject} />
        </div>

        <aside className="space-y-5 lg:col-span-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2 text-base font-bold text-brand-navy">
              <Mail className="h-4 w-4 text-brand-royal" />
              Direct Support Configuration
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Support email:{' '}
              <span className="font-mono font-semibold text-brand-navy">
                {siteConfig.contact.supportEmail}
              </span>
            </p>
            {siteConfig.contact.isPlaceholderEmail && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                <p>
                  <strong>Owner Setup Note:</strong> Update{' '}
                  <code className="font-mono">siteConfig.contact.supportEmail</code> in{' '}
                  <code className="font-mono">src/config/site.ts</code> and set{' '}
                  <code className="font-mono">RESEND_API_KEY</code> in{' '}
                  <code className="font-mono">.env.local</code> to forward form submissions to your
                  live email inbox. All submissions are already persisted safely in{' '}
                  <code className="font-mono">data/store.json</code>.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2 text-base font-bold text-brand-navy">
              <ShieldCheck className="h-4 w-4 text-brand-royal" />
              Resource Submission Guidelines
            </h2>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600">
              <li>• Must be freely accessible or openly licensed from its legitimate publisher.</li>
              <li>• No pirated PDFs, unauthorized mirrors, or paywalled course dumps.</li>
              <li>• Official documentation, university OCW, and peer-reviewed OER are prioritized.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-brand-soft/60 p-6">
            <h2 className="flex items-center gap-2 text-sm font-bold text-brand-navy">
              <FileText className="h-4 w-4 text-brand-royal" />
              Policies & Legal Links
            </h2>
            <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-brand-royal">
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:underline">
                Terms of Use
              </Link>
              <span>•</span>
              <Link href="/about" className="hover:underline">
                About & Integrations
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
