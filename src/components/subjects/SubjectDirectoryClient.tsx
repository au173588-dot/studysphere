'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { getSubjectCounts } from '@/data/resources';
import { SUBJECTS } from '@/data/subjects';
import { getSubjectAccentStyles, SubjectIcon } from '@/components/ui/SubjectIcon';

export function SubjectDirectoryClient() {
  const [filterText, setFilterText] = useState('');
  const counts = getSubjectCounts();

  const filtered = SUBJECTS.filter((s) => {
    if (!filterText.trim()) return true;
    const q = filterText.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q) ||
      s.popularTopics.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-brand-navy p-6 text-white shadow-lg sm:p-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
              Complete Academic & Technical Directory
            </span>
            <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-4xl">
              Browse All Study Subjects
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-sky-100/90 sm:text-base">
              Select a subject to filter verified open textbooks, lecture notes, interactive labs,
              and tutorials—or click any subtopic tag to jump straight to focused results.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <label htmlFor="subject-filter-input" className="sr-only">
              Filter subjects or subtopics
            </label>
            <input
              id="subject-filter-input"
              type="search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter subjects or subtopics..."
              className="h-11 w-full rounded-xl bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((subject) => {
          const accent = getSubjectAccentStyles(subject.accentColor);
          const count = counts[subject.slug] || 0;

          return (
            <div
              key={subject.slug}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card transition-all hover:border-brand-royal/35 hover:shadow-card-hover"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring}`}
                  >
                    <SubjectIcon iconName={subject.iconName} className="h-6 w-6" />
                  </span>
                  {count > 0 && (
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand-royal">
                      {count} verified {count === 1 ? 'resource' : 'resources'}
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-lg font-bold text-brand-navy">
                  <Link
                    href={`/explore?subject=${encodeURIComponent(subject.slug)}`}
                    className="hover:text-brand-royal"
                  >
                    {subject.name}
                  </Link>
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {subject.shortDescription}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {subject.popularTopics.map((topic) => (
                    <Link
                      key={topic}
                      href={`/explore?subject=${encodeURIComponent(
                        subject.slug
                      )}&q=${encodeURIComponent(topic)}`}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-brand-royal/35 hover:bg-brand-soft hover:text-brand-royal"
                    >
                      {topic}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <Link
                  href={`/explore?subject=${encodeURIComponent(subject.slug)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-royal hover:text-brand-navy"
                >
                  <span>Explore {subject.name} Resources</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-brand-navy">
            No subject categories matched “{filterText}”.
          </p>
          <Link
            href={`/explore?q=${encodeURIComponent(filterText)}&live=1`}
            className="mt-3 inline-flex rounded-xl bg-brand-royal px-4 py-2 text-xs font-bold text-white hover:bg-brand-navy"
          >
            Search all resources & live repositories for “{filterText}”
          </Link>
        </div>
      )}
    </div>
  );
}
