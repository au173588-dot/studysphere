import React from 'react';
import {
  Atom,
  BarChart3,
  BookOpenCheck,
  Code2,
  Cog,
  Dna,
  FlaskConical,
  Globe2,
  GraduationCap,
  HeartPulse,
  Languages,
  LayoutGrid,
  Network,
  Sigma,
  Sprout,
  TrendingUp,
} from 'lucide-react';

interface SubjectIconProps {
  iconName: string;
  className?: string;
}

export function SubjectIcon({ iconName, className = 'h-5 w-5' }: SubjectIconProps) {
  switch (iconName) {
    case 'Sigma':
      return <Sigma className={className} />;
    case 'Code2':
      return <Code2 className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'Cog':
      return <Cog className={className} />;
    case 'Languages':
      return <Languages className={className} />;
    case 'Globe2':
      return <Globe2 className={className} />;
    case 'Atom':
      return <Atom className={className} />;
    case 'FlaskConical':
      return <FlaskConical className={className} />;
    case 'Dna':
      return <Dna className={className} />;
    case 'Network':
      return <Network className={className} />;
    case 'BarChart3':
      return <BarChart3 className={className} />;
    case 'BookOpenCheck':
      return <BookOpenCheck className={className} />;
    case 'Sprout':
      return <Sprout className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    default:
      return <LayoutGrid className={className} />;
  }
}

export function getSubjectAccentStyles(accentColor: string): {
  bg: string;
  text: string;
  ring: string;
  banner: string;
} {
  const map: Record<string, { bg: string; text: string; ring: string; banner: string }> = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      ring: 'ring-blue-200/70',
      banner: 'from-[#0F265C] via-[#1D4ED8] to-[#1E40AF]',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      ring: 'ring-indigo-200/70',
      banner: 'from-[#1E1B4B] via-[#312E81] to-[#1D4ED8]',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      ring: 'ring-emerald-200/70',
      banner: 'from-[#064E3B] via-[#047857] to-[#0F766E]',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      ring: 'ring-rose-200/70',
      banner: 'from-[#4C0519] via-[#9F1239] to-[#BE123C]',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      ring: 'ring-amber-200/70',
      banner: 'from-[#451A03] via-[#92400E] to-[#B45309]',
    },
    violet: {
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      ring: 'ring-violet-200/70',
      banner: 'from-[#2E1065] via-[#5B21B6] to-[#4338CA]',
    },
    cyan: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      ring: 'ring-cyan-200/70',
      banner: 'from-[#083344] via-[#0E7490] to-[#0369A1]',
    },
    sky: {
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      ring: 'ring-sky-200/70',
      banner: 'from-[#0C4A6E] via-[#0284C7] to-[#1D4ED8]',
    },
    teal: {
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      ring: 'ring-teal-200/70',
      banner: 'from-[#134E4A] via-[#0F766E] to-[#0E7490]',
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      ring: 'ring-green-200/70',
      banner: 'from-[#14532D] via-[#15803D] to-[#047857]',
    },
    slate: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      ring: 'ring-slate-300/70',
      banner: 'from-[#0F172A] via-[#1E293B] to-[#1E3A8A]',
    },
  };
  return map[accentColor] || map.blue;
}
