'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, ExternalLink, ShieldCheck, Globe } from 'lucide-react';
import { LearningResource } from '@/types';
import { ResourceThumbnail } from './ResourceThumbnail';
import { BookmarkButton } from './BookmarkButton';

interface ResourceCardProps {
  resource: LearningResource;
  recommendationReason?: string;
}

export function ResourceCard({ resource, recommendationReason }: ResourceCardProps) {
  const detailsHref =
    resource.verification === 'live-public-api'
      ? `/resources/${encodeURIComponent(resource.id)}?title=${encodeURIComponent(
          resource.title
        )}&url=${encodeURIComponent(resource.url)}&source=${encodeURIComponent(
          resource.sourceName
        )}&desc=${encodeURIComponent(resource.description)}&format=${encodeURIComponent(
          resource.format
        )}&subject=${encodeURIComponent(resource.subjectName)}`
      : `/resources/${encodeURIComponent(resource.id)}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-royal/30 hover:shadow-card-hover">
      {/* Top visual thumbnail + floating bookmark control */}
      <div className="relative">
        <Link href={detailsHref} className="block focus-visible:outline-none">
          <ResourceThumbnail resource={resource} />
        </Link>
        <div className="absolute right-3 top-3 z-10">
          <BookmarkButton resource={resource} />
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-5">
        {recommendationReason && (
          <p className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-medium text-brand-royal">
            <span>{recommendationReason}</span>
          </p>
        )}

        {/* Subject + Level + Verification */}
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-brand-royal">{resource.subjectName}</span>
          {resource.level && (
            <>
              <span className="text-slate-300" aria-hidden="true">
                •
              </span>
              <span className="text-slate-600">{resource.level}</span>
            </>
          )}
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
            {resource.verification === 'live-public-api' ? (
              <>
                <Globe className="h-3.5 w-3.5" />
                <span>Live API</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified</span>
              </>
            )}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-brand-navy group-hover:text-brand-royal">
          <Link
            href={detailsHref}
            className="focus-visible:outline-none focus-visible:underline"
          >
            {resource.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
          {resource.description}
        </p>

        {/* Verified metadata row (duration & access label only when backed by real info) */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {resource.duration && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {resource.duration}
            </span>
          )}
          {resource.accessLabel && (
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/15">
              {resource.accessLabel}
            </span>
          )}
          {resource.verifiedRating && (
            <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 font-semibold text-amber-800">
              ★ {resource.verifiedRating.score.toFixed(1)} ({resource.verifiedRating.count})
            </span>
          )}
        </div>

        {/* Action footer */}
        <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-3.5">
          <Link
            href={detailsHref}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-brand-navy px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-royal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-1"
          >
            View Resource
          </Link>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${resource.title} directly on ${resource.sourceName} (opens in a new tab)`}
            title={`Open directly on ${resource.sourceName}`}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-brand-royal/40 hover:bg-brand-soft hover:text-brand-royal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
