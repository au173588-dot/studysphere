'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';

interface ContactFormProps {
  defaultSubject?: string;
}

export function ContactForm({ defaultSubject = '' }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState('');
  const [websiteHoneypot, setWebsiteHoneypot] = useState('');

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusText, setStatusText] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setStatusText('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          website: websiteHoneypot,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setStatusText(data.error || 'Please review the fields and try again.');
      } else {
        setStatus('success');
        setReferenceId(data.referenceId || '');
        setStatusText(data.statusMessage || 'Your message was saved.');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch {
      setStatus('error');
      setStatusText('Could not reach the server. Please check your connection and try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8"
      noValidate
    >
      <h2 className="text-xl font-bold text-brand-navy">Send a Message or Resource Suggestion</h2>
      <p className="mt-1 text-xs text-slate-600">
        Suggest a verified open educational resource, report a broken link, or ask a question.
      </p>

      {/* Hidden Honeypot Anti-Spam Input */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website-hp">Leave this field empty</label>
        <input
          id="contact-website-hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={websiteHoneypot}
          onChange={(e) => setWebsiteHoneypot(e.target.value)}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-xs font-bold text-slate-700">
            Your Name <span className="text-rose-600">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Chidi Okonkwo"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-sm text-slate-900 focus:border-brand-royal focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-xs font-bold text-slate-700">
            Email Address <span className="text-rose-600">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.edu"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-sm text-slate-900 focus:border-brand-royal focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-bold text-slate-700">
          Subject <span className="text-rose-600">*</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          required
          minLength={3}
          maxLength={140}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g., Suggesting an open textbook / Broken link report"
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-sm text-slate-900 focus:border-brand-royal focus:bg-white focus:outline-none"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="contact-message" className="mb-1.5 block text-xs font-bold text-slate-700">
          Message <span className="text-rose-600">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          minLength={15}
          maxLength={4000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Include relevant details, official resource URLs, or feedback (minimum 15 characters)..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 text-sm text-slate-900 focus:border-brand-royal focus:bg-white focus:outline-none"
        />
      </div>

      {status === 'error' && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{statusText}</span>
        </div>
      )}

      {status === 'success' && (
        <div
          role="status"
          className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <div>
            {referenceId && (
              <p className="font-bold">Submission Recorded — Reference #{referenceId}</p>
            )}
            <p className="mt-0.5">{statusText}</p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-navy px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-royal disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          <span>{status === 'submitting' ? 'Submitting…' : 'Submit Message'}</span>
        </button>
      </div>
    </form>
  );
}
