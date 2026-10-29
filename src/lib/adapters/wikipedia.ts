import { LearningResource } from '@/types';
import { AdapterSearchResult, AdapterStatus, SourceAdapter } from './types';

const cache = new Map<string, { expires: number; data: LearningResource[] }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

function inferSubjectFromTitleAndSnippet(text: string): { slug: string; name: string } {
  const lower = text.toLowerCase();
  if (/python|javascript|algorithm|software|programming|compiler|html|css|computer science/.test(lower)) {
    return { slug: 'computer-science', name: 'Computer Science' };
  }
  if (/network|tcp|http|linux|database|sql|cyber|encryption|protocol/.test(lower)) {
    return { slug: 'information-technology', name: 'Information Technology' };
  }
  if (/calculus|algebra|matrix|geometry|theorem|integral|derivative|equation/.test(lower)) {
    return { slug: 'mathematics', name: 'Mathematics' };
  }
  if (/cell|dna|gene|biology|organism|ecology|evolution|protein/.test(lower)) {
    return { slug: 'biology', name: 'Biology' };
  }
  if (/quantum|mechanics|relativity|optics|thermodynamics|electromag|physics/.test(lower)) {
    return { slug: 'physics', name: 'Physics' };
  }
  if (/chemistry|molecule|atom|reaction|acid|organic|periodic/.test(lower)) {
    return { slug: 'chemistry', name: 'Chemistry' };
  }
  if (/market|economics|inflation|gdp|finance|accounting|trade/.test(lower)) {
    return { slug: 'business-economics', name: 'Business and Economics' };
  }
  if (/anatomy|medicine|clinical|disease|health|physiology|immun/.test(lower)) {
    return { slug: 'health-sciences', name: 'Health Sciences' };
  }
  if (/statistics|probability|regression|dataset|data analysis/.test(lower)) {
    return { slug: 'data-science', name: 'Data Science & Statistics' };
  }
  return { slug: 'social-sciences', name: 'General Reference & Encyclopedia' };
}

export const wikipediaAdapter: SourceAdapter = {
  id: 'wikipedia',
  name: 'Wikipedia (Official MediaWiki API)',

  getStatus(): AdapterStatus {
    return {
      id: 'wikipedia',
      name: 'Wikipedia (MediaWiki Public API)',
      configured: true,
      mode: 'live-api',
    };
  },

  async search(query: string, limit = 4): Promise<AdapterSearchResult> {
    const trimmed = query.trim();
    if (!trimmed) {
      return {
        adapterId: 'wikipedia',
        adapterName: 'Wikipedia',
        configured: true,
        resources: [],
      };
    }

    const cacheKey = `${trimmed.toLowerCase()}:${limit}`;
    const hit = cache.get(cacheKey);
    if (hit && hit.expires > Date.now()) {
      return {
        adapterId: 'wikipedia',
        adapterName: 'Wikipedia',
        configured: true,
        resources: hit.data,
      };
    }

    try {
      const endpoint = new URL('https://en.wikipedia.org/w/api.php');
      endpoint.searchParams.set('action', 'query');
      endpoint.searchParams.set('generator', 'search');
      endpoint.searchParams.set('gsrsearch', trimmed);
      endpoint.searchParams.set('gsrlimit', String(limit));
      endpoint.searchParams.set('prop', 'pageimages|extracts|info');
      endpoint.searchParams.set('exintro', '1');
      endpoint.searchParams.set('explaintext', '1');
      endpoint.searchParams.set('exchars', '260');
      endpoint.searchParams.set('piprop', 'thumbnail');
      endpoint.searchParams.set('pithumbsize', '480');
      endpoint.searchParams.set('inprop', 'url');
      endpoint.searchParams.set('format', 'json');

      const res = await fetch(endpoint.toString(), {
        headers: {
          'User-Agent': 'StudySphere/1.0 (Educational Resource Discovery Platform)',
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(4500),
      });

      if (!res.ok) {
        throw new Error(`Wikipedia API responded with HTTP ${res.status}`);
      }

      const json = await res.json();
      const pagesObj = json?.query?.pages || {};
      const pages = Object.values(pagesObj) as Array<{
        pageid: number;
        index?: number;
        title: string;
        extract?: string;
        fullurl?: string;
        thumbnail?: { source: string };
      }>;

      pages.sort((a, b) => (a.index ?? 99) - (b.index ?? 99));

      const resources: LearningResource[] = pages.map((page) => {
        const summary =
          page.extract?.trim() ||
          `Encyclopedic reference article on ${page.title} maintained by Wikipedia contributors.`;
        const subj = inferSubjectFromTitleAndSnippet(`${page.title} ${summary}`);
        return {
          id: `wiki-${page.pageid}`,
          title: `${page.title} — Wikipedia Study Reference`,
          description: summary,
          longDescription: `${summary} Retrieved live via the Wikimedia Foundation MediaWiki API. Includes inline scholarly references, diagrams, and further reading links on Wikipedia.`,
          url:
            page.fullurl ||
            `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
          sourceId: 'wikipedia',
          sourceName: 'Wikipedia',
          subjectSlug: subj.slug,
          subjectName: subj.name,
          format: 'article',
          level: 'All Levels',
          duration: 'Reference article',
          durationBucket: 'under-1h',
          language: 'English',
          accessLabel: 'Open Access (CC BY-SA 4.0)',
          license: 'CC BY-SA 4.0',
          publishedYear: new Date().getFullYear(),
          authorOrInstitution: 'Wikipedia Contributors',
          thumbnailUrl: page.thumbnail?.source,
          tags: [page.title.toLowerCase(), 'wikipedia', 'encyclopedia', subj.slug],
          verification: 'live-public-api',
        };
      });

      cache.set(cacheKey, { expires: Date.now() + CACHE_TTL_MS, data: resources });
      return {
        adapterId: 'wikipedia',
        adapterName: 'Wikipedia',
        configured: true,
        resources,
      };
    } catch (err) {
      return {
        adapterId: 'wikipedia',
        adapterName: 'Wikipedia',
        configured: true,
        resources: [],
        error: err instanceof Error ? err.message : 'Live Wikipedia search timed out.',
      };
    }
  },

  async getById(id: string): Promise<LearningResource | null> {
    if (!id.startsWith('wiki-')) return null;
    const pageId = id.replace('wiki-', '');
    if (!/^\d+$/.test(pageId)) return null;

    try {
      const endpoint = new URL('https://en.wikipedia.org/w/api.php');
      endpoint.searchParams.set('action', 'query');
      endpoint.searchParams.set('pageids', pageId);
      endpoint.searchParams.set('prop', 'pageimages|extracts|info');
      endpoint.searchParams.set('exintro', '1');
      endpoint.searchParams.set('explaintext', '1');
      endpoint.searchParams.set('piprop', 'thumbnail');
      endpoint.searchParams.set('pithumbsize', '640');
      endpoint.searchParams.set('inprop', 'url');
      endpoint.searchParams.set('format', 'json');

      const res = await fetch(endpoint.toString(), {
        headers: {
          'User-Agent': 'StudySphere/1.0 (Educational Resource Discovery Platform)',
        },
        signal: AbortSignal.timeout(4500),
      });
      if (!res.ok) return null;
      const json = await res.json();
      const page = json?.query?.pages?.[pageId];
      if (!page || page.missing !== undefined) return null;

      const summary =
        page.extract?.trim() || `Reference article on ${page.title} from Wikipedia.`;
      const subj = inferSubjectFromTitleAndSnippet(`${page.title} ${summary}`);

      return {
        id: `wiki-${page.pageid}`,
        title: `${page.title} — Wikipedia Study Reference`,
        description: summary.slice(0, 260) + (summary.length > 260 ? '…' : ''),
        longDescription: summary,
        url:
          page.fullurl ||
          `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
        sourceId: 'wikipedia',
        sourceName: 'Wikipedia',
        subjectSlug: subj.slug,
        subjectName: subj.name,
        format: 'article',
        level: 'All Levels',
        duration: 'Reference article',
        durationBucket: 'under-1h',
        language: 'English',
        accessLabel: 'Open Access (CC BY-SA 4.0)',
        license: 'CC BY-SA 4.0',
        publishedYear: new Date().getFullYear(),
        authorOrInstitution: 'Wikipedia Contributors',
        thumbnailUrl: page.thumbnail?.source,
        tags: [page.title.toLowerCase(), 'wikipedia', 'reference'],
        verification: 'live-public-api',
      };
    } catch {
      return null;
    }
  },
};
