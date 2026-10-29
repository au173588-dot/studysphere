/**
 * Central Brand, Contact, Navigation & Monetization Configuration
 * Update this single file to customize StudySphere's brand identity, colors,
 * contact addresses, social profiles, and optional ethical monetization features.
 */

export const siteConfig = {
  brandName: 'StudySphere',
  tagline: 'Your Goals. Our Resources.',
  mainHeadline: 'Study smarter, not harder.',
  supportingText:
    'Discover learning materials, tutorials, notes, and educational resources from trusted sources, all in one place.',
  description:
    'StudySphere helps secondary students, university learners, self-taught programmers, exam candidates, and lifelong learners discover verified open textbooks, tutorials, documentation, and courses in one unified hub.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://studysphere.example.org',

  colors: {
    navy: '#0B1E47',
    royalBlue: '#1D4ED8',
    softCard: '#EEF3FA',
    pageBackground: '#F8FAFC',
  },

  audiences: [
    'Secondary school students',
    'University students',
    'Self-taught programmers',
    'Exam candidates',
    'Researchers and lifelong learners',
    'People learning new professional skills',
  ],

  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Explore Resources', href: '/explore' },
    { label: 'Subjects', href: '/subjects' },
    { label: 'Tutorials', href: '/tutorials' },
    { label: 'Saved Resources', href: '/saved' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],

  contact: {
    // Marked clearly as a configurable placeholder until you set your live domain inbox
    supportEmail: 'support@studysphere.example.org',
    isPlaceholderEmail: true,
    responseWindowNote: 'Typically responds within 1–2 business days once SMTP/inbox routing is configured.',
    socialLinks: [
      {
        label: 'GitHub Repository (Configure URL)',
        href: 'https://github.com',
        configured: false,
      },
      {
        label: 'YouTube Study Channel (Configure URL)',
        href: 'https://www.youtube.com',
        configured: false,
      },
    ],
  },

  legal: {
    lastUpdated: 'October 2026',
    attributionNotice:
      'Third-party educational materials linked on StudySphere remain hosted by their original providers and are subject to their respective copyrights, open licenses, and terms of use.',
  },

  /**
   * Ethical Monetization Controls (Section 15)
   * - Never paywalls third-party free resources
   * - Never disguises sponsored listings as organic search results
   * - Never simulates fake ad impressions or earnings
   */
  monetization: {
    showReservedAdSlotPlaceholder: true,
    showOriginalStudyGuides: true,
    showPartnerSponsorshipSlot: true,
    showOptionalPlusPreview: true,
  },
} as const;

export type SiteConfig = typeof siteConfig;
