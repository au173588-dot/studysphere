import { LearningResource } from '@/types';
import { getResourceById } from '@/data/resources';
import { arxivAdapter } from './arxiv';
import { internetArchiveAdapter } from './internetArchive';
import { openLibraryAdapter } from './openlibrary';
import { AdapterSearchResult, AdapterStatus, SourceAdapter } from './types';
import { wikipediaAdapter } from './wikipedia';
import { youtubeAdapter } from './youtube';

export const LIVE_ADAPTERS: SourceAdapter[] = [
  wikipediaAdapter,
  internetArchiveAdapter,
  openLibraryAdapter,
  arxivAdapter,
  youtubeAdapter,
];

export function getAllAdapterStatuses(): AdapterStatus[] {
  return LIVE_ADAPTERS.map((a) => a.getStatus());
}

export async function searchLiveAdapters(
  query: string,
  sourceFilter?: string
): Promise<{
  resources: LearningResource[];
  adapterReports: Omit<AdapterSearchResult, 'resources'>[];
}> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      resources: [],
      adapterReports: LIVE_ADAPTERS.map((a) => {
        const st = a.getStatus();
        return {
          adapterId: st.id,
          adapterName: st.name,
          configured: st.configured,
          setupMessage: st.setupMessage,
        };
      }),
    };
  }

  const activeAdapters =
    sourceFilter && sourceFilter !== 'all'
      ? LIVE_ADAPTERS.filter((a) => a.id === sourceFilter)
      : LIVE_ADAPTERS;

  const results = await Promise.all(activeAdapters.map((adapter) => adapter.search(trimmed, 4)));

  const merged: LearningResource[] = [];
  const reports: Omit<AdapterSearchResult, 'resources'>[] = [];

  for (const res of results) {
    merged.push(...res.resources);
    reports.push({
      adapterId: res.adapterId,
      adapterName: res.adapterName,
      configured: res.configured,
      error: res.error,
      setupMessage: res.setupMessage,
    });
  }

  return { resources: merged, adapterReports: reports };
}

export async function resolveResourceById(id: string): Promise<LearningResource | null> {
  const curated = getResourceById(id);
  if (curated) return curated;

  for (const adapter of LIVE_ADAPTERS) {
    if (adapter.getById) {
      const found = await adapter.getById(id);
      if (found) return found;
    }
  }
  return null;
}
