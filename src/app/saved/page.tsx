import React from 'react';
import type { Metadata } from 'next';
import { SavedResourcesClient } from '@/components/saved/SavedResourcesClient';

export const metadata: Metadata = {
  title: 'Saved Resources & Bookmarks',
  description:
    'Manage your bookmarked open textbooks, video lectures, tutorials, and custom study collections.',
  alternates: {
    canonical: '/saved',
  },
};

export default function SavedPage() {
  return <SavedResourcesClient />;
}
