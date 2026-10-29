export type ResourceFormat =
  | 'video'
  | 'article'
  | 'pdf'
  | 'course'
  | 'documentation'
  | 'interactive'
  | 'book';

export type DifficultyLevel =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'All Levels';

export type DurationBucket =
  | 'under-1h'
  | '1-5h'
  | '5-20h'
  | 'course-semester'
  | 'reference';

export type VerificationStatus =
  | 'verified-curated'
  | 'live-public-api'
  | 'sponsored-partner';

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  keyTopics?: string[];
  url: string;
  sourceId: string;
  sourceName: string;
  subjectSlug: string;
  subjectName: string;
  format: ResourceFormat;
  level?: DifficultyLevel;
  duration?: string;
  durationBucket?: DurationBucket;
  language: string;
  programmingLanguage?: string;
  /** Only populated when verified directly at the provider */
  accessLabel?: string;
  license?: string;
  publishedYear?: number;
  authorOrInstitution?: string;
  /** Optional real permitted cover/thumbnail URL; falls back to SVG subject illustration */
  thumbnailUrl?: string;
  tags: string[];
  verification: VerificationStatus;
  featured?: boolean;
  /** Only populated if backed by real verified source API metrics; never fabricated */
  verifiedRating?: {
    score: number;
    count: number;
    provider: string;
  };
  isAffiliate?: boolean;
  affiliateDisclosure?: string;
}

export interface SubjectCategory {
  slug: string;
  name: string;
  shortDescription: string;
  iconName: string;
  accentColor: string;
  popularTopics: string[];
  featuredOnHome: boolean;
  homeOrder?: number;
}

export interface TrustedSource {
  id: string;
  name: string;
  category: string;
  officialUrl: string;
  description: string;
  integrationType: 'live-api' | 'verified-curated' | 'optional-api-key';
  envKeyRequired?: string;
  supportedFormats: ResourceFormat[];
  licenseSummary: string;
}

export interface LearningPathStep {
  stepNumber: number;
  title: string;
  summary: string;
  estimatedTime: string;
  resourceId: string;
  practicePrompt: string;
}

export interface LearningPath {
  slug: string;
  title: string;
  subtitle: string;
  subjectSlug: string;
  subjectName: string;
  level: DifficultyLevel;
  estimatedTotalTime: string;
  audience: string;
  objectives: string[];
  steps: LearningPathStep[];
}

export interface BookmarkItem {
  resourceId: string;
  savedAt: string;
  collection: string;
  personalNote?: string;
  /** Cached snapshot for live API resources so bookmarks always render offline/later */
  snapshot?: LearningResource;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  interests: string[];
  personalizationEnabled: boolean;
}

export interface SearchFilters {
  q?: string;
  subject?: string;
  format?: ResourceFormat | 'all';
  source?: string;
  level?: DifficultyLevel | 'all';
  language?: string;
  access?: 'all' | 'free-verified';
  duration?: DurationBucket | 'all';
  year?: 'all' | '2024' | '2020';
  sort?: 'relevance' | 'newest' | 'title';
  includeLive?: boolean;
}
