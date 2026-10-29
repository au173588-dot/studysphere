import React from 'react';
import { siteConfig } from '@/config/site';

interface BrandLogoProps {
  variant?: 'default' | 'inverted';
  showTagline?: boolean;
}

export function BrandLogo({ variant = 'default', showTagline = false }: BrandLogoProps) {
  const isInverted = variant === 'inverted';

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm ${
          isInverted
            ? 'bg-white/15 ring-1 ring-white/25'
            : 'bg-brand-navy text-white ring-1 ring-brand-navy/10'
        }`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Globe meridian + open book + mortarboard spark */}
          <circle
            cx="16"
            cy="16"
            r="11.5"
            stroke={isInverted ? '#38BDF8' : '#60A5FA'}
            strokeWidth="2"
          />
          <ellipse
            cx="16"
            cy="16"
            rx="5.5"
            ry="11.5"
            stroke={isInverted ? '#BAE6FD' : '#93C5FD'}
            strokeWidth="1.6"
          />
          <path
            d="M5.5 16H26.5"
            stroke={isInverted ? '#BAE6FD' : '#93C5FD'}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M16 7.5L23.5 11.2L16 14.9L8.5 11.2L16 7.5Z"
            fill="#F59E0B"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`text-lg font-bold tracking-tight ${
            isInverted ? 'text-white' : 'text-brand-navy'
          }`}
        >
          {siteConfig.brandName}
        </span>
        {showTagline && (
          <span
            className={`mt-0.5 text-[11px] font-medium ${
              isInverted ? 'text-sky-200/90' : 'text-slate-500'
            }`}
          >
            {siteConfig.tagline}
          </span>
        )}
      </span>
    </span>
  );
}
