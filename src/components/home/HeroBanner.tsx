'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileCode2,
  FileText,
  Pause,
  Play,
  PlayCircle,
} from 'lucide-react';
import { siteConfig } from '@/config/site';

interface HeroSlide {
  id: string;
  eyebrow: string;
  headline: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  imageSrc: string;
  imageAlt: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: 'discover',
    eyebrow: siteConfig.tagline.toUpperCase(),
    headline: siteConfig.mainHeadline,
    description: siteConfig.supportingText,
    primaryCta: { label: 'Browse Materials', href: '/explore' },
    secondaryCta: { label: 'Watch Tutorials', href: '/tutorials' },
    imageSrc: '/images/hero-main.png',
    imageAlt:
      'Educational illustration featuring an illuminated world globe, graduation cap, stacked textbooks, and an open laptop displaying study notes and code diagrams',
  },
  {
    id: 'paths',
    eyebrow: 'CURATED LEARNING ROADMAPS',
    headline: 'Follow structured steps from beginner to confident.',
    description:
      'Stop piecing together scattered links. Follow step-by-step study paths for Python, Web Development, Calculus, and Data Analysis with milestone tracking.',
    primaryCta: { label: 'Explore Learning Paths', href: '/tutorials' },
    secondaryCta: { label: 'Browse Subjects', href: '/subjects' },
    imageSrc: '/images/hero-paths.png',
    imageAlt:
      'Illustration of an ascending study pathway connecting notebooks, code milestones, and achievement beacons',
  },
  {
    id: 'open-sources',
    eyebrow: 'VERIFIED & OPEN ACCESS',
    headline: 'Trusted university notes, open textbooks & live APIs.',
    description:
      'Search peer-reviewed OpenStax PDFs, MIT OpenCourseWare lectures, MDN Web Docs, Khan Academy, Wikipedia, and Open Library without paywalls or clutter.',
    primaryCta: { label: 'Search Live Repositories', href: '/explore?live=1&q=Calculus' },
    secondaryCta: { label: 'View Trusted Sources', href: '/about#integrations' },
    imageSrc: '/images/hero-sources.png',
    imageAlt:
      'Illustration of a modern open digital library uniting peer-reviewed textbooks, video lectures, and global repositories',
  },
];

const SUPPORTED_SOURCE_TYPES = [
  { label: 'Educational Videos', Icon: PlayCircle },
  { label: 'Official Documentation', Icon: FileCode2 },
  { label: 'Public Study Notes & PDFs', Icon: FileText },
  { label: 'Open Educational Resources', Icon: BookOpen },
];

export function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Respect user reduced-motion preference automatically
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (media.matches) {
        setIsPaused(true);
        return;
      }
    }
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 7500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const currentSlide = SLIDES[activeIndex];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured educational highlights"
      className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1E47] via-[#0F265C] to-[#173A8A] text-white shadow-xl ring-1 ring-white/10">
        {/* Subtle crisp geometric background accent */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-12 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative grid grid-cols-1 items-center gap-8 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-12 lg:gap-10 lg:px-14 lg:py-14">
          {/* Left Content Column */}
          <div className="lg:col-span-7" aria-live="polite">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/25 bg-white/10 px-3.5 py-1 text-[11px] font-bold tracking-widest text-sky-200 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
              {currentSlide.eyebrow}
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
              {currentSlide.headline}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-sky-100/90 sm:text-lg">
              {currentSlide.description}
            </p>

            {/* Primary & Secondary Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <Link
                href={currentSlide.primaryCta.href}
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-navy shadow-md transition-all hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
              >
                {currentSlide.primaryCta.label}
              </Link>
              <Link
                href={currentSlide.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xs transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
              >
                <PlayCircle className="h-4 w-4 text-sky-300" />
                <span>{currentSlide.secondaryCta.label}</span>
              </Link>
            </div>

            {/* Concise Supported Source Types */}
            <div className="mt-8 border-t border-white/12 pt-5">
              <ul className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-5">
                {SUPPORTED_SOURCE_TYPES.map(({ label, Icon }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 text-xs font-medium text-sky-100/90"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-sky-300" aria-hidden="true" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Illustration Column */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-white/12 bg-[#0F265C] shadow-2xl lg:max-w-none">
              <img
                src={currentSlide.imageSrc}
                alt={currentSlide.imageAlt}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Accessible Carousel Controls Bar */}
        <div className="relative flex items-center justify-between border-t border-white/10 bg-black/15 px-6 py-3 sm:px-10 lg:px-14">
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose hero slide">
            {SLIDES.map((slide, idx) => {
              const selected = idx === activeIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={`Slide ${idx + 1}: ${slide.headline}`}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
                    selected ? 'w-7 bg-amber-400' : 'w-2 bg-white/35 hover:bg-white/60'
                  }`}
                />
              );
            })}
            <span className="ml-2 text-xs font-medium text-sky-200/80">
              {activeIndex + 1} / {SLIDES.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? 'Resume slide rotation' : 'Pause slide rotation'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-sky-100 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              {isPaused ? (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Play</span>
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
              }
              aria-label="Previous slide"
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % SLIDES.length)}
              aria-label="Next slide"
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
