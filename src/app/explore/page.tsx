import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ExploreClient } from '@/components/explore/ExploreClient';

export const metadata: Metadata = {
  title: 'Explore Learning Resources & Advanced Search',
  description:
    'Search and filter verified educational courses, open textbooks, PDFs, tutorials, documentation, and live open repositories.',
  alternates: {
    canonical: '/explore',
  },
};

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-slate-500">
          Loading resource explorer…
        </div>
      }
    >
      <ExploreClient />
    </Suspense>
  );
}
