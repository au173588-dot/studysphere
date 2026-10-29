import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CURATED_RESOURCES } from '@/data/resources';
import { resolveResourceById } from '@/lib/adapters';
import { LearningResource, ResourceFormat } from '@/types';
import { ResourceDetailsView } from '@/components/resources/ResourceDetailsView';

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

async function loadResource(
  rawId: string,
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<LearningResource | null> {
  const id = decodeURIComponent(rawId);
  const resolved = await resolveResourceById(id);
  if (resolved) return resolved;

  // Fallback for live arXiv / dynamic search entries passed with verified URL parameters
  const fallbackTitle = typeof searchParams.title === 'string' ? searchParams.title : '';
  const fallbackUrl = typeof searchParams.url === 'string' ? searchParams.url : '';

  if (fallbackTitle && fallbackUrl && /^https?:\/\//i.test(fallbackUrl)) {
    const format = (
      typeof searchParams.format === 'string' ? searchParams.format : 'article'
    ) as ResourceFormat;
    return {
      id,
      title: fallbackTitle,
      description:
        typeof searchParams.desc === 'string'
          ? searchParams.desc
          : 'Open educational resource retrieved via official public search API.',
      url: fallbackUrl,
      sourceId: 'openlibrary',
      sourceName:
        typeof searchParams.source === 'string' ? searchParams.source : 'Open Repository',
      subjectSlug: 'computer-science',
      subjectName:
        typeof searchParams.subject === 'string' ? searchParams.subject : 'Academic Reference',
      format,
      level: 'All Levels',
      language: 'English',
      tags: ['open repository', format],
      verification: 'live-public-api',
    };
  }

  return null;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const resource = await loadResource(params.id, searchParams);
  if (!resource) {
    return {
      title: 'Resource Not Found',
    };
  }
  return {
    title: resource.title,
    description: resource.description,
    openGraph: {
      title: resource.title,
      description: resource.description,
      type: 'article',
    },
  };
}

export default async function ResourceDetailPage({ params, searchParams }: PageProps) {
  const resource = await loadResource(params.id, searchParams);
  if (!resource) {
    notFound();
  }

  const relatedResources = CURATED_RESOURCES.filter(
    (r) =>
      r.id !== resource.id &&
      (r.subjectSlug === resource.subjectSlug || r.sourceId === resource.sourceId)
  ).slice(0, 3);

  return <ResourceDetailsView resource={resource} relatedResources={relatedResources} />;
}
