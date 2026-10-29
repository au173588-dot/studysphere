'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  FileCode2,
  FileText,
  GraduationCap,
  Layers,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { getSubjectBySlug } from '@/data/subjects';
import { LearningResource, ResourceFormat } from '@/types';
import { getSubjectAccentStyles, SubjectIcon } from '@/components/ui/SubjectIcon';

const FORMAT_LABELS: Record<ResourceFormat, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  video: { label: 'Video', Icon: PlayCircle },
  article: { label: 'Article', Icon: FileText },
  pdf: { label: 'PDF / Open Text', Icon: FileText },
  course: { label: 'Course', Icon: GraduationCap },
  documentation: { label: 'Documentation', Icon: FileCode2 },
  interactive: { label: 'Interactive Lab', Icon: Sparkles },
  book: { label: 'Open Book', Icon: BookOpen },
};

interface ResourceThumbnailProps {
  resource: LearningResource;
  size?: 'card' | 'detail';
}

export function ResourceThumbnail({ resource, size = 'card' }: ResourceThumbnailProps) {
  const [imgError, setImgError] = useState(false);
  const subject = getSubjectBySlug(resource.subjectSlug);
  const accent = getSubjectAccentStyles(subject?.accentColor || 'blue');
  const formatMeta = FORMAT_LABELS[resource.format] || { label: resource.format, Icon: Layers };
  const FormatIcon = formatMeta.Icon;

  const heightClass = size === 'detail' ? 'h-56 sm:h-64' : 'h-44';

  if (resource.thumbnailUrl && !imgError) {
    return (
      <div className={`relative w-full ${heightClass} overflow-hidden bg-brand-navy`}>
        <img
          src={resource.thumbnailUrl}
          alt={`Cover illustration for ${resource.title}`}
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/20 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-brand-navy shadow-sm">
            {resource.sourceName}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-brand-navy/85 px-2.5 py-1 text-[11px] font-medium text-sky-100 backdrop-blur-sm">
            <FormatIcon className="h-3.5 w-3.5 text-sky-300" />
            {formatMeta.label}
          </span>
          {resource.programmingLanguage && (
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
              {resource.programmingLanguage}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Professional art-directed category illustration when external thumbnail is unavailable
  return (
    <div
      className={`relative w-full ${heightClass} overflow-hidden bg-gradient-to-br ${accent.banner}`}
    >
      {/* Subtle architectural pattern */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-15"
        viewBox="0 0 400 200"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id={`grid-${resource.id}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="white" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="400" height="200" fill={`url(#grid-${resource.id})`} />
        <circle cx="340" cy="40" r="78" stroke="white" strokeWidth="1.5" strokeDasharray="5 5" />
        <circle cx="340" cy="40" r="46" stroke="white" strokeWidth="1.2" />
      </svg>

      {/* Center subject emblem */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/12 text-white ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
          <SubjectIcon iconName={subject?.iconName || 'LayoutGrid'} className="h-8 w-8" />
        </div>
      </div>

      {/* Source badge top-left */}
      <div className="absolute left-3 top-3 right-12 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex max-w-full truncate items-center rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-brand-navy shadow-sm">
          {resource.sourceName}
        </span>
      </div>

      {/* Format & language bottom strip */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          <FormatIcon className="h-3.5 w-3.5 text-sky-300" />
          {formatMeta.label}
        </span>
        {resource.programmingLanguage ? (
          <span className="rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            {resource.programmingLanguage}
          </span>
        ) : (
          <span className="truncate rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white/90">
            {resource.subjectName}
          </span>
        )}
      </div>
    </div>
  );
}
