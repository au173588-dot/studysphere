import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { getHomePopularSubjects } from '@/data/subjects';
import { BrandLogo } from '@/components/ui/BrandLogo';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const topSubjects = getHomePopularSubjects().slice(0, 6);

  return (
    <footer className="border-t border-slate-200 bg-brand-navy pb-20 text-slate-300 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Column 1-2: Brand & Mission */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block focus-visible:outline-none">
              <BrandLogo variant="inverted" showTagline />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300/90">
              {siteConfig.description}
            </p>
            <p className="mt-4 max-w-md rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs leading-relaxed text-slate-300/85">
              {siteConfig.legal.attributionNotice}
            </p>
          </div>

          {/* Column 3: Explore Resources */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Explore Resources
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">
                  All Learning Materials
                </Link>
              </li>
              <li>
                <Link href="/explore?format=video" className="hover:text-white transition-colors">
                  Video Lectures & Playlists
                </Link>
              </li>
              <li>
                <Link href="/explore?format=pdf" className="hover:text-white transition-colors">
                  Open Textbooks & PDFs
                </Link>
              </li>
              <li>
                <Link
                  href="/explore?format=documentation"
                  className="hover:text-white transition-colors"
                >
                  Official Documentation
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="hover:text-white transition-colors">
                  Curated Learning Paths
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-white transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Popular Subjects */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Popular Subjects
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {topSubjects.map((subject) => (
                <li key={subject.slug}>
                  <Link
                    href={`/explore?subject=${encodeURIComponent(subject.slug)}`}
                    className="hover:text-white transition-colors"
                  >
                    {subject.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/subjects"
                  className="font-semibold text-sky-300 hover:text-sky-200 transition-colors"
                >
                  See all subjects →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Platform & Policies */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform & Legal
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About {siteConfig.brandName}
                </Link>
              </li>
              <li>
                <Link href="/about#integrations" className="hover:text-white transition-colors">
                  Trusted Source Adapters
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Feedback
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Study Preferences & Privacy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Configurable Social Links */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>
            © {currentYear} {siteConfig.brandName}. All rights reserved. Built to make verified
            open education faster to discover.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/sitemap.xml" className="hover:text-white">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
