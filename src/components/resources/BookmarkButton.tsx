'use client';

import React, { useState } from 'react';
import { Bookmark, Check } from 'lucide-react';
import { useStudySphere } from '@/context/StudySphereContext';
import { LearningResource } from '@/types';

interface BookmarkButtonProps {
  resource: LearningResource;
  variant?: 'icon' | 'button';
}

export function BookmarkButton({ resource, variant = 'icon' }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useStudySphere();
  const [justToggled, setJustToggled] = useState(false);

  const saved = isBookmarked(resource.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(resource);
    setJustToggled(true);
    setTimeout(() => setJustToggled(false), 1200);
  };

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={saved}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal focus-visible:ring-offset-2 ${
          saved
            ? 'bg-brand-soft text-brand-royal ring-1 ring-brand-royal/30 hover:bg-blue-100/70'
            : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-brand-navy'
        }`}
      >
        {saved ? (
          <>
            <Bookmark className="h-4 w-4 fill-brand-royal text-brand-royal" />
            <span>{justToggled ? 'Saved to Bookmarks' : 'Bookmarked'}</span>
          </>
        ) : (
          <>
            <Bookmark className="h-4 w-4" />
            <span>Save for Later</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? `Remove ${resource.title} from saved resources` : `Save ${resource.title} to bookmarks`}
      aria-pressed={saved}
      title={saved ? 'Remove bookmark' : 'Save resource'}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal ${
        saved
          ? 'bg-brand-royal text-white shadow-sm'
          : 'bg-white/95 text-slate-700 shadow-sm hover:bg-white hover:text-brand-royal'
      }`}
    >
      {justToggled && saved ? (
        <Check className="h-4 w-4" />
      ) : (
        <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
      )}
    </button>
  );
}
