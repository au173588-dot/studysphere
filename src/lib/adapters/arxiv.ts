import { LearningResource } from '@/types';
import { AdapterSearchResult, AdapterStatus, SourceAdapter } from './types';

const cache = new Map<string, { expires: number; data: LearningResource[] }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

function extractXmlTag(block: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = block.match(regex);
  return match ? match[1].replace(/\s+/g, ' ').trim() : '';
}

export const arxivAdapter: SourceAdapter = {
  id: 'arxiv',
  name: 'arXiv Open-Access Repository',

  getStatus(): AdapterStatus {
    return {
      id: 'arxiv',
      name: 'arXiv Open-Access STEM API',
      configured: true,
      mode: 'live-api',
    };
  },

  async search(query: string, limit = 3): Promise<AdapterSearchResult> {
    const trimmed = query.trim();
    if (!trimmed) {
      return {
        adapterId: 'arxiv',
        adapterName: 'arXiv',
        configured: true,
        resources: [],
      };
    }

    const cacheKey = `${trimmed.toLowerCase()}:${limit}`;
    const hit = cache.get(cacheKey);
    if (hit && hit.expires > Date.now()) {
      return {
        adapterId: 'arxiv',
        adapterName: 'arXiv',
        configured: true,
        resources: hit.data,
      };
    }

    try {
      const endpoint = new URL('https://export.arxiv.org/api/query');
      endpoint.searchParams.set('search_query', `all:${trimmed}`);
      endpoint.searchParams.set('start', '0');
      endpoint.searchParams.set('max_results', String(limit));

      const res = await fetch(endpoint.toString(), {
        headers: {
          'User-Agent': 'StudySphere/1.0 (Educational Resource Discovery Platform)',
        },
        signal: AbortSignal.timeout(4800),
      });

      if (!res.ok) {
        throw new Error(`arXiv API responded with HTTP ${res.status}`);
      }

      const xml = await res.text();
      const entries = xml.split('<entry>').slice(1);

      const resources: LearningResource[] = entries.slice(0, limit).map((entryBlock) => {
        const rawIdUrl = extractXmlTag(entryBlock, 'id');
        const shortId = rawIdUrl.split('/abs/')[1]?.replace(/\//g, '_') || 'paper';
        const title = extractXmlTag(entryBlock, 'title') || 'arXiv Open-Access Paper';
        const summary = extractXmlTag(entryBlock, 'summary');
        const published = extractXmlTag(entryBlock, 'published');
        const year = published ? Number(published.slice(0, 4)) : undefined;

        const authorMatches = Array.from(entryBlock.matchAll(/<name>([\s\S]*?)<\/name>/gi)).map((m) =>
          m[1].trim()
        );
        const authors = authorMatches.slice(0, 3).join(', ') || 'arXiv Authors';

        return {
          id: `arxiv-${shortId}`,
          title,
          description: summary.slice(0, 240) + (summary.length > 240 ? '…' : ''),
          longDescription: summary,
          url: rawIdUrl || 'https://arxiv.org',
          sourceId: 'arxiv',
          sourceName: 'arXiv Open Repository',
          subjectSlug: 'mathematics',
          subjectName: 'STEM Research & Lecture Notes',
          format: 'pdf',
          level: 'Advanced',
          duration: 'Open-access paper / PDF',
          durationBucket: '1-5h',
          language: 'English',
          accessLabel: 'Free Open-Access PDF',
          license: 'arXiv Open Access / CC',
          publishedYear: year && !Number.isNaN(year) ? year : undefined,
          authorOrInstitution: authors,
          tags: ['arxiv', 'research paper', 'pdf', 'open access'],
          verification: 'live-public-api',
        };
      });

      cache.set(cacheKey, { expires: Date.now() + CACHE_TTL_MS, data: resources });
      return {
        adapterId: 'arxiv',
        adapterName: 'arXiv',
        configured: true,
        resources,
      };
    } catch (err) {
      return {
        adapterId: 'arxiv',
        adapterName: 'arXiv',
        configured: true,
        resources: [],
        error: err instanceof Error ? err.message : 'arXiv search timed out.',
      };
    }
  },
};
