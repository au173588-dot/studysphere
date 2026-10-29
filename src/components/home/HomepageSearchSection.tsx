'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Clock,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { SUBJECTS } from '@/data/subjects';
import { useStudySphere } from '@/context/StudySphereContext';
import {
  getAutocompleteSuggestions,
  POPULAR_SEARCH_EXAMPLES,
  SearchSuggestion,
} from '@/lib/search';

export function HomepageSearchSection() {
  const router = useRouter();
  const { recentSearches, addRecentSearch, clearRecentSearches, setCurrentSearchDraft } =
    useStudySphere();

  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Quick filter selections inside search bar popover
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [includeLive, setIncludeLive] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const activeQuickFilterCount =
    (selectedSubject !== 'all' ? 1 : 0) +
    (selectedFormat !== 'all' ? 1 : 0) +
    (selectedLevel !== 'all' ? 1 : 0);

  const buildExploreUrl = (overrideQuery?: string) => {
    const params = new URLSearchParams();
    const finalQ = (overrideQuery ?? query).trim();
    if (finalQ) params.set('q', finalQ);
    if (selectedSubject !== 'all') params.set('subject', selectedSubject);
    if (selectedFormat !== 'all') params.set('format', selectedFormat);
    if (selectedLevel !== 'all') params.set('level', selectedLevel);
    if (includeLive && finalQ) params.set('live', '1');
    const qs = params.toString();
    return qs ? `/explore?${qs}` : '/explore';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      addRecentSearch(trimmed);
    }
    setFocused(false);
    setFilterOpen(false);
    router.push(buildExploreUrl());
  };

  const suggestions: SearchSuggestion[] = getAutocompleteSuggestions(query);

  return (
    <section
      aria-label="Search educational resources"
      className="mx-auto max-w-7xl px-4 pt-5 pb-3 sm:px-6 sm:pt-7 lg:px-8"
    >
      <div ref={containerRef} className="relative mx-auto max-w-4xl">
        <form
          onSubmit={handleSubmit}
          role="search"
          className="relative flex items-center rounded-full border border-slate-200/90 bg-white p-1.5 pl-4 shadow-search transition-all focus-within:border-brand-royal focus-within:ring-4 focus-within:ring-brand-royal/10 sm:pl-5"
        >
          <Search
            className="h-5 w-5 shrink-0 text-brand-royal"
            aria-hidden="true"
          />
          <label htmlFor="home-resource-search" className="sr-only">
            Search study materials, topics or sources
          </label>
          <input
            id="home-resource-search"
            ref={inputRef}
            type="search"
            value={query}
            onFocus={() => {
              setFocused(true);
              setFilterOpen(false);
            }}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentSearchDraft(e.target.value);
              setFocused(true);
            }}
            placeholder="Search study materials, topics or sources..."
            autoComplete="off"
            className="h-11 w-full bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none sm:h-12 sm:text-base"
          />

          {/* Clear Search Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCurrentSearchDraft('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search text"
              className="mr-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Filter Button */}
          <button
            type="button"
            onClick={() => {
              setFilterOpen((prev) => !prev);
              setFocused(false);
            }}
            aria-expanded={filterOpen}
            aria-label="Toggle search filters"
            className={`mr-1.5 inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal sm:h-11 sm:px-4 ${
              activeQuickFilterCount > 0 || filterOpen
                ? 'border-brand-royal/30 bg-brand-soft text-brand-royal'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {activeQuickFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-royal text-[10px] font-bold text-white">
                {activeQuickFilterCount}
              </span>
            )}
          </button>

          {/* Submit Search Button */}
          <button
            type="submit"
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-brand-royal px-4 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 sm:h-11 sm:px-6 sm:text-sm"
          >
            <span>Search</span>
            <ArrowRight className="hidden h-4 w-4 sm:inline" />
          </button>
        </form>

        {/* Quick Filter Popover */}
        {filterOpen && (
          <div
            role="region"
            aria-label="Quick search filters"
            className="absolute left-0 right-0 z-30 mt-2.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="quick-filter-subject"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Subject
                </label>
                <select
                  id="quick-filter-subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-brand-soft/50 px-3 py-2 text-sm text-slate-800 focus:border-brand-royal focus:outline-none"
                >
                  <option value="all">All Subjects</option>
                  {SUBJECTS.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="quick-filter-format"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Resource Type
                </label>
                <select
                  id="quick-filter-format"
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-brand-soft/50 px-3 py-2 text-sm text-slate-800 focus:border-brand-royal focus:outline-none"
                >
                  <option value="all">All Formats</option>
                  <option value="course">Full Courses</option>
                  <option value="video">Videos & Playlists</option>
                  <option value="pdf">PDFs & Open Textbooks</option>
                  <option value="documentation">Documentation</option>
                  <option value="interactive">Interactive Labs</option>
                  <option value="book">Books & Handbooks</option>
                  <option value="article">Reference Articles</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="quick-filter-level"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Difficulty Level
                </label>
                <select
                  id="quick-filter-level"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-brand-soft/50 px-3 py-2 text-sm text-slate-800 focus:border-brand-royal focus:outline-none"
                >
                  <option value="all">Any Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={includeLive}
                  onChange={(e) => setIncludeLive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-royal focus:ring-brand-royal"
                />
                <span>Also query live open repositories (Wikipedia, Open Library, arXiv)</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSubject('all');
                    setSelectedFormat('all');
                    setSelectedLevel('all');
                  }}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterOpen(false);
                    router.push(buildExploreUrl());
                  }}
                  className="rounded-xl bg-brand-navy px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-royal"
                >
                  Apply & View Results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Autocomplete & Recent Searches Dropdown */}
        {focused && (
          <div
            role="region"
            aria-label="Search suggestions and recent searches"
            className="absolute left-0 right-0 z-30 mt-2.5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
          >
            {!query.trim() && recentSearches.length > 0 && (
              <div className="border-b border-slate-100 p-3.5">
                <div className="mb-2 flex items-center justify-between px-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    Recent Searches
                  </span>
                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 px-1">
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setQuery(item);
                        setFocused(false);
                        router.push(buildExploreUrl(item));
                      }}
                      className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-navy hover:bg-blue-100 hover:text-brand-royal"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3">
              <p className="mb-1.5 flex items-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-brand-royal" />
                {query.trim() ? 'Matching Topics & Resources' : 'Suggested Study Queries'}
              </p>
              <ul className="space-y-0.5">
                {suggestions.map((s) => (
                  <li key={`${s.category}-${s.label}`}>
                    <Link
                      href={s.href}
                      onClick={() => {
                        if (s.category === 'Query') addRecentSearch(s.label);
                        setFocused(false);
                      }}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-brand-soft hover:text-brand-royal"
                    >
                      <span className="truncate font-medium">{s.label}</span>
                      <span className="ml-3 shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                        {s.category}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Quick Topic Chips underneath search input (all 6 example queries) */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="font-medium text-slate-500">Examples:</span>
          {POPULAR_SEARCH_EXAMPLES.map((example) => (
            <Link
              key={example}
              href={`/explore?q=${encodeURIComponent(example)}`}
              onClick={() => addRecentSearch(example)}
              className="rounded-full border border-slate-200/80 bg-brand-soft/60 px-3 py-1 font-medium text-slate-700 transition-colors hover:border-brand-royal/30 hover:bg-white hover:text-brand-royal"
            >
              {example}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
