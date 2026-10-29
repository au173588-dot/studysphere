import React from 'react';
import type { Metadata } from 'next';
import { LearningPathsSection } from '@/components/home/LearningPathsSection';

export const metadata: Metadata = {
  title: 'Tutorials & Curated Learning Paths',
  description:
    'Follow structured, step-by-step learning paths for Web Development, Python, Computer Science, Calculus Revision, Data Analysis, and Digital Skills.',
  alternates: {
    canonical: '/tutorials',
  },
};

export default function TutorialsIndexPage() {
  return (
    <div className="py-4">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-navy p-6 text-white shadow-lg sm:p-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
            Step-by-Step Study Roadmaps
          </span>
          <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-4xl">
            Tutorials & Curated Learning Paths
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-sky-100/90 sm:text-base">
            Each path connects verified open textbooks, university video lectures, and hands-on
            documentation in a clear sequence—with milestone tracking built right in.
          </p>
        </div>
      </div>

      <LearningPathsSection />
    </div>
  );
}
