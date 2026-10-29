import React from 'react';
import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-card">
        <span className="inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-royal">
          404 • Page Not Found
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-brand-navy">
          We couldn’t find that study page
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          The resource or link you followed may have moved. Use search or browse our verified
          subjects below.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-royal"
          >
            <Home className="h-4 w-4" />
            <span>Back Home</span>
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-brand-navy hover:border-brand-royal hover:text-brand-royal"
          >
            <Compass className="h-4 w-4" />
            <span>Explore Resources</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
