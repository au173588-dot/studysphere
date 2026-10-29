import { LearningResource } from '@/types';
import { AdapterSearchResult, AdapterStatus, SourceAdapter } from './types';

const cache = new Map<string, { expires: number; data: LearningResource[] }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

export const openLibraryAdapter: SourceAdapter = {
  id: 'openlibrary',
  name: 'Open Library / Internet Archive',

  getStatus(): AdapterStatus {
    return {
      id: 'openlibrary',
      name: 'Open Library & Internet Archive API',
      configured: true,
      mode: 'live-api',
    };
  },

  async search(query: string, limit = 4): Promise<AdapterSearchResult> {
    const trimmed = query.trim();
    if (!trimmed) {
      return {
        adapterId: 'openlibrary',
        adapterName: 'Open Library',
        configured: true,
        resources: [],
      };
    }

    const cacheKey = `${trimmed.toLowerCase()}:${limit}`;
    const hit = cache.get(cacheKey);
    if (hit && hit.expires > Date.now()) {
      return {
        adapterId: 'openlibrary',
        adapterName: 'Open Library',
        configured: true,
        resources: hit.data,
      };
    }

    try {
      const endpoint = new URL('https://openlibrary.org/search.json');
      endpoint.searchParams.set('q', trimmed);
      endpoint.searchParams.set('limit', String(limit));
      endpoint.searchParams.set(
        'fields',
        'key,title,author_name,first_publish_year,subject,cover_i,ebook_access,language'
      );

      const res = await fetch(endpoint.toString(), {
        headers: {
          'User-Agent': 'StudySphere/1.0 (Educational Resource Discovery Platform)',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(4800),
      });

      if (!res.ok) {
        throw new Error(`Open Library API responded with HTTP ${res.status}`);
      }

      const json = await res.json();
      const docs = (json?.docs || []) as Array<{
        key: string;
        title: string;
        author_name?: string[];
        first_publish_year?: number;
        subject?: string[];
        cover_i?: number;
        ebook_access?: string;
      }>;

      const resources: LearningResource[] = docs.slice(0, limit).map((doc) => {
        const workSlug = doc.key.replace('/works/', '');
        const authors = doc.author_name?.slice(0, 2).join(', ') || 'Open Library Catalog';
        const subjects = doc.subject?.slice(0, 4) || [];
        const accessLabel =
          doc.ebook_access === 'public'
            ? 'Public Domain Full Text'
            : doc.ebook_access === 'borrowable'
              ? 'Free Controlled Digital Lending'
              : undefined;

        return {
          id: `ol-${workSlug}`,
          title: doc.title,
          description: `Book record by ${authors}${
            doc.first_publish_year ? ` (first published ${doc.first_publish_year})` : ''
          }${subjects.length ? `. Topics: ${subjects.slice(0, 3).join(', ')}.` : '.'}`,
          longDescription: `Indexed live from the Internet Archive’s Open Library catalog. Authored by ${authors}.${
            subjects.length ? ` Catalog subjects include: ${subjects.join(', ')}.` : ''
          }`,
          url: `https://openlibrary.org${doc.key}`,
          sourceId: 'openlibrary',
          sourceName: 'Open Library & Internet Archive',
          subjectSlug: 'humanities',
          subjectName: subjects[0] || 'Open Library Books',
          format: 'book',
          level: 'All Levels',
          duration: 'Book / Monograph',
          durationBucket: 'reference',
          language: 'English',
          accessLabel,
          publishedYear: doc.first_publish_year,
          authorOrInstitution: authors,
          thumbnailUrl: doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
            : undefined,
          tags: ['book', 'open library', ...subjects.slice(0, 3).map((s) => s.toLowerCase())],
          verification: 'live-public-api',
        };
      });

      cache.set(cacheKey, { expires: Date.now() + CACHE_TTL_MS, data: resources });
      return {
        adapterId: 'openlibrary',
        adapterName: 'Open Library',
        configured: true,
        resources,
      };
    } catch (err) {
      return {
        adapterId: 'openlibrary',
        adapterName: 'Open Library',
        configured: true,
        resources: [],
        error: err instanceof Error ? err.message : 'Open Library search timed out.',
      };
    }
  },

  async getById(id: string): Promise<LearningResource | null> {
    if (!id.startsWith('ol-')) return null;
    const workId = id.replace('ol-', '');
    if (!/^OL[0-9A-Z]+$/i.test(workId)) return null;

    try {
      const res = await fetch(`https://openlibrary.org/works/${workId}.json`, {
        headers: {
          'User-Agent': 'StudySphere/1.0 (Educational Resource Discovery Platform)',
        },
        signal: AbortSignal.timeout(4500),
      });
      if (!res.ok) return null;
      const work = await res.json();
      const rawDesc =
        typeof work.description === 'string'
          ? work.description
          : work.description?.value ||
            'Cataloged educational book entry hosted on Internet Archive’s Open Library.';
      const coverId = Array.isArray(work.covers) && work.covers.length > 0 ? work.covers[0] : undefined;
      const subjects: string[] = Array.isArray(work.subjects) ? work.subjects.slice(0, 6) : [];

      return {
        id: `ol-${workId}`,
        title: work.title || 'Open Library Book',
        description: rawDesc.slice(0, 240) + (rawDesc.length > 240 ? '…' : ''),
        longDescription: rawDesc,
        keyTopics: subjects,
        url: `https://openlibrary.org/works/${workId}`,
        sourceId: 'openlibrary',
        sourceName: 'Open Library & Internet Archive',
        subjectSlug: 'humanities',
        subjectName: subjects[0] || 'Open Library Books',
        format: 'book',
        level: 'All Levels',
        duration: 'Book / Monograph',
        durationBucket: 'reference',
        language: 'English',
        authorOrInstitution: 'Open Library / Internet Archive',
        thumbnailUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : undefined,
        tags: ['book', 'open library', ...subjects.slice(0, 4).map((s) => s.toLowerCase())],
        verification: 'live-public-api',
      };
    } catch {
      return null;
    }
  },
};
