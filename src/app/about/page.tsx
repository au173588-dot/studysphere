import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle2,
  ExternalLink,
  Globe,
  KeyRound,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { TRUSTED_SOURCES } from '@/data/sources';
import { getAllAdapterStatuses } from '@/lib/adapters';

export const metadata: Metadata = {
  title: 'About StudySphere & Source Integrations',
  description:
    'Learn how StudySphere curates verified educational materials and integrates public open-access APIs without scraping or paywalls.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  const adapterStatuses = getAllAdapterStatuses();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="rounded-3xl bg-brand-navy p-8 text-white shadow-xl sm:p-12">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
          {siteConfig.tagline}
        </span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Making Trusted Educational Resources Faster to Discover
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-sky-100/90 sm:text-base">
          {siteConfig.brandName} was built around a simple premise: world-class open textbooks,
          university lecture notes, interactive coding labs, and official documentation already
          exist—yet learners lose hours wading through low-quality SEO farms, broken PDFs, and
          disguised paywalls. We index verified sources in one clean, mobile-friendly workspace.
        </p>
      </div>

      {/* Who StudySphere Serves & Editorial Commitments */}
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
          <div className="flex items-center gap-2.5">
            <Users className="h-5 w-5 text-brand-royal" />
            <h2 className="text-xl font-bold text-brand-navy">Who We Serve</h2>
          </div>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
            {siteConfig.audiences.map((aud) => (
              <li key={aud} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{aud}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-brand-royal" />
            <h2 className="text-xl font-bold text-brand-navy">Our Verification Commitments</h2>
          </div>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-700">
            <li>
              <strong>Zero Fake Metrics:</strong> We never invent star ratings, user review counts,
              or download statistics.
            </li>
            <li>
              <strong>Original Hosting Preserved:</strong> Third-party materials remain hosted on
              their official providers under their respective licenses.
            </li>
            <li>
              <strong>No Unauthorized Scraping:</strong> Live queries rely strictly on official
              public APIs (Wikimedia, Open Library, arXiv, and optional YouTube Data API v3).
            </li>
            <li>
              <strong>Ethical Sustainability:</strong> Free third-party learning resources are never
              paywalled, and any sponsored partner placements are explicitly labeled.
            </li>
          </ul>
        </section>
      </div>

      {/* Live Source Adapter Status Section */}
      <section id="integrations" className="mt-12 scroll-mt-24">
        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-royal">
            Source-Adapter Architecture
          </span>
          <h2 className="mt-1 text-2xl font-bold text-brand-navy">
            Live Repository & Curated Source Status
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Below is the real-time configuration status of every live source adapter alongside our
            curated educational sources.
          </p>
        </div>

        {/* Live Adapters */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {adapterStatuses.map((adapter) => (
            <div
              key={adapter.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-brand-navy">{adapter.name}</h3>
                {adapter.configured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                    <Globe className="h-3 w-3" />
                    Active Live API
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                    <KeyRound className="h-3 w-3" />
                    Requires API Key
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                {adapter.setupMessage ||
                  'Configured and ready. Queries official public API endpoints with server-side caching and polite User-Agent attribution.'}
              </p>
            </div>
          ))}
        </div>

        {/* Complete Official Source Directory */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Source Name</th>
                  <th className="px-5 py-3.5 font-bold">Category</th>
                  <th className="px-5 py-3.5 font-bold">License / Terms</th>
                  <th className="px-5 py-3.5 font-bold">Official Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TRUSTED_SOURCES.map((src) => (
                  <tr key={src.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-bold text-brand-navy">
                      <Link
                        href={`/explore?source=${encodeURIComponent(src.id)}`}
                        className="hover:text-brand-royal hover:underline"
                      >
                        {src.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{src.category}</td>
                    <td className="px-5 py-3.5 text-slate-600">{src.licenseSummary}</td>
                    <td className="px-5 py-3.5">
                      <a
                        href={src.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-brand-royal hover:underline"
                      >
                        <span>{src.officialUrl.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
