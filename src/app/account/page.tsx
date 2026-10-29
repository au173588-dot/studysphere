import React from 'react';
import type { Metadata } from 'next';
import { AccountClient } from '@/components/account/AccountClient';

export const metadata: Metadata = {
  title: 'Account, Preferences & Privacy',
  description:
    'Optional StudySphere user account, study interest customization, bookmark synchronization, and privacy controls.',
  alternates: {
    canonical: '/account',
  },
};

export default function AccountPage() {
  return <AccountClient />;
}
