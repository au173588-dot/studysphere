import { LearningResource } from '@/types';

export interface AdapterStatus {
  id: string;
  name: string;
  configured: boolean;
  mode: 'live-api' | 'requires-api-key' | 'curated-only';
  setupMessage?: string;
}

export interface AdapterSearchResult {
  adapterId: string;
  adapterName: string;
  configured: boolean;
  resources: LearningResource[];
  error?: string;
  setupMessage?: string;
}

export interface SourceAdapter {
  id: string;
  name: string;
  getStatus(): AdapterStatus;
  search(query: string, limit?: number): Promise<AdapterSearchResult>;
  getById?(id: string): Promise<LearningResource | null>;
}
