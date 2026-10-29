import React from 'react';
import Link from 'next/link';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { getSubjectCounts } from '@/data/resources';
import { getHomePopularSubjects, SUBJECTS } from '@/data/subjects';
import { getSubjectAccentStyles, SubjectIcon } from '@/components/ui/SubjectIcon';

export function PopularSubjectsSection() {
  const popularSubjects = getHomePopularSubjects(); // 11 core subjects
  const counts = getSubjectCounts();
  const extraSubjectCount = SUBJECTS.length - popularSubjects.length;

  return (
    <section
      aria-labelledby="popular-subjects-heading"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
    >
      <div className="mb-6 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h2
            id="popular-subjects-heading"
            className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl"
          >
            Popular Subjects
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Jump straight into verified study notes, open textbooks, and courses by discipline.
          </p>
        </div>

        <Link
          href="/subjects"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-royal hover:text-brand-navy focus-visible:outline-none focus-visible:underline"
        >
          <span>See all subjects</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Mobile: 2-column grid | Tablet: 3-4 columns | Desktop: 6 columns (12 tiles total) */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {popularSubjects.map((subject) => {
          const accent = getSubjectAccentStyles(subject.accentColor);
          const count = counts[subject.slug] || 0;

          return (
            <Link
              key={subject.slug}
              href={`/explore?subject=${encodeURIComponent(subject.slug)}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-royal/35 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal"
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent.bg} ${accent.text} ring-1 ${accent.ring} transition-transform duration-200 group-hover:scale-105`}
                >
                  <SubjectIcon iconName={subject.iconName} className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-bold leading-snug text-brand-navy group-hover:text-brand-royal">
                  {subject.name}
                </h3>
                {count > 0 && (
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {count} {count === 1 ? 'verified item' : 'verified items'}
                  </p>
                )}
              </div>
            </Link>
          );
        })}

        {/* 12th Card: More Subjects */}
        <Link
          href="/subjects"
          className="group flex flex-col justify-between rounded-2xl border border-dashed border-brand-royal/35 bg-brand-soft/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-royal hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-royal text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <LayoutGrid className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-bold leading-snug text-brand-navy group-hover:text-brand-royal">
              More Subjects
            </h3>
            <p className="mt-1 text-xs font-semibold text-brand-royal">
              +{extraSubjectCount} more tracks →
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
