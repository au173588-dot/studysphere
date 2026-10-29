import React from 'react';
import type { Metadata } from 'next';
import { SubjectDirectoryClient } from '@/components/subjects/SubjectDirectoryClient';

export const metadata: Metadata = {
  title: 'Subjects Directory',
  description:
    'Browse verified free educational resources by academic and professional subject—from Mathematics, Computer Science, and Physics to Health Sciences and Economics.',
  alternates: {
    canonical: '/subjects',
  },
};

export default function SubjectsPage() {
  return <SubjectDirectoryClient />;
}
