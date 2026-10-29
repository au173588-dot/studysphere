import { CURATED_RESOURCES } from '@/data/resources';
import { SUBJECTS } from '@/data/subjects';
import { TRUSTED_SOURCES } from '@/data/sources';
import { LearningResource, SearchFilters } from '@/types';

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'the',
  'for',
  'to',
  'in',
  'of',
  'on',
  'with',
  'from',
  'by',
  'how',
  'learn',
]);

const FORMAT_SYNONYMS: Record<string, string[]> = {
  video: ['video', 'videos', 'lecture', 'lectures', 'playlist', 'youtube', 'watch', 'tutorials'],
  pdf: ['pdf', 'pdfs', 'notes', 'textbook', 'ebook', 'handout', 'printable'],
  course: ['course', 'courses', 'curriculum', 'class', 'opencourseware', 'tutorials'],
  documentation: ['documentation', 'docs', 'reference', 'manual', 'guide', 'api'],
  article: ['article', 'articles', 'wiki', 'encyclopedia', 'reading', 'overview'],
  interactive: ['interactive', 'practice', 'lab', 'simulation', 'exercises', 'quiz'],
  book: ['book', 'books', 'textbook', 'handbook', 'monograph'],
};

export function tokenizeQuery(rawQuery?: string): string[] {
  if (!rawQuery) return [];
  const cleaned = rawQuery
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const meaningful = cleaned.filter((t) => !STOP_WORDS.has(t));
  return meaningful.length > 0 ? meaningful : cleaned;
}

export function scoreResourceRelevance(resource: LearningResource, rawQuery?: string): number {
  if (!rawQuery || !rawQuery.trim()) {
    return resource.featured ? 15 : 10;
  }

  const phrase = rawQuery.trim().toLowerCase();
  const tokens = tokenizeQuery(rawQuery);
  if (tokens.length === 0) return 1;

  const title = resource.title.toLowerCase();
  const subject = `${resource.subjectName} ${resource.subjectSlug}`.toLowerCase();
  const tags = resource.tags.join(' ').toLowerCase();
  const topics = (resource.keyTopics || []).join(' ').toLowerCase();
  const desc = `${resource.description} ${resource.longDescription || ''}`.toLowerCase();
  const source = `${resource.sourceName} ${resource.sourceId} ${resource.authorOrInstitution || ''}`.toLowerCase();
  const progLang = (resource.programmingLanguage || '').toLowerCase();
  const level = (resource.level || '').toLowerCase();
  const formatWords = [
    resource.format,
    ...(FORMAT_SYNONYMS[resource.format] || []),
  ]
    .join(' ')
    .toLowerCase();

  let score = 0;

  // Exact phrase bonus
  if (title.includes(phrase)) score += 60;
  if (tags.includes(phrase)) score += 50;
  if (topics.includes(phrase)) score += 35;
  if (desc.includes(phrase)) score += 20;

  let matchedTokens = 0;

  for (const token of tokens) {
    let tokenScore = 0;
    // Also support basic singular stem (e.g., "beginners" -> "beginner", "tutorials" -> "tutorial")
    const stem = token.length > 4 && token.endsWith('s') ? token.slice(0, -1) : token;

    const matchesField = (field: string) =>
      field.includes(token) || (stem !== token && field.includes(stem));

    if (matchesField(title)) tokenScore += 28;
    if (matchesField(tags)) tokenScore += 24;
    if (matchesField(progLang)) tokenScore += 26;
    if (matchesField(subject)) tokenScore += 20;
    if (matchesField(topics)) tokenScore += 18;
    if (matchesField(formatWords)) tokenScore += 14;
    if (matchesField(source)) tokenScore += 16;
    if (matchesField(level)) tokenScore += 12;
    if (matchesField(desc)) tokenScore += 8;

    if (tokenScore > 0) {
      matchedTokens += 1;
      score += tokenScore;
    }
  }

  // Require at least half of meaningful tokens (or at least 1 if single token) to match
  const minRequired = tokens.length <= 2 ? tokens.length : Math.ceil(tokens.length * 0.6);
  if (matchedTokens < minRequired) {
    // Allow partial fallback if at least 1 strong token matched (title/tag/progLang) and phrase had format/level modifier
    if (matchedTokens === 0 || score < 24) {
      return 0;
    }
  }

  if (matchedTokens === tokens.length) {
    score += 20;
  }

  if (resource.featured) {
    score += 4;
  }

  return score;
}

export function filterAndSortResources(
  pool: LearningResource[],
  filters: SearchFilters
): LearningResource[] {
  const {
    q,
    subject,
    format,
    source,
    level,
    language,
    access,
    duration,
    year,
    sort = 'relevance',
  } = filters;

  const scored: Array<{ resource: LearningResource; score: number }> = [];

  for (const resource of pool) {
    // Subject filter
    if (subject && subject !== 'all' && resource.subjectSlug !== subject) {
      continue;
    }

    // Format filter
    if (format && format !== 'all' && resource.format !== format) {
      continue;
    }

    // Source filter
    if (source && source !== 'all' && resource.sourceId !== source) {
      continue;
    }

    // Difficulty Level filter
    if (level && level !== 'all') {
      if (resource.level && resource.level !== level && resource.level !== 'All Levels') {
        continue;
      }
    }

    // Language filter
    if (language && language !== 'all') {
      if (
        resource.language.toLowerCase() !== language.toLowerCase() &&
        resource.language !== 'Multilingual'
      ) {
        continue;
      }
    }

    // Access / Free verified filter
    if (access === 'free-verified') {
      if (!resource.accessLabel) {
        continue;
      }
    }

    // Duration bucket filter
    if (duration && duration !== 'all') {
      if (resource.durationBucket !== duration) {
        continue;
      }
    }

    // Publication year filter
    if (year && year !== 'all') {
      const minYear = Number(year);
      if (!resource.publishedYear || resource.publishedYear < minYear) {
        continue;
      }
    }

    const score = scoreResourceRelevance(resource, q);
    if (q && q.trim() && score <= 0) {
      continue;
    }

    scored.push({ resource, score });
  }

  scored.sort((a, b) => {
    if (sort === 'newest') {
      const yearDiff = (b.resource.publishedYear || 0) - (a.resource.publishedYear || 0);
      if (yearDiff !== 0) return yearDiff;
      return b.score - a.score;
    }
    if (sort === 'title') {
      return a.resource.title.localeCompare(b.resource.title);
    }
    // Default: relevance
    if (b.score !== a.score) return b.score - a.score;
    return (b.resource.publishedYear || 0) - (a.resource.publishedYear || 0);
  });

  return scored.map((item) => item.resource);
}

export interface SearchSuggestion {
  label: string;
  category: 'Query' | 'Subject' | 'Source' | 'Resource';
  href: string;
}

export const POPULAR_SEARCH_EXAMPLES = [
  'Python for beginners',
  'Calculus notes PDF',
  'Computer networking tutorials',
  'HTML and CSS course',
  'Biology revision materials',
  'JavaScript documentation',
];

export function getAutocompleteSuggestions(input: string): SearchSuggestion[] {
  const q = input.trim().toLowerCase();
  if (!q) {
    return POPULAR_SEARCH_EXAMPLES.map((label) => ({
      label,
      category: 'Query',
      href: `/explore?q=${encodeURIComponent(label)}`,
    }));
  }

  const suggestions: SearchSuggestion[] = [];

  for (const subj of SUBJECTS) {
    if (
      subj.name.toLowerCase().includes(q) ||
      subj.popularTopics.some((t) => t.toLowerCase().includes(q))
    ) {
      suggestions.push({
        label: subj.name,
        category: 'Subject',
        href: `/explore?subject=${encodeURIComponent(subj.slug)}`,
      });
    }
  }

  for (const src of TRUSTED_SOURCES) {
    if (src.name.toLowerCase().includes(q)) {
      suggestions.push({
        label: `${src.name} resources`,
        category: 'Source',
        href: `/explore?source=${encodeURIComponent(src.id)}`,
      });
    }
  }

  for (const ex of POPULAR_SEARCH_EXAMPLES) {
    if (ex.toLowerCase().includes(q)) {
      suggestions.push({
        label: ex,
        category: 'Query',
        href: `/explore?q=${encodeURIComponent(ex)}`,
      });
    }
  }

  for (const res of CURATED_RESOURCES) {
    if (
      res.title.toLowerCase().includes(q) ||
      res.tags.some((t) => t.toLowerCase().includes(q)) ||
      (res.programmingLanguage && res.programmingLanguage.toLowerCase().includes(q))
    ) {
      suggestions.push({
        label: res.title,
        category: 'Resource',
        href: `/resources/${res.id}`,
      });
    }
  }

  return suggestions.slice(0, 7);
}

export function getRelatedSearchTerms(failedQuery?: string): string[] {
  if (!failedQuery || !failedQuery.trim()) {
    return POPULAR_SEARCH_EXAMPLES;
  }
  const lower = failedQuery.toLowerCase();
  if (/code|dev|program|react|node|app|script/.test(lower)) {
    return ['Python for beginners', 'JavaScript documentation', 'HTML and CSS course', 'Git & Linux'];
  }
  if (/math|calc|alg|stat|prob|num/.test(lower)) {
    return ['Calculus notes PDF', 'Linear Algebra', 'Statistics', 'Khan Academy Calculus'];
  }
  if (/bio|chem|phys|med|sci|cell|lab/.test(lower)) {
    return ['Biology revision materials', 'Chemistry 2e', 'Physics simulations', 'Anatomy'];
  }
  return POPULAR_SEARCH_EXAMPLES;
}

export interface RecommendedItem {
  resource: LearningResource;
  reason: string;
}

/**
 * Transparent rule-based recommendation engine (Section 12).
 * Never claims AI magic — explains clearly why each item is shown.
 */
export function getRecommendedResources(options: {
  selectedInterests: string[];
  recentViewedIds: string[];
  currentQuery?: string;
  personalizationEnabled: boolean;
  subjectFilter?: string;
  formatFilter?: string;
  sortBy?: 'relevance' | 'newest' | 'title';
  limit?: number;
}): RecommendedItem[] {
  const {
    selectedInterests,
    recentViewedIds,
    currentQuery,
    personalizationEnabled,
    subjectFilter,
    formatFilter,
    sortBy = 'relevance',
    limit = 9,
  } = options;

  const recentSubjects = new Set<string>();
  if (personalizationEnabled) {
    for (const id of recentViewedIds) {
      const found = CURATED_RESOURCES.find((r) => r.id === id);
      if (found) recentSubjects.add(found.subjectSlug);
    }
  }

  const scored: Array<{ resource: LearningResource; score: number; reason: string }> = [];

  for (const res of CURATED_RESOURCES) {
    if (subjectFilter && subjectFilter !== 'all' && res.subjectSlug !== subjectFilter) {
      continue;
    }
    if (formatFilter && formatFilter !== 'all' && res.format !== formatFilter) {
      continue;
    }

    let score = res.featured ? 15 : 8;
    let reason = 'Verified starter resource';

    if (personalizationEnabled && recentSubjects.has(res.subjectSlug) && !recentViewedIds.includes(res.id)) {
      score += 22;
      reason = `Related to ${res.subjectName} resources you viewed`;
    }

    if (personalizationEnabled && selectedInterests.includes(res.subjectSlug)) {
      score += 35;
      reason = `Matches your chosen interest: ${res.subjectName}`;
    }

    if (currentQuery && currentQuery.trim()) {
      const qScore = scoreResourceRelevance(res, currentQuery);
      if (qScore > 0) {
        score += qScore;
        reason = `Matches search "${currentQuery.trim()}"`;
      }
    }

    scored.push({ resource: res, score, reason });
  }

  scored.sort((a, b) => {
    if (sortBy === 'newest') {
      return (b.resource.publishedYear || 0) - (a.resource.publishedYear || 0);
    }
    if (sortBy === 'title') {
      return a.resource.title.localeCompare(b.resource.title);
    }
    return b.score - a.score;
  });

  return scored.slice(0, limit).map(({ resource, reason }) => ({ resource, reason }));
}
