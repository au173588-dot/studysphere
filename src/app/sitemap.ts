import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { CURATED_RESOURCES } from '@/data/resources';
import { LEARNING_PATHS } from '@/data/learningPaths';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, '');
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/explore',
    '/subjects',
    '/tutorials',
    '/saved',
    '/about',
    '/contact',
    '/account',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === '' || route === '/explore' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  const pathRoutes: MetadataRoute.Sitemap = LEARNING_PATHS.map((lp) => ({
    url: `${base}/tutorials/${lp.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const resourceRoutes: MetadataRoute.Sitemap = CURATED_RESOURCES.map((res) => ({
    url: `${base}/resources/${res.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...pathRoutes, ...resourceRoutes];
}
