import { NextRequest, NextResponse } from 'next/server';
import { CURATED_RESOURCES } from '@/data/resources';
import { getAllAdapterStatuses, searchLiveAdapters } from '@/lib/adapters';
import { AdapterSearchResult } from '@/lib/adapters/types';
import { filterAndSortResources, getRelatedSearchTerms } from '@/lib/search';
import { DifficultyLevel, DurationBucket, ResourceFormat, SearchFilters } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get('q') || '';
  const subject = searchParams.get('subject') || 'all';
  const format = (searchParams.get('format') || 'all') as ResourceFormat | 'all';
  const source = searchParams.get('source') || 'all';
  const level = (searchParams.get('level') || 'all') as DifficultyLevel | 'all';
  const language = searchParams.get('language') || 'all';
  const access = (searchParams.get('access') || 'all') as 'all' | 'free-verified';
  const duration = (searchParams.get('duration') || 'all') as DurationBucket | 'all';
  const year = (searchParams.get('year') || 'all') as 'all' | '2024' | '2020';
  const sort = (searchParams.get('sort') || 'relevance') as 'relevance' | 'newest' | 'title';
  const includeLive = searchParams.get('live') === '1';

  const filters: SearchFilters = {
    q,
    subject,
    format,
    source,
    level,
    language,
    access,
    duration,
    year,
    sort,
    includeLive,
  };

  let pool = [...CURATED_RESOURCES];
  let adapterReports: Omit<AdapterSearchResult, 'resources'>[] = getAllAdapterStatuses().map((s) => ({
    adapterId: s.id,
    adapterName: s.name,
    configured: s.configured,
    setupMessage: s.setupMessage,
  }));

  if (includeLive && q.trim().length >= 2) {
    const liveData = await searchLiveAdapters(q, source);
    // Deduplicate by URL
    const existingUrls = new Set(pool.map((r) => r.url.toLowerCase()));
    for (const liveItem of liveData.resources) {
      if (!existingUrls.has(liveItem.url.toLowerCase())) {
        pool.push(liveItem);
        existingUrls.add(liveItem.url.toLowerCase());
      }
    }
    adapterReports = liveData.adapterReports;
  }

  const results = filterAndSortResources(pool, filters);
  const suggestions = results.length === 0 ? getRelatedSearchTerms(q) : [];

  return NextResponse.json({
    total: results.length,
    results,
    suggestions,
    adapterReports,
  });
}
