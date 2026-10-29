import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLearningPathBySlug } from '@/data/learningPaths';
import { LearningPathDetailClient } from '@/components/tutorials/LearningPathDetailClient';

interface PageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const path = getLearningPathBySlug(params.slug);
  if (!path) {
    return { title: 'Learning Path Not Found' };
  }
  return {
    title: `${path.title} — Learning Path`,
    description: path.subtitle,
  };
}

export default function LearningPathDetailPage({ params }: PageProps) {
  const path = getLearningPathBySlug(params.slug);
  if (!path) {
    notFound();
  }
  return <LearningPathDetailClient path={path} />;
}
