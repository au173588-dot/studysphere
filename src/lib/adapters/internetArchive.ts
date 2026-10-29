import { LearningResource } from '@/types';
import { AdapterSearchResult, AdapterStatus, SourceAdapter } from './types';

const cache = new Map<string, { expires: number; data: LearningResource[] }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

export const internetArchiveAdapter: SourceAdapter = {
  id: 'internet-archive',
  name: 'Internet Archive (Official Public Search API)',

  getStatus(): AdapterStatus {
    return {
      id: 'internet-archive',
      name: 'Internet Archive Digital Library API',
      configured: true,
      mode: 'live-api',
    };
  },

  async search(query: string, limit = 3): Promise<AdapterSearchResult> {
    const trimmed = query.trim();
    if (!trimmed) {
      return {
        adapterId: 'internet-archive',
        adapterName: 'Internet Archive',
        configured: true,
        resources: [],
      };
    }

    const cacheKey = `${trimmed.toLowerCase()}:${limit}`;
    const hit = cache.get(cacheKey);
    if (hit && hit.expires > Date.now()) {
      return {
        adapterId: 'internet-archive',
        adapterName: 'Internet Archive',
        configured: true,
        resources: hit.data,
      };
    }

    try {
      const endpoint = new URL('https://archive.org/advancedsearch.php');
      endpoint.searchParams.set('q', `(${trimmed}) AND mediatype:texts`);
      endpoint.searchParams.append('fl[]', 'identifier');
      endpoint.searchParams.append('fl[]', 'title');
      endpoint.searchParams.append('fl[]', 'creator');
      endpoint.searchParams.append('fl[]', 'description');
      endpoint.searchParams.append('fl[]', 'year');
      endpoint.searchParams.set('rows', String(limit));
      endpoint.searchParams.set('page', '1');
      endpoint.searchParams.set('output', 'json');

      const res = await fetch(endpoint.toString(), {
        headers: {
          'User-Agent': 'StudySphere/1.0 (Educational Resource Discovery Platform)',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(4800),
      });

      if (!res.ok) {
        throw new Error(`Internet Archive API responded with HTTP ${res.status}`);
      }

      const json = await res.json();
      const docs = (json?.response?.docs || []) as Array<{
        identifier: string;
        title?: string;
        creator?: string | string[];
        description?: string | string[];
        year?: string | number;
      }>;

      const resources: LearningResource[] = docs.slice(0, limit).map((doc) => {
        const creator = Array.isArray(doc.creator)
          ? doc.creator.slice(0, 2).join(', ')
          : doc.creator || 'Internet Archive Contributor';
        const rawDesc = Array.isArray(doc.description)
          ? doc.description.join(' ')
          : doc.description || '';
        const cleanDesc = rawDesc
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        const yearNum = doc.year ? Number(String(doc.year).slice(0, 4)) : undefined;

        return {
          id: `ia-${doc.identifier}`,
          title: doc.title || doc.identifier,
          description:
            cleanDesc.length > 10
              ? cleanDesc.slice(0, 220) + (cleanDesc.length > 220 ? '…' : '')
              : `Digital study text archived by ${creator} on the Internet Archive.`,
          longDescription:
            cleanDesc ||
            `Open digital library item (${doc.identifier}) hosted by the nonprofit Internet Archive.`,
          url: `https://archive.org/details/${encodeURIComponent(doc.identifier)}`,
          sourceId: 'internet-archive',
          sourceName: 'Internet Archive',
          subjectSlug: 'humanities',
          subjectName: 'Internet Archive Texts',
          format: 'book',
          level: 'All Levels',
          duration: 'Digital text / Archive record',
          durationBucket: 'reference',
          language: 'English',
          publishedYear: yearNum && !Number.isNaN(yearNum) ? yearNum : undefined,
          authorOrInstitution: creator,
          thumbnailUrl: `https://archive.org/services/img/${encodeURIComponent(doc.identifier)}`,
          tags: ['internet archive', 'digital library', 'book'],
          verification: 'live-public-api',
        };
      });

      cache.set(cacheKey, { expires: Date.now() + CACHE_TTL_MS, data: resources });
      return {
        adapterId: 'internet-archive',
        adapterName: 'Internet Archive',
        configured: true,
        resources,
      };
    } catch (err) {
      return {
        adapterId: 'internet-archive',
        adapterName: 'Internet Archive',
        configured: true,
        resources: [],
        error: err instanceof Error ? err.message : 'Internet Archive search timed out.',
      };
    }
  },
};
