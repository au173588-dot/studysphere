'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, GraduationCap, ListChecks } from 'lucide-react';
import { LEARNING_PATHS } from '@/data/learningPaths';
import { useStudySphere } from '@/context/StudySphereContext';

export function LearningPathsSection() {
  const { completedSteps } = useStudySphere();

  return (
    <section
      aria-labelledby="learning-paths-heading"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
    >
      <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-royal">
            Structured Self-Study Guides
          </span>
          <h2
            id="learning-paths-heading"
            className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl"
          >
            Curated Learning Paths & Tutorials
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Follow step-by-step roadmaps built from verified courses, textbooks, and documentation—with
            built-in milestone progress tracking.
          </p>
        </div>

        <Link
          href="/tutorials"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-royal hover:text-brand-navy"
        >
          <span>Explore all 6 paths</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {LEARNING_PATHS.map((path) => {
          const doneCount = (completedSteps[path.slug] || []).length;
          const totalSteps = path.steps.length;
          const pct = Math.round((doneCount / totalSteps) * 100);

          return (
            <div
              key={path.slug}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-royal/35 hover:shadow-card-hover"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-royal">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {path.level}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    {path.estimatedTotalTime}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold leading-snug text-brand-navy">
                  <Link href={`/tutorials/${path.slug}`} className="hover:text-brand-royal">
                    {path.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                  {path.subtitle}
                </p>

                <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-3.5 text-xs text-slate-600">
                  {path.steps.slice(0, 3).map((step) => (
                    <li key={step.stepNumber} className="flex items-center gap-2">
                      <CheckCircle2
                        className={`h-3.5 w-3.5 shrink-0 ${
                          (completedSteps[path.slug] || []).includes(step.stepNumber)
                            ? 'text-emerald-600'
                            : 'text-slate-300'
                        }`}
                      />
                      <span className="truncate">
                        Step {step.stepNumber}: {step.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                    <ListChecks className="h-3.5 w-3.5 text-brand-royal" />
                    {doneCount} of {totalSteps} steps completed
                  </span>
                  <span className="font-bold text-brand-navy">{pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-royal transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <Link
                  href={`/tutorials/${path.slug}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-soft px-4 py-2.5 text-xs font-bold text-brand-navy transition-colors hover:bg-brand-royal hover:text-white"
                >
                  <span>{doneCount > 0 ? 'Continue Learning Path' : 'Start Learning Path'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-center text-xs text-slate-500">
        Note: StudySphere learning paths are curated independent study guides linking open resources,
        not accredited university degrees or formal certifications.
      </p>
    </section>
  );
}
