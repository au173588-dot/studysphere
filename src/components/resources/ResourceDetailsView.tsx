'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FolderHeart,
  Globe2,
  Info,
  Layers,
  Scale,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { useStudySphere } from '@/context/StudySphereContext';
import { LearningResource } from '@/types';
import { ResourceThumbnail } from './ResourceThumbnail';
import { BookmarkButton } from './BookmarkButton';
import { ResourceCard } from './ResourceCard';

interface ResourceDetailsViewProps {
  resource: LearningResource;
  relatedResources: LearningResource[];
}

export function ResourceDetailsView({
  resource,
  relatedResources,
}: ResourceDetailsViewProps) {
  const {
    recordResourceView,
    isBookmarked,
    bookmarks,
    collections,
    updateBookmarkMeta,
    toggleBookmark,
  } = useStudySphere();

  useEffect(() => {
    recordResourceView(resource.id);
  }, [resource.id, recordResourceView]);

  const savedItem = bookmarks.find((b) => b.resourceId === resource.id);
  const saved = isBookmarked(resource.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/explore" className="inline-flex items-center gap-1 text-brand-royal hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Explore
        </Link>
        <span>/</span>
        <Link
          href={`/explore?subject=${encodeURIComponent(resource.subjectSlug)}`}
          className="hover:text-brand-navy hover:underline"
        >
          {resource.subjectName}
        </Link>
        <span>/</span>
        <span className="max-w-xs truncate text-slate-700">{resource.title}</span>
      </nav>

      {/* Main Details Card */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left / Primary Content */}
        <div className="lg:col-span-8">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
            <ResourceThumbnail resource={resource} size="detail" />

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Link
                  href={`/explore?subject=${encodeURIComponent(resource.subjectSlug)}`}
                  className="rounded-full bg-brand-soft px-3 py-1 font-bold text-brand-royal hover:bg-blue-100"
                >
                  {resource.subjectName}
                </Link>
                {resource.level && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                    {resource.level}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {resource.verification === 'live-public-api'
                    ? 'Retrieved via Official Public API'
                    : 'Verified Resource Link'}
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
                {resource.title}
              </h1>

              {resource.authorOrInstitution && (
                <p className="mt-2 text-sm font-medium text-slate-600">
                  Provided by <strong className="text-brand-navy">{resource.authorOrInstitution}</strong>{' '}
                  via {resource.sourceName}
                </p>
              )}

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                <p>{resource.longDescription || resource.description}</p>
              </div>

              {/* Key Topics Covered */}
              {resource.keyTopics && resource.keyTopics.length > 0 && (
                <div className="mt-7 border-t border-slate-100 pt-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-brand-navy">
                    Key Concepts & Topics Covered
                  </h2>
                  <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {resource.keyTopics.map((topic) => (
                      <li key={topic} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Clickable Tags */}
              {resource.tags.length > 0 && (
                <div className="mt-7 border-t border-slate-100 pt-6">
                  <h2 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Tag className="h-3.5 w-3.5" />
                    Searchable Tags
                  </h2>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {resource.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/explore?q=${encodeURIComponent(tag)}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-brand-royal/40 hover:bg-brand-soft hover:text-brand-royal"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right / Action & Metadata Sidebar */}
        <aside className="space-y-5 lg:col-span-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            {resource.accessLabel && (
              <div className="mb-4 inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                {resource.accessLabel}
              </div>
            )}

            {/* Prominent Open Original Resource CTA */}
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-royal px-5 py-3.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2"
            >
              <span>Open Original Resource</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <div className="mt-3 flex flex-col gap-2">
              <BookmarkButton resource={resource} variant="button" />

              {/* Collection Picker if saved (or quick-save to collection) */}
              <div className="mt-1 flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-xs">
                <FolderHeart className="h-4 w-4 shrink-0 text-brand-royal" />
                <label htmlFor="bookmark-collection-select" className="font-medium text-slate-600">
                  Collection:
                </label>
                <select
                  id="bookmark-collection-select"
                  value={savedItem?.collection || 'General'}
                  onChange={(e) => {
                    const col = e.target.value;
                    if (!saved) {
                      toggleBookmark(resource, col);
                    } else {
                      updateBookmarkMeta(resource.id, { collection: col });
                    }
                  }}
                  className="ml-auto rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-brand-navy focus:border-brand-royal focus:outline-none"
                >
                  {collections.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Source Attribution & Hosting Transparency Notice */}
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-slate-200/90 bg-brand-soft/60 p-3.5 text-xs leading-relaxed text-slate-700">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-royal" />
              <p>
                <strong>Hosted by {resource.sourceName}:</strong> StudySphere indexes and describes
                educational materials without mirroring or redistributing copyrighted files. Clicking
                “Open Original Resource” takes you directly to the official provider.
              </p>
            </div>

            {/* Structured Metadata List */}
            <dl className="mt-6 divide-y divide-slate-100 text-xs">
              <div className="flex items-center justify-between py-2.5">
                <dt className="inline-flex items-center gap-1.5 font-medium text-slate-500">
                  <Layers className="h-3.5 w-3.5" />
                  Format
                </dt>
                <dd className="font-bold capitalize text-brand-navy">{resource.format}</dd>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <dt className="inline-flex items-center gap-1.5 font-medium text-slate-500">
                  <BookOpen className="h-3.5 w-3.5" />
                  Source
                </dt>
                <dd className="font-bold text-brand-navy">{resource.sourceName}</dd>
              </div>

              {resource.duration && (
                <div className="flex items-center justify-between py-2.5">
                  <dt className="inline-flex items-center gap-1.5 font-medium text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    Estimated Duration
                  </dt>
                  <dd className="font-semibold text-slate-800">{resource.duration}</dd>
                </div>
              )}

              <div className="flex items-center justify-between py-2.5">
                <dt className="inline-flex items-center gap-1.5 font-medium text-slate-500">
                  <Globe2 className="h-3.5 w-3.5" />
                  Language
                </dt>
                <dd className="font-semibold text-slate-800">{resource.language}</dd>
              </div>

              {resource.publishedYear && (
                <div className="flex items-center justify-between py-2.5">
                  <dt className="inline-flex items-center gap-1.5 font-medium text-slate-500">
                    <Calendar className="h-3.5 w-3.5" />
                    Publication / Edition
                  </dt>
                  <dd className="font-semibold text-slate-800">{resource.publishedYear}</dd>
                </div>
              )}

              {resource.license && (
                <div className="flex items-center justify-between gap-2 py-2.5">
                  <dt className="inline-flex items-center gap-1.5 font-medium text-slate-500">
                    <Scale className="h-3.5 w-3.5" />
                    License
                  </dt>
                  <dd className="text-right font-semibold text-slate-800">{resource.license}</dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>

      {/* Related Learning Resources */}
      {relatedResources.length > 0 && (
        <section aria-labelledby="related-resources-heading" className="mt-14">
          <div className="mb-6 flex items-center justify-between">
            <h2
              id="related-resources-heading"
              className="text-xl font-bold tracking-tight text-brand-navy sm:text-2xl"
            >
              Related Learning Resources
            </h2>
            <Link
              href={`/explore?subject=${encodeURIComponent(resource.subjectSlug)}`}
              className="text-xs font-semibold text-brand-royal hover:underline"
            >
              More in {resource.subjectName} →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedResources.map((rel) => (
              <ResourceCard key={rel.id} resource={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
