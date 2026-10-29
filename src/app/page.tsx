import React from 'react';
import { HomepageSearchSection } from '@/components/home/HomepageSearchSection';
import { HeroBanner } from '@/components/home/HeroBanner';
import { PopularSubjectsSection } from '@/components/home/PopularSubjectsSection';
import { RecommendedSection } from '@/components/home/RecommendedSection';
import { TrustedSourcesSection } from '@/components/home/TrustedSourcesSection';
import { LearningPathsSection } from '@/components/home/LearningPathsSection';
import { BenefitsSection } from '@/components/home/BenefitsSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';

/**
 * StudySphere Homepage
 * Ordered strictly per Section 22 specification:
 * 1. Navigation header (rendered in RootLayout)
 * 2. Prominent educational resource search
 * 3. Deep-blue hero banner
 * 4. Popular subjects
 * 5. Recommended resources
 * 6. Trusted source websites
 * 7. Curated learning paths
 * 8. Benefits and platform features
 * 9. Optional newsletter or study updates
 * 10. Footer (rendered in RootLayout)
 */
export default function HomePage() {
  return (
    <div className="pb-6">
      <HomepageSearchSection />
      <HeroBanner />
      <PopularSubjectsSection />
      <RecommendedSection />
      <TrustedSourcesSection />
      <LearningPathsSection />
      <BenefitsSection />
      <NewsletterSection />
    </div>
  );
}
