'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { SUBJECTS } from '@/data/subjects';
import { TRUSTED_SOURCES } from '@/data/sources';
import { DifficultyLevel, DurationBucket, ResourceFormat } from '@/types';

export interface FilterValues {
  subject: string;
  format: ResourceFormat | 'all';
  source: string;
  level: DifficultyLevel | 'all';
  language: string;
  access: 'all' | 'free-verified';
  duration: DurationBucket | 'all';
  year: 'all' | '2024' | '2020';
  includeLive: boolean;
}

interface FilterPanelProps {
  values: FilterValues;
  onChange: (next: Partial<FilterValues>) => void;
  onApply: () => void;
  onClearAll: () => void;
  activeCount: number;
}

export function FilterPanel({
  values,
  onChange,
  onApply,
  onClearAll,
  activeCount,
}: FilterPanelProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="text-sm font-bold text-brand-navy">
          Advanced Filters {activeCount > 0 ? `(${activeCount})` : ''}
        </h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-royal hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Live Public Repositories Toggle */}
      <div className="rounded-xl border border-brand-royal/20 bg-brand-soft/60 p-3.5">
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={values.includeLive}
            onChange={(e) => onChange({ includeLive: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-royal focus:ring-brand-royal"
          />
          <span className="text-xs leading-snug text-slate-700">
            <strong className="block font-bold text-brand-navy">
              Include Live Open Repositories
            </strong>
            Query Wikipedia, Open Library, and arXiv APIs in real time alongside curated resources.
          </span>
        </label>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="filter-subject" className="mb-1.5 block text-xs font-bold text-slate-700">
          Subject
        </label>
        <select
          id="filter-subject"
          value={values.subject}
          onChange={(e) => onChange({ subject: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-royal focus:outline-none"
        >
          <option value="all">All Subjects</option>
          {SUBJECTS.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Resource Format */}
      <div>
        <label htmlFor="filter-format" className="mb-1.5 block text-xs font-bold text-slate-700">
          Resource Format
        </label>
        <select
          id="filter-format"
          value={values.format}
          onChange={(e) => onChange({ format: e.target.value as ResourceFormat | 'all' })}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-royal focus:outline-none"
        >
          <option value="all">All Formats</option>
          <option value="course">Courses & Curricula</option>
          <option value="video">Videos & Playlists</option>
          <option value="pdf">PDFs & Open Textbooks</option>
          <option value="documentation">Documentation</option>
          <option value="interactive">Interactive Labs & Practice</option>
          <option value="book">Books & Handbooks</option>
          <option value="article">Articles & Encyclopedia</option>
        </select>
      </div>

      {/* Trusted Source */}
      <div>
        <label htmlFor="filter-source" className="mb-1.5 block text-xs font-bold text-slate-700">
          Source Website
        </label>
        <select
          id="filter-source"
          value={values.source}
          onChange={(e) => onChange({ source: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-royal focus:outline-none"
        >
          <option value="all">All Trusted Sources</option>
          {TRUSTED_SOURCES.map((src) => (
            <option key={src.id} value={src.id}>
              {src.name}
            </option>
          ))}
        </select>
      </div>

      {/* Difficulty Level */}
      <div>
        <label htmlFor="filter-level" className="mb-1.5 block text-xs font-bold text-slate-700">
          Difficulty Level
        </label>
        <select
          id="filter-level"
          value={values.level}
          onChange={(e) => onChange({ level: e.target.value as DifficultyLevel | 'all' })}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-royal focus:outline-none"
        >
          <option value="all">All Educational Levels</option>
          <option value="Beginner">Beginner / Secondary & Intro</option>
          <option value="Intermediate">Intermediate / Undergraduate</option>
          <option value="Advanced">Advanced / Research</option>
        </select>
      </div>

      {/* Duration */}
      <div>
        <label htmlFor="filter-duration" className="mb-1.5 block text-xs font-bold text-slate-700">
          Estimated Duration
        </label>
        <select
          id="filter-duration"
          value={values.duration}
          onChange={(e) => onChange({ duration: e.target.value as DurationBucket | 'all' })}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-royal focus:outline-none"
        >
          <option value="all">Any Length</option>
          <option value="under-1h">Quick Read / Under 1 hour</option>
          <option value="1-5h">1 – 5 hours</option>
          <option value="5-20h">5 – 20 hours</option>
          <option value="course-semester">Full Course / Textbook</option>
          <option value="reference">Ongoing Reference</option>
        </select>
      </div>

      {/* Language & Publication Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="filter-language" className="mb-1.5 block text-xs font-bold text-slate-700">
            Language
          </label>
          <select
            id="filter-language"
            value={values.language}
            onChange={(e) => onChange({ language: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-800 focus:border-brand-royal focus:outline-none"
          >
            <option value="all">Any</option>
            <option value="English">English</option>
            <option value="Multilingual">Multilingual</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-year" className="mb-1.5 block text-xs font-bold text-slate-700">
            Published
          </label>
          <select
            id="filter-year"
            value={values.year}
            onChange={(e) => onChange({ year: e.target.value as 'all' | '2024' | '2020' })}
            className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-800 focus:border-brand-royal focus:outline-none"
          >
            <option value="all">All Dates</option>
            <option value="2024">2024 & Newer</option>
            <option value="2020">2020 & Newer</option>
          </select>
        </div>
      </div>

      {/* Free / Open Access Verified */}
      <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
        <input
          type="checkbox"
          checked={values.access === 'free-verified'}
          onChange={(e) =>
            onChange({ access: e.target.checked ? 'free-verified' : 'all' })
          }
          className="h-4 w-4 rounded border-slate-300 text-brand-royal focus:ring-brand-royal"
        />
        <span>Verified Free / Open-Access only</span>
      </label>

      <button
        type="button"
        onClick={onApply}
        className="w-full rounded-xl bg-brand-navy py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-brand-royal"
      >
        Apply Filters
      </button>

      {/* Reserved Ethical Ad Space Notice (Section 15A — Clearly labeled, zero fake impressions) */}
      {siteConfig.monetization.showReservedAdSlotPlaceholder && (
        <div
          aria-label="Advertisement policy notice"
          className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-3.5 text-[11px] leading-relaxed text-slate-500"
        >
          <span className="block font-bold uppercase tracking-wider text-slate-400">
            Reserved Relevant Ad Slot
          </span>
          <p className="mt-1">
            No ad network is active right now. When enabled in production, only clearly labeled
            educational sponsorships appear here—never disguised as search results.
          </p>
        </div>
      )}
    </div>
  );
}
