'use client';

import React, { useState } from 'react';
import { CheckCircle2, Mail, AlertCircle } from 'lucide-react';
import { SUBJECTS } from '@/data/subjects';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [focusSubject, setFocusSubject] = useState('all');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, focusSubject }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setFeedback(data.error || 'Please check your email address and try again.');
      } else {
        setStatus('success');
        setFeedback(data.message);
        setEmail('');
      }
    } catch {
      setStatus('error');
      setFeedback('Network error while saving subscription. Please try again.');
    }
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-brand-soft via-white to-brand-soft p-6 shadow-card sm:p-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-royal">
              <Mail className="h-3.5 w-3.5" />
              Optional Study Digest
            </span>
            <h2
              id="newsletter-heading"
              className="mt-1.5 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl"
            >
              Get Newly Verified Open Textbooks & Tutorials
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Receive occasional roundups when new open-access university courses, revision notes,
              and programming guides are added. Zero spam, no third-party list sharing.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-royal focus:outline-none focus:ring-2 focus:ring-brand-royal/20"
                  />
                </div>

                <div>
                  <label htmlFor="newsletter-subject" className="sr-only">
                    Primary subject interest
                  </label>
                  <select
                    id="newsletter-subject"
                    value={focusSubject}
                    onChange={(e) => setFocusSubject(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-brand-royal focus:outline-none sm:w-44"
                  >
                    <option value="all">All Subjects</option>
                    {SUBJECTS.slice(0, 11).map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="h-11 shrink-0 rounded-xl bg-brand-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-royal disabled:opacity-60"
                >
                  {status === 'loading' ? 'Saving…' : 'Subscribe'}
                </button>
              </div>

              {status === 'success' && (
                <p
                  role="status"
                  className="flex items-center gap-2 text-xs font-medium text-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{feedback}</span>
                </p>
              )}

              {status === 'error' && (
                <p role="alert" className="flex items-center gap-2 text-xs font-medium text-rose-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{feedback}</span>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
