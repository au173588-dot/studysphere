'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  GraduationCap,
  Info,
  Lightbulb,
  Target,
} from 'lucide-react';
import { getResourceById } from '@/data/resources';
import { useStudySphere } from '@/context/StudySphereContext';
import { LearningPath } from '@/types';
import { BookmarkButton } from '@/components/resources/BookmarkButton';

export function LearningPathDetailClient({ path }: { path: LearningPath }) {
  const { completedSteps, toggleStepCompleted, user } = useStudySphere();

  const doneList = completedSteps[path.slug] || [];
  const totalSteps = path.steps.length;
  const pct = Math.round((doneList.length / totalSteps) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/tutorials"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-royal hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to All Learning Paths
      </Link>

      {/* Hero Header */}
      <div className="rounded-3xl bg-brand-navy p-6 text-white shadow-xl sm:p-10">
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 font-bold text-sky-200">
            <GraduationCap className="h-3.5 w-3.5" />
            {path.level}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-medium text-sky-100">
            <Clock className="h-3.5 w-3.5" />
            {path.estimatedTotalTime}
          </span>
          <Link
            href={`/explore?subject=${encodeURIComponent(path.subjectSlug)}`}
            className="rounded-full bg-brand-royal px-3 py-1 font-semibold text-white hover:bg-blue-500"
          >
            {path.subjectName}
          </Link>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-4xl">{path.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-sky-100/90 sm:text-base">
          {path.subtitle}
        </p>
        <p className="mt-2 text-xs text-sky-200/80">
          <strong>Ideal for:</strong> {path.audience}
        </p>

        {/* Interactive Progress Bar */}
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>
              Your Self-Study Progress: {doneList.length} of {totalSteps} steps completed
            </span>
            <span className="text-amber-300">{pct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-sky-200/80">
            {user
              ? `Synced automatically with your StudySphere account (${user.email}).`
              : 'Saved locally in this browser. Sign in anytime to sync progress across devices.'}
          </p>
        </div>
      </div>

      {/* Learning Objectives */}
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="flex items-center gap-2 text-base font-bold text-brand-navy">
          <Target className="h-5 w-5 text-brand-royal" />
          Learning Objectives
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {path.objectives.map((obj) => (
            <li key={obj} className="flex items-start gap-2.5 text-sm text-slate-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Ordered Steps */}
      <section aria-labelledby="ordered-steps-heading" className="mt-8 space-y-5">
        <div className="flex items-center justify-between">
          <h2 id="ordered-steps-heading" className="text-xl font-bold text-brand-navy">
            Ordered Study Roadmap
          </h2>
          <span className="text-xs font-medium text-slate-500">
            Start at Step 1 and check off milestones as you go
          </span>
        </div>

        {path.steps.map((step) => {
          const isDone = doneList.includes(step.stepNumber);
          const resource = getResourceById(step.resourceId);

          return (
            <div
              key={step.stepNumber}
              className={`rounded-2xl border p-6 shadow-card transition-all ${
                isDone
                  ? 'border-emerald-300/80 bg-emerald-50/30'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => toggleStepCompleted(path.slug, step.stepNumber)}
                    aria-pressed={isDone}
                    aria-label={`Mark Step ${step.stepNumber} as ${
                      isDone ? 'incomplete' : 'complete'
                    }`}
                    className="mt-0.5 rounded-full text-brand-royal transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal"
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-slate-300 hover:text-brand-royal" />
                    )}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold uppercase tracking-wider text-brand-royal">
                        Step {step.stepNumber}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="font-medium text-slate-500">{step.estimatedTime}</span>
                      {step.stepNumber === 1 && !isDone && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                          Recommended Starting Point
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1 text-lg font-bold text-brand-navy">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.summary}</p>
                  </div>
                </div>
              </div>

              {/* Linked Verified Resource Box */}
              {resource && (
                <div className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-slate-200/80 bg-brand-soft/50 p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-royal">
                      Primary Verified Resource • {resource.sourceName}
                    </span>
                    <p className="mt-0.5 truncate text-sm font-bold text-brand-navy">
                      {resource.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Format: <span className="capitalize">{resource.format}</span>
                      {resource.accessLabel ? ` • ${resource.accessLabel}` : ''}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <BookmarkButton resource={resource} />
                    <Link
                      href={`/resources/${resource.id}`}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-brand-navy hover:border-brand-royal hover:text-brand-royal"
                    >
                      Details
                    </Link>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy px-4 py-2 text-xs font-bold text-white hover:bg-brand-royal"
                    >
                      <span>Open Material</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Active Practice Exercise */}
              <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-700">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p>
                  <strong className="text-brand-navy">Self-Check Milestone:</strong>{' '}
                  {step.practicePrompt}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Non-Accreditation Transparency Notice (Section 13) */}
      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-xs leading-relaxed text-slate-600">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-royal" />
        <p>
          <strong>Academic Transparency Notice:</strong> StudySphere learning paths are curated
          self-study sequences organizing free materials from providers such as MIT OpenCourseWare,
          OpenStax, MDN, freeCodeCamp, and Khan Academy. Completing steps on StudySphere tracks your
          personal study milestones and does not confer an accredited academic degree or university
          credit.
        </p>
      </div>
    </div>
  );
}
