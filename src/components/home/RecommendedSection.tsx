'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  GalleryHorizontalEnd,
  LayoutGrid,
  Plus,
  Shield,
  SlidersHorizontal,
} from 'lucide-react';
import { SUBJECTS } from '@/data/subjects';
import { useStudySphere } from '@/context/StudySphereContext';
import { getRecommendedResources } from '@/lib/search';
import { ResourceCard } from '@/components/resources/ResourceCard';

export function RecommendedSection() {
  const {
    interests,
    toggleInterest,
    recentViewedIds,
    recentSearches,
    currentSearchDraft,
    personalizationEnabled,
    setPersonalizationEnabled,
  } = useStudySphere();

  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'title'>('relevance');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'carousel'>('grid');
  const [visibleLimit, setVisibleLimit] = useState<number>(6);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  const activeQuery =
    currentSearchDraft.trim() ||
    (personalizationEnabled && recentSearches.length > 0 ? recentSearches[0] : '');

  const allRecommended = getRecommendedResources({
    selectedInterests: interests,
    recentViewedIds,
    currentQuery: activeQuery,
    personalizationEnabled,
    subjectFilter,
    formatFilter,
    sortBy,
    limit: 24,
  });

  const recommended = allRecommended.slice(0, visibleLimit);
  const hasMoreInline = allRecommended.length > visibleLimit;

  const scrollCarousel = (direction: 'prev' | 'next') => {
    if (!carouselRef.current) return;
    const distance = Math.max(300, Math.round(carouselRef.current.clientWidth * 0.8));
    carouselRef.current.scrollBy({
      left: direction === 'next' ? distance : -distance,
      behavior: 'smooth',
    });
  };

  return (
    <section
      aria-labelledby="recommended-heading"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
    >
      {/* Header + Personalization Controls */}
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-royal">
            <Shield className="h-3.5 w-3.5" />
            <span>Transparent Recommendations • Privacy-Controlled</span>
          </div>
          <h2
            id="recommended-heading"
            className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl"
          >
            Recommended for You
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {interests.length > 0 && personalizationEnabled
              ? `Matched to your ${interests.length} selected study ${
                  interests.length === 1 ? 'interest' : 'interests'
                }${activeQuery ? ` and search "${activeQuery}"` : ''}.`
              : activeQuery
                ? `Highlighting verified resources matched to "${activeQuery}" and core starter guides.`
                : 'Editorially verified learning materials from trusted universities and open repositories.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Grid vs Accessible Carousel Toggle (Section 7) */}
          <div
            role="group"
            aria-label="Resource display layout"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-0.5"
          >
            <button
              type="button"
              onClick={() => setLayoutMode('grid')}
              aria-pressed={layoutMode === 'grid'}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                layoutMode === 'grid'
                  ? 'bg-brand-navy text-white'
                  : 'text-slate-600 hover:text-brand-navy'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('carousel')}
              aria-pressed={layoutMode === 'carousel'}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                layoutMode === 'carousel'
                  ? 'bg-brand-navy text-white'
                  : 'text-slate-600 hover:text-brand-navy'
              }`}
            >
              <GalleryHorizontalEnd className="h-3.5 w-3.5" />
              <span>Carousel</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCustomizeOpen((prev) => !prev)}
            aria-expanded={customizeOpen}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-brand-navy shadow-xs hover:border-brand-royal/40 hover:bg-brand-soft"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-brand-royal" />
            <span>Study Interests ({interests.length})</span>
          </button>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-soft px-4 py-2 text-xs font-semibold text-brand-royal hover:bg-blue-100/80"
          >
            <span>Explore All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Expandable Transparent Study Interests & Privacy Panel */}
      {customizeOpen && (
        <div className="mb-6 rounded-2xl border border-brand-royal/20 bg-brand-soft/60 p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-sm font-bold text-brand-navy">
                Select Subjects You Want to Study
              </h3>
              <p className="text-xs text-slate-600">
                Recommendations use transparent matching on your selected subjects, active query,
                and locally viewed topics (no hidden behavioral profiling).
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={personalizationEnabled}
                onChange={(e) => setPersonalizationEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-royal focus:ring-brand-royal"
              />
              <span>Enable local personalization</span>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {SUBJECTS.map((subj) => {
              const selected = interests.includes(subj.slug);
              return (
                <button
                  key={subj.slug}
                  type="button"
                  onClick={() => toggleInterest(subj.slug)}
                  aria-pressed={selected}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    selected
                      ? 'bg-brand-royal text-white shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-brand-royal/40'
                  }`}
                >
                  {selected && <Check className="h-3.5 w-3.5" />}
                  <span>{subj.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Inline Filter & Sort Bar */}
      <div className="mb-6 flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { value: 'all', label: 'All Types' },
            { value: 'course', label: 'Courses' },
            { value: 'pdf', label: 'PDFs & Textbooks' },
            { value: 'video', label: 'Videos' },
            { value: 'documentation', label: 'Documentation' },
            { value: 'interactive', label: 'Interactive' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setFormatFilter(tab.value);
                setVisibleLimit(6);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                formatFilter === tab.value
                  ? 'bg-brand-navy text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-brand-navy'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="rec-subject-select" className="sr-only">
            Filter recommended resources by subject
          </label>
          <select
            id="rec-subject-select"
            value={subjectFilter}
            onChange={(e) => {
              setSubjectFilter(e.target.value);
              setVisibleLimit(6);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-brand-royal focus:outline-none"
          >
            <option value="all">All Subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>

          <label htmlFor="rec-sort-select" className="sr-only">
            Sort recommended resources
          </label>
          <select
            id="rec-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'relevance' | 'newest' | 'title')}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-brand-royal focus:outline-none"
          >
            <option value="relevance">Sort: Recommended</option>
            <option value="newest">Sort: Newest Edition</option>
            <option value="title">Sort: Title (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Resource Cards: Responsive Grid OR Accessible Horizontal Carousel */}
      {recommended.length > 0 ? (
        layoutMode === 'carousel' ? (
          <div>
            <div className="mb-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => scrollCarousel('prev')}
                aria-label="Scroll recommended resources left"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:border-brand-royal hover:text-brand-royal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('next')}
                aria-label="Scroll recommended resources right"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:border-brand-royal hover:text-brand-royal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div
              ref={carouselRef}
              role="region"
              aria-label="Recommended resources carousel"
              tabIndex={0}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 focus:outline-none"
            >
              {recommended.map(({ resource, reason }) => (
                <div
                  key={resource.id}
                  className="w-[85vw] max-w-[350px] shrink-0 snap-start sm:w-[340px]"
                >
                  <ResourceCard resource={resource} recommendationReason={reason} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map(({ resource, reason }) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                recommendationReason={reason}
              />
            ))}
          </div>
        )
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-brand-navy">
            No curated starter resources match that exact subject + format pair yet.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubjectFilter('all');
              setFormatFilter('all');
            }}
            className="mt-3 rounded-xl bg-brand-royal px-4 py-2 text-xs font-semibold text-white hover:bg-brand-navy"
          >
            Reset Quick Filters
          </button>
        </div>
      )}

      {/* View More Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {hasMoreInline && (
          <button
            type="button"
            onClick={() => setVisibleLimit((prev) => prev + 6)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-6 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-royal"
          >
            <Plus className="h-4 w-4" />
            <span>Load More Resources</span>
          </button>
        )}
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-brand-navy shadow-xs transition-colors hover:border-brand-royal hover:text-brand-royal"
        >
          <span>Open Full Search & Filter Directory</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
