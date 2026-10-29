'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Compass,
  Download,
  ExternalLink,
  FolderPlus,
  HardDrive,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { getResourceById } from '@/data/resources';
import { useStudySphere } from '@/context/StudySphereContext';
import { LearningResource } from '@/types';

export function SavedResourcesClient() {
  const {
    user,
    bookmarks,
    collections,
    addCollection,
    removeBookmark,
    updateBookmarkMeta,
  } = useStudySphere();

  const [selectedCollection, setSelectedCollection] = useState<string>('ALL');
  const [newCollectionName, setNewCollectionName] = useState('');

  const resolvedBookmarks = bookmarks
    .map((item) => {
      const resource: LearningResource | undefined =
        getResourceById(item.resourceId) || item.snapshot;
      return resource ? { item, resource } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const visibleBookmarks =
    selectedCollection === 'ALL'
      ? resolvedBookmarks
      : resolvedBookmarks.filter((entry) => entry.item.collection === selectedCollection);

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    addCollection(newCollectionName.trim());
    setSelectedCollection(newCollectionName.trim());
    setNewCollectionName('');
  };

  const handleExportMarkdown = () => {
    const lines = [
      '# My StudySphere Saved Learning Resources',
      `Exported on ${new Date().toLocaleDateString()}`,
      '',
      ...visibleBookmarks.map(
        ({ item, resource }, i) =>
          `${i + 1}. **[${resource.title}](${resource.url})** — *${resource.sourceName}* (${
            resource.subjectName
          }, ${resource.format}) [Collection: ${item.collection}]${
            item.personalNote ? `\n   - Note: ${item.personalNote}` : ''
          }`
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'studysphere-bookmarks.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
            Saved Resources & Study Collections
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Organize bookmarked textbooks, videos, and documentation into custom folders with study
            notes.
          </p>
        </div>

        {visibleBookmarks.length > 0 && (
          <button
            type="button"
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-brand-navy shadow-xs hover:border-brand-royal hover:text-brand-royal"
          >
            <Download className="h-4 w-4" />
            <span>Export Markdown Reading List</span>
          </button>
        )}
      </div>

      {/* Persistence Status Banner (Section 11) */}
      <div className="mt-5 flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-brand-soft/60 p-4 sm:flex-row sm:items-center">
        {user ? (
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>
              <strong>Account Sync Active:</strong> Your saved resources and collections are
              synchronized with <strong>{user.email}</strong>.
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <HardDrive className="h-5 w-5 shrink-0 text-brand-royal" />
            <span>
              <strong>Guest Browser Storage:</strong> Saved resources currently persist in this
              browser on this device. Clearing browser storage may remove them unless you sync with
              an optional account or export your list.
            </span>
          </div>
        )}
        {!user && (
          <Link
            href="/account"
            className="shrink-0 rounded-xl bg-brand-navy px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-royal"
          >
            Sync with Free Account →
          </Link>
        )}
      </div>

      {/* Collections Filter & Create Bar */}
      <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCollection('ALL')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${
              selectedCollection === 'ALL'
                ? 'bg-brand-navy text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Saved ({resolvedBookmarks.length})
          </button>
          {collections.map((col) => {
            const count = resolvedBookmarks.filter((b) => b.item.collection === col).length;
            return (
              <button
                key={col}
                type="button"
                onClick={() => setSelectedCollection(col)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  selectedCollection === col
                    ? 'bg-brand-royal text-white'
                    : 'bg-brand-soft/70 text-brand-navy hover:bg-brand-soft'
                }`}
              >
                {col} ({count})
              </button>
            );
          })}
        </div>

        <form onSubmit={handleCreateCollection} className="flex items-center gap-2">
          <label htmlFor="new-collection-input" className="sr-only">
            New collection name
          </label>
          <input
            id="new-collection-input"
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="New collection folder..."
            maxLength={36}
            className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-brand-royal focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-brand-navy hover:border-brand-royal hover:text-brand-royal"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            <span>Add Folder</span>
          </button>
        </form>
      </div>

      {/* Saved Items List or Empty State */}
      {visibleBookmarks.length > 0 ? (
        <div className="mt-6 space-y-4">
          {visibleBookmarks.map(({ item, resource }) => (
            <div
              key={item.resourceId}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-brand-royal">{resource.sourceName}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-medium text-slate-600">{resource.subjectName}</span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold capitalize text-slate-700">
                      {resource.format}
                    </span>
                    {resource.accessLabel && (
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        {resource.accessLabel}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-1.5 text-lg font-bold text-brand-navy">
                    <Link
                      href={
                        resource.verification === 'live-public-api'
                          ? `/resources/${encodeURIComponent(resource.id)}?title=${encodeURIComponent(
                              resource.title
                            )}&url=${encodeURIComponent(resource.url)}&source=${encodeURIComponent(
                              resource.sourceName
                            )}&desc=${encodeURIComponent(
                              resource.description
                            )}&format=${encodeURIComponent(
                              resource.format
                            )}&subject=${encodeURIComponent(resource.subjectName)}`
                          : `/resources/${encodeURIComponent(resource.id)}`
                      }
                      className="hover:text-brand-royal"
                    >
                      {resource.title}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">{resource.description}</p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <select
                    aria-label={`Move ${resource.title} to collection`}
                    value={item.collection}
                    onChange={(e) =>
                      updateBookmarkMeta(item.resourceId, { collection: e.target.value })
                    }
                    className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-brand-navy focus:border-brand-royal focus:outline-none"
                  >
                    {collections.map((c) => (
                      <option key={c} value={c}>
                        Folder: {c}
                      </option>
                    ))}
                  </select>

                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-brand-navy px-3.5 text-xs font-bold text-white hover:bg-brand-royal"
                  >
                    <span>Open Original</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => removeBookmark(item.resourceId)}
                    aria-label={`Remove ${resource.title} from bookmarks`}
                    className="inline-flex h-9 items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Personal Study Note */}
              <div className="mt-4 border-t border-slate-100 pt-3">
                <label
                  htmlFor={`note-${item.resourceId}`}
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-400"
                >
                  Personal Study Note (e.g., chapters to revise before exam)
                </label>
                <input
                  id={`note-${item.resourceId}`}
                  type="text"
                  value={item.personalNote || ''}
                  onChange={(e) =>
                    updateBookmarkMeta(item.resourceId, { personalNote: e.target.value })
                  }
                  placeholder="Add a quick note for yourself..."
                  className="mt-1 w-full rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-brand-royal focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand-royal">
            <Bookmark className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-brand-navy">
            {selectedCollection === 'ALL'
              ? 'You haven’t saved any learning resources yet'
              : `No resources saved in “${selectedCollection}” yet`}
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600">
            Click the bookmark icon on any textbook, lecture course, or documentation guide to build
            your personal study library.
          </p>
          <Link
            href="/explore"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-royal px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-navy"
          >
            <Compass className="h-4 w-4" />
            <span>Explore Learning Resources</span>
          </Link>
        </div>
      )}
    </div>
  );
}
