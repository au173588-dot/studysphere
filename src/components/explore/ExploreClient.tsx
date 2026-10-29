'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Info,
  Loader2,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { CURATED_RESOURCES } from '@/data/resources';
import { getSubjectBySlug } from '@/data/subjects';
import { getSourceById } from '@/data/sources';
import { useStudySphere } from '@/context/StudySphereContext';
import { filterAndSortResources, getRelatedSearchTerms } from '@/lib/search';
import { DifficultyLevel, DurationBucket, LearningResource, ResourceFormat } from '@/types';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { FilterPanel, FilterValues } from './FilterPanel';

interface AdapterNotice {
  adapterId: string;
  adapterName: string;
  configured: boolean;
  error?: string;
  setupMessage?: string;
}

export function ExploreClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addRecentSearch } = useStudySphere();

  const [queryInput, setQueryInput] = useState(searchParams.get('q') || '');
  const [appliedQuery, setAppliedQuery] = useState(searchParams.get('q') || '');
  const [sort, setSort] = useState<'relevance' | 'newest' | 'title'>(
    (searchParams.get('sort') as 'relevance' | 'newest' | 'title') || 'relevance'
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterValues>({
    subject: searchParams.get('subject') || 'all',
    format: (searchParams.get('format') as ResourceFormat | 'all') || 'all',
    source: searchParams.get('source') || 'all',
    level: (searchParams.get('level') as DifficultyLevel | 'all') || 'all',
    language: searchParams.get('language') || 'all',
    access: (searchParams.get('access') as 'all' | 'free-verified') || 'all',
    duration: (searchParams.get('duration') as DurationBucket | 'all') || 'all',
    year: (searchParams.get('year') as 'all' | '2024' | '2020') || 'all',
    includeLive: searchParams.get('live') === '1',
  });

  const [liveResults, setLiveResults] = useState<LearningResource[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [adapterNotices, setAdapterNotices] = useState<AdapterNotice[]>([]);

  // Sync local state if URL query params change via navigation links
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    setQueryInput(urlQ);
    setAppliedQuery(urlQ);
    setSort((searchParams.get('sort') as 'relevance' | 'newest' | 'title') || 'relevance');
    setFilters({
      subject: searchParams.get('subject') || 'all',
      format: (searchParams.get('format') as ResourceFormat | 'all') || 'all',
      source: searchParams.get('source') || 'all',
      level: (searchParams.get('level') as DifficultyLevel | 'all') || 'all',
      language: searchParams.get('language') || 'all',
      access: (searchParams.get('access') as 'all' | 'free-verified') || 'all',
      duration: (searchParams.get('duration') as DurationBucket | 'all') || 'all',
      year: (searchParams.get('year') as 'all' | '2024' | '2020') || 'all',
      includeLive: searchParams.get('live') === '1',
    });
  }, [searchParams]);

  // Sync URL whenever appliedQuery, filters, or sort changes
  const pushUrlParams = useCallback(
    (nextQ: string, nextFilters: FilterValues, nextSort: string) => {
      const params = new URLSearchParams();
      if (nextQ.trim()) params.set('q', nextQ.trim());
      if (nextFilters.subject !== 'all') params.set('subject', nextFilters.subject);
      if (nextFilters.format !== 'all') params.set('format', nextFilters.format);
      if (nextFilters.source !== 'all') params.set('source', nextFilters.source);
      if (nextFilters.level !== 'all') params.set('level', nextFilters.level);
      if (nextFilters.language !== 'all') params.set('language', nextFilters.language);
      if (nextFilters.access !== 'all') params.set('access', nextFilters.access);
      if (nextFilters.duration !== 'all') params.set('duration', nextFilters.duration);
      if (nextFilters.year !== 'all') params.set('year', nextFilters.year);
      if (nextSort !== 'relevance') params.set('sort', nextSort);
      if (nextFilters.includeLive) params.set('live', '1');
      const qs = params.toString();
      router.replace(qs ? `/explore?${qs}` : '/explore', { scroll: false });
    },
    [router]
  );

  // Fetch live public APIs when `includeLive` is enabled and query has 2+ chars (or source=youtube-edu to surface setup notice)
  useEffect(() => {
    const shouldQueryLive =
      (filters.includeLive && appliedQuery.trim().length >= 2) ||
      filters.source === 'youtube-edu';

    if (!shouldQueryLive) {
      setLiveResults([]);
      setAdapterNotices([]);
      return;
    }

    let cancelled = false;
    setLiveLoading(true);

    const apiParams = new URLSearchParams();
    if (appliedQuery.trim()) apiParams.set('q', appliedQuery.trim());
    if (filters.source !== 'all') apiParams.set('source', filters.source);
    apiParams.set('live', '1');

    fetch(`/api/search?${apiParams.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const onlyLive = (data.results || []).filter(
          (r: LearningResource) => r.verification === 'live-public-api'
        );
        setLiveResults(onlyLive);
        setAdapterNotices(data.adapterReports || []);
      })
      .catch(() => {
        if (!cancelled) setLiveResults([]);
      })
      .finally(() => {
        if (!cancelled) setLiveLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [appliedQuery, filters.includeLive, filters.source]);

  const combinedResults = useMemo(() => {
    const pool = [...CURATED_RESOURCES];
    const seenUrls = new Set(pool.map((r) => r.url.toLowerCase()));
    for (const lr of liveResults) {
      if (!seenUrls.has(lr.url.toLowerCase())) {
        pool.push(lr);
        seenUrls.add(lr.url.toLowerCase());
      }
    }
    return filterAndSortResources(pool, {
      q: appliedQuery,
      ...filters,
      sort,
    });
  }, [appliedQuery, filters, liveResults, sort]);

  const handleFilterChange = (partial: Partial<FilterValues>) => {
    const updated = { ...filters, ...partial };
    setFilters(updated);
    pushUrlParams(appliedQuery, updated, sort);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = queryInput.trim();
    setAppliedQuery(clean);
    if (clean) addRecentSearch(clean);
    pushUrlParams(clean, filters, sort);
  };

  const handleClearAll = () => {
    const reset: FilterValues = {
      subject: 'all',
      format: 'all',
      source: 'all',
      level: 'all',
      language: 'all',
      access: 'all',
      duration: 'all',
      year: 'all',
      includeLive: false,
    };
    setQueryInput('');
    setAppliedQuery('');
    setFilters(reset);
    setSort('relevance');
    router.replace('/explore', { scroll: false });
  };

  const activeFilterChips: Array<{ key: string; label: string; onRemove: () => void }> = [];
  if (appliedQuery) {
    activeFilterChips.push({
      key: 'q',
      label: `Search: "${appliedQuery}"`,
      onRemove: () => {
        setQueryInput('');
        setAppliedQuery('');
        pushUrlParams('', filters, sort);
      },
    });
  }
  if (filters.subject !== 'all') {
    const subj = getSubjectBySlug(filters.subject);
    activeFilterChips.push({
      key: 'subject',
      label: `Subject: ${subj?.name || filters.subject}`,
      onRemove: () => handleFilterChange({ subject: 'all' }),
    });
  }
  if (filters.format !== 'all') {
    activeFilterChips.push({
      key: 'format',
      label: `Format: ${filters.format}`,
      onRemove: () => handleFilterChange({ format: 'all' }),
    });
  }
  if (filters.source !== 'all') {
    const src = getSourceById(filters.source);
    activeFilterChips.push({
      key: 'source',
      label: `Source: ${src?.name || filters.source}`,
      onRemove: () => handleFilterChange({ source: 'all' }),
    });
  }
  if (filters.level !== 'all') {
    activeFilterChips.push({
      key: 'level',
      label: `Level: ${filters.level}`,
      onRemove: () => handleFilterChange({ level: 'all' }),
    });
  }
  if (filters.duration !== 'all') {
    activeFilterChips.push({
      key: 'duration',
      label: `Duration: ${filters.duration}`,
      onRemove: () => handleFilterChange({ duration: 'all' }),
    });
  }
  if (filters.language !== 'all') {
    activeFilterChips.push({
      key: 'language',
      label: `Language: ${filters.language}`,
      onRemove: () => handleFilterChange({ language: 'all' }),
    });
  }
  if (filters.year !== 'all') {
    activeFilterChips.push({
      key: 'year',
      label: `Published: ${filters.year}+`,
      onRemove: () => handleFilterChange({ year: 'all' }),
    });
  }
  if (filters.access === 'free-verified') {
    activeFilterChips.push({
      key: 'access',
      label: 'Verified Free Only',
      onRemove: () => handleFilterChange({ access: 'all' }),
    });
  }

  const youtubeSetupNotice = adapterNotices.find(
    (n) => n.adapterId === 'youtube-edu' && !n.configured && n.setupMessage
  );

  const relatedSuggestions = getRelatedSearchTerms(appliedQuery);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Search Header */}
      <div className="rounded-3xl bg-brand-navy p-6 text-white shadow-lg sm:p-8">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Explore Verified Learning Resources
          </h1>
          <p className="mt-1.5 text-sm text-sky-100/90">
            Filter courses, PDFs, open textbooks, documentation, and live public repositories by
            subject, format, source, or level.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <label htmlFor="explore-search-input" className="sr-only">
              Search resources
            </label>
            <input
              id="explore-search-input"
              type="search"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Search by topic, title, language, or source (e.g., Python, Calculus PDF, Networking)..."
              className="h-12 w-full rounded-xl bg-white pl-11 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            {queryInput && (
              <button
                type="button"
                onClick={() => {
                  setQueryInput('');
                  setAppliedQuery('');
                  pushUrlParams('', filters, sort);
                }}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="h-12 shrink-0 rounded-xl bg-brand-royal px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-500"
          >
            Search Resources
          </button>

          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 text-sm font-semibold text-white lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters ({activeFilterChips.length})</span>
          </button>
        </form>
      </div>

      {/* Main Content Layout: Desktop Filter Sidebar + Results Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Desktop Sidebar */}
        <aside
          aria-label="Resource filters"
          className="hidden lg:col-span-3 lg:block"
        >
          <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <FilterPanel
              values={filters}
              onChange={handleFilterChange}
              onApply={() => pushUrlParams(appliedQuery, filters, sort)}
              onClearAll={handleClearAll}
              activeCount={activeFilterChips.length}
            />
          </div>
        </aside>

        {/* Results Column */}
        <div className="lg:col-span-9">
          {/* Result Count & Sort Bar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3">
            <div className="flex items-center gap-2.5 text-sm">
              <span className="font-bold text-brand-navy">
                {combinedResults.length}{' '}
                {combinedResults.length === 1 ? 'resource' : 'resources'} found
              </span>
              {liveLoading && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand-royal">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Querying live repositories…
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="explore-sort" className="text-xs font-semibold text-slate-500">
                Sort by:
              </label>
              <select
                id="explore-sort"
                value={sort}
                onChange={(e) => {
                  const nextSort = e.target.value as 'relevance' | 'newest' | 'title';
                  setSort(nextSort);
                  pushUrlParams(appliedQuery, filters, nextSort);
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-brand-royal focus:outline-none"
              >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest Published</option>
                <option value="title">Title (A–Z)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {activeFilterChips.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {activeFilterChips.map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-royal/25 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-navy"
                >
                  <span>{chip.label}</span>
                  <button
                    type="button"
                    onClick={chip.onRemove}
                    aria-label={`Remove ${chip.label} filter`}
                    className="rounded-full p-0.5 text-slate-500 hover:bg-white hover:text-rose-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-semibold text-slate-500 hover:text-brand-royal hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Honest Integration Status Notice when YouTube source or Live API is selected */}
          {(filters.source === 'youtube-edu' || youtubeSetupNotice) && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <div>
                <p className="font-bold">YouTube Source Adapter Status</p>
                <p className="mt-0.5 leading-relaxed">
                  Showing verified curated YouTube educational playlists (CrashCourse, 3Blue1Brown,
                  StatQuest). To enable live keyword queries against YouTube Data API v3, add{' '}
                  <code className="rounded bg-amber-100 px-1 py-0.5 font-mono">
                    YOUTUBE_API_KEY
                  </code>{' '}
                  in <code className="rounded bg-amber-100 px-1 py-0.5 font-mono">.env.local</code>.
                </p>
              </div>
            </div>
          )}

          {filters.includeLive && !appliedQuery.trim() && (
            <div className="mb-5 flex items-center gap-2.5 rounded-2xl border border-sky-200 bg-sky-50/80 px-4 py-3 text-xs text-sky-900">
              <Info className="h-4 w-4 shrink-0 text-brand-royal" />
              <span>
                Enter a search topic above (e.g. <strong>thermodynamics</strong>,{' '}
                <strong>linear algebra</strong>, or <strong>neural networks</strong>) to fetch live
                results from Wikipedia, Open Library, and arXiv alongside our curated catalog.
              </span>
            </div>
          )}

          {/* Results Grid or Empty State */}
          {combinedResults.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {combinedResults.map((res) => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-card">
              <h2 className="text-lg font-bold text-brand-navy">
                No verified resources matched your exact filters
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                Try broadening your filter selection, enabling Live Open Repository Search, or
                exploring one of these related topics:
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {relatedSuggestions.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQueryInput(term);
                      setAppliedQuery(term);
                      const resetFilters: FilterValues = {
                        ...filters,
                        subject: 'all',
                        format: 'all',
                        source: 'all',
                        level: 'all',
                      };
                      setFilters(resetFilters);
                      pushUrlParams(term, resetFilters, sort);
                    }}
                    className="rounded-full border border-slate-200 bg-brand-soft px-3.5 py-1.5 text-xs font-semibold text-brand-royal hover:bg-brand-royal hover:text-white"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {!filters.includeLive && appliedQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange({ includeLive: true })}
                    className="rounded-xl bg-brand-royal px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-navy"
                  >
                    Search Live Wikipedia, Open Library & arXiv for “{appliedQuery}”
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-Over Filter Drawer */}
      {mobileFilterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter learning resources"
          className="fixed inset-0 z-50 flex justify-end bg-brand-navy/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className="h-full w-full max-w-sm overflow-y-auto bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-base font-bold text-brand-navy">Filter Resources</span>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close filter drawer"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterPanel
              values={filters}
              onChange={handleFilterChange}
              onApply={() => {
                pushUrlParams(appliedQuery, filters, sort);
                setMobileFilterOpen(false);
              }}
              onClearAll={() => {
                handleClearAll();
                setMobileFilterOpen(false);
              }}
              activeCount={activeFilterChips.length}
            />
          </div>
        </div>
      )}
    </div>
  );
}
