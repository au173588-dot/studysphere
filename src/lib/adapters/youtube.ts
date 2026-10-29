import { LearningResource } from '@/types';
import { AdapterSearchResult, AdapterStatus, SourceAdapter } from './types';

/**
 * Official YouTube Data API v3 Adapter
 * Never scrapes YouTube HTML. Uses the official Data API v3 when YOUTUBE_API_KEY
 * is set on the server; otherwise reports an honest setup message.
 */
export const youtubeAdapter: SourceAdapter = {
  id: 'youtube-edu',
  name: 'YouTube Data API v3 (Educational)',

  getStatus(): AdapterStatus {
    const hasKey = Boolean(process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_API_KEY.trim().length > 10);
    return {
      id: 'youtube-edu',
      name: 'YouTube Educational Video API',
      configured: hasKey,
      mode: hasKey ? 'live-api' : 'requires-api-key',
      setupMessage: hasKey
        ? undefined
        : 'Set YOUTUBE_API_KEY in .env.local to enable live YouTube Data API v3 queries. Verified curated YouTube educational playlists (3Blue1Brown, CrashCourse, StatQuest) are active in the catalog.',
    };
  },

  async search(query: string, limit = 4): Promise<AdapterSearchResult> {
    const apiKey = process.env.YOUTUBE_API_KEY?.trim();
    if (!apiKey) {
      return {
        adapterId: 'youtube-edu',
        adapterName: 'YouTube Educational API',
        configured: false,
        resources: [],
        setupMessage:
          'Live YouTube API search is not configured yet. Add YOUTUBE_API_KEY to .env.local to query YouTube Data API v3 directly.',
      };
    }

    const trimmed = query.trim();
    if (!trimmed) {
      return {
        adapterId: 'youtube-edu',
        adapterName: 'YouTube Educational API',
        configured: true,
        resources: [],
      };
    }

    try {
      const endpoint = new URL('https://www.googleapis.com/youtube/v3/search');
      endpoint.searchParams.set('part', 'snippet');
      endpoint.searchParams.set('type', 'video');
      endpoint.searchParams.set('videoCategoryId', '27'); // Education category
      endpoint.searchParams.set('safeSearch', 'strict');
      endpoint.searchParams.set('maxResults', String(limit));
      endpoint.searchParams.set('q', trimmed);
      endpoint.searchParams.set('key', apiKey);

      const res = await fetch(endpoint.toString(), {
        signal: AbortSignal.timeout(4500),
      });

      if (!res.ok) {
        throw new Error(`YouTube Data API responded with HTTP ${res.status}`);
      }

      const json = await res.json();
      const items = (json?.items || []) as Array<{
        id: { videoId: string };
        snippet: {
          title: string;
          description: string;
          channelTitle: string;
          publishedAt?: string;
          thumbnails?: { high?: { url: string }; medium?: { url: string } };
        };
      }>;

      const resources: LearningResource[] = items.map((item) => {
        const vid = item.id.videoId;
        const year = item.snippet.publishedAt
          ? Number(item.snippet.publishedAt.slice(0, 4))
          : undefined;
        return {
          id: `yt-${vid}`,
          title: item.snippet.title,
          description:
            item.snippet.description ||
            `Educational video tutorial published by ${item.snippet.channelTitle}.`,
          url: `https://www.youtube.com/watch?v=${vid}`,
          sourceId: 'youtube-edu',
          sourceName: 'YouTube Educational Channels',
          subjectSlug: 'computer-science',
          subjectName: 'Educational Video',
          format: 'video',
          level: 'All Levels',
          language: 'English',
          accessLabel: 'Free Video',
          publishedYear: year,
          authorOrInstitution: item.snippet.channelTitle,
          thumbnailUrl:
            item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
          tags: ['youtube', 'video', 'tutorial'],
          verification: 'live-public-api',
        };
      });

      return {
        adapterId: 'youtube-edu',
        adapterName: 'YouTube Educational API',
        configured: true,
        resources,
      };
    } catch (err) {
      return {
        adapterId: 'youtube-edu',
        adapterName: 'YouTube Educational API',
        configured: true,
        resources: [],
        error: err instanceof Error ? err.message : 'YouTube API search failed.',
      };
    }
  },
};
