import React from 'react';
import Link from 'next/link';
import { ExternalLink, Globe, KeyRound, ShieldCheck } from 'lucide-react';
import { TRUSTED_SOURCES } from '@/data/sources';

export function TrustedSourcesSection() {
  return (
    <section
      aria-labelledby="trusted-sources-heading"
      className="border-y border-slate-200/80 bg-brand-soft/45 py-12 lg:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-royal">
            Verified Knowledge Ecosystem
          </span>
          <h2
            id="trusted-sources-heading"
            className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl"
          >
            Trusted Educational Sources
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            Every resource on StudySphere comes from an established university, nonprofit educator,
            standards body, or public digital library. We clearly distinguish live public APIs from
            manually verified links—and never scrape sites in violation of their terms.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TRUSTED_SOURCES.map((source) => {
            const badge =
              source.integrationType === 'live-api'
                ? {
                    label: 'Live Public API',
                    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
                    Icon: Globe,
                  }
                : source.integrationType === 'optional-api-key'
                  ? {
                      label: 'Curated + API Adapter',
                      className: 'bg-amber-50 text-amber-800 ring-amber-600/20',
                      Icon: KeyRound,
                    }
                  : {
                      label: 'Verified Catalog',
                      className: 'bg-blue-50 text-brand-royal ring-brand-royal/20',
                      Icon: ShieldCheck,
                    };
            const BadgeIcon = badge.Icon;

            return (
              <div
                key={source.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition-all hover:border-brand-royal/30"
              >
                <div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${badge.className}`}
                  >
                    <BadgeIcon className="h-3 w-3" />
                    {badge.label}
                  </span>

                  <h3 className="mt-3 text-base font-bold text-brand-navy">{source.name}</h3>
                  <p className="mt-0.5 text-xs font-medium text-brand-royal">{source.category}</p>
                  <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-slate-600">
                    {source.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
                  <Link
                    href={`/explore?source=${encodeURIComponent(source.id)}${
                      source.integrationType === 'live-api' ? '&live=1&q=science' : ''
                    }`}
                    className="font-semibold text-brand-navy hover:text-brand-royal"
                  >
                    Browse Materials →
                  </Link>
                  <a
                    href={source.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${source.name} official website`}
                    className="inline-flex items-center gap-1 font-medium text-slate-500 hover:text-brand-royal"
                  >
                    <span>Official Site</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
