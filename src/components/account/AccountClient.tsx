'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Bookmark,
  Check,
  CheckCircle2,
  KeyRound,
  LogOut,
  ShieldCheck,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { SUBJECTS } from '@/data/subjects';
import { useStudySphere } from '@/context/StudySphereContext';

export function AccountClient() {
  const {
    user,
    bookmarks,
    interests,
    toggleInterest,
    completedSteps,
    personalizationEnabled,
    setPersonalizationEnabled,
    clearRecentViews,
    clearRecentSearches,
    clearAllLocalData,
    applyAuthPayload,
    logout,
  } = useStudySphere();

  const [tab, setTab] = useState<'login' | 'register' | 'reset'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetTokenInput, setResetTokenInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [devResetToken, setDevResetToken] = useState('');
  const [verifyPreviewToken, setVerifyPreviewToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not sign in.');
      } else {
        applyAuthPayload(data);
        setPassword('');
        setSuccessMsg('Signed in! Your saved resources and preferences are now synced.');
      }
    } catch {
      setErrorMsg('Network error during sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          interests,
          bookmarks,
          completedSteps,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Registration failed.');
      } else {
        applyAuthPayload(data);
        if (data.verificationPreviewToken) {
          setVerifyPreviewToken(data.verificationPreviewToken);
        }
        setPassword('');
        setSuccessMsg(
          'Account created! Your browser bookmarks and progress were synced automatically.'
        );
      }
    } catch {
      setErrorMsg('Network error during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Reset request failed.');
      } else {
        setSuccessMsg(data.message);
        if (data.devResetToken) {
          setDevResetToken(data.devResetToken);
          setResetTokenInput(data.devResetToken);
        }
      }
    } catch {
      setErrorMsg('Network error requesting reset token.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'confirm',
          email,
          token: resetTokenInput,
          newPassword: newPasswordInput,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not reset password.');
      } else {
        setSuccessMsg(data.message);
        setDevResetToken('');
        setResetTokenInput('');
        setNewPasswordInput('');
        setTab('login');
      }
    } catch {
      setErrorMsg('Network error updating password.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailNow = async () => {
    if (!verifyPreviewToken) return;
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify-email', token: verifyPreviewToken }),
    });
    if (res.ok && user) {
      applyAuthPayload({ user: { ...user, emailVerified: true } });
      setVerifyPreviewToken('');
      setSuccessMsg('Email verified!');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Permanently delete your StudySphere account from the server?')) return;
    await fetch('/api/auth/me', { method: 'DELETE' });
    await logout();
    setSuccessMsg('Your server account has been permanently deleted.');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-royal">
          Optional Account & Privacy Controls
        </span>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
          Study Preferences, Sync & Privacy
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
          Registration is completely optional—every public learning resource works without signing
          up. Create an account only if you want server-backed synchronization across devices.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Auth Card or Signed-in Profile */}
        <div className="lg:col-span-5">
          {user ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="flex items-center gap-3.5">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-royal text-lg font-extrabold text-white">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-brand-navy">{user.name}</h2>
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                  <UserCheck className="h-3.5 w-3.5" />
                  Synced Account Active
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1 font-semibold text-brand-royal">
                  <Bookmark className="h-3.5 w-3.5" />
                  {bookmarks.length} Saved Items
                </span>
              </div>

              {!user.emailVerified && verifyPreviewToken && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
                  <p className="font-semibold">Local Email Verification</p>
                  <p className="mt-0.5">
                    Since no external SMTP key is configured yet, you can confirm your email
                    directly in one click:
                  </p>
                  <button
                    type="button"
                    onClick={handleVerifyEmailNow}
                    className="mt-2 rounded-lg bg-amber-700 px-3 py-1.5 font-bold text-white hover:bg-amber-800"
                  >
                    Confirm Email Address
                  </button>
                </div>
              )}

              {user.emailVerified && (
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Email address verified
                </p>
              )}

              <div className="mt-6 flex flex-col gap-2.5 border-t border-slate-100 pt-5">
                <Link
                  href="/saved"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-royal"
                >
                  <Bookmark className="h-4 w-4" />
                  <span>Open Synced Bookmarks ({bookmarks.length})</span>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="mt-2 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-rose-600 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Permanently Delete Account</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
              {/* Auth Tabs */}
              <div className="mb-5 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`rounded-lg py-2 transition-colors ${
                    tab === 'login' ? 'bg-white text-brand-navy shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`rounded-lg py-2 transition-colors ${
                    tab === 'register' ? 'bg-white text-brand-navy shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('reset');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`rounded-lg py-2 transition-colors ${
                    tab === 'reset' ? 'bg-white text-brand-navy shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Reset Password
                </button>
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div
                  role="status"
                  className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {tab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label
                      htmlFor="login-email"
                      className="mb-1 block text-xs font-bold text-slate-700"
                    >
                      Email Address
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.edu"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm focus:border-brand-royal focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="login-password"
                      className="mb-1 block text-xs font-bold text-slate-700"
                    >
                      Password
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm focus:border-brand-royal focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-xl bg-brand-navy text-sm font-bold text-white hover:bg-brand-royal disabled:opacity-60"
                  >
                    {loading ? 'Signing in…' : 'Sign In'}
                  </button>
                </form>
              )}

              {tab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label
                      htmlFor="reg-name"
                      className="mb-1 block text-xs font-bold text-slate-700"
                    >
                      Full Name or Study Handle
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      required
                      minLength={2}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ada Lovelace"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm focus:border-brand-royal focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="reg-email"
                      className="mb-1 block text-xs font-bold text-slate-700"
                    >
                      Email Address
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ada@example.edu"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm focus:border-brand-royal focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="reg-password"
                      className="mb-1 block text-xs font-bold text-slate-700"
                    >
                      Password (minimum 8 characters)
                    </label>
                    <input
                      id="reg-password"
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm focus:border-brand-royal focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Passwords are hashed server-side using Node cryptographic{' '}
                    <code className="font-mono">scrypt</code> + unique per-user salts and{' '}
                    <code className="font-mono">HttpOnly</code> session cookies.
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-xl bg-brand-royal text-sm font-bold text-white hover:bg-brand-navy disabled:opacity-60"
                  >
                    {loading ? 'Creating account…' : 'Create Free Account & Sync'}
                  </button>
                </form>
              )}

              {tab === 'reset' && (
                <div className="space-y-4">
                  <form onSubmit={handleRequestReset} className="space-y-3">
                    <div>
                      <label
                        htmlFor="reset-email"
                        className="mb-1 block text-xs font-bold text-slate-700"
                      >
                        Account Email
                      </label>
                      <input
                        id="reset-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.edu"
                        className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm focus:border-brand-royal focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-brand-navy text-xs font-bold text-white hover:bg-brand-royal"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      <span>Generate Password Reset Token</span>
                    </button>
                  </form>

                  {(devResetToken || resetTokenInput) && (
                    <form
                      onSubmit={handleConfirmReset}
                      className="space-y-3 border-t border-slate-100 pt-3"
                    >
                      <div>
                        <label
                          htmlFor="reset-token"
                          className="mb-1 block text-xs font-bold text-slate-700"
                        >
                          Single-Use Reset Token
                        </label>
                        <input
                          id="reset-token"
                          type="text"
                          required
                          value={resetTokenInput}
                          onChange={(e) => setResetTokenInput(e.target.value)}
                          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="reset-new-pw"
                          className="mb-1 block text-xs font-bold text-slate-700"
                        >
                          New Password (8+ chars)
                        </label>
                        <input
                          id="reset-new-pw"
                          type="password"
                          required
                          minLength={8}
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="h-10 w-full rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        Save New Password
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Study Interests & Privacy Controls */}
        <div className="space-y-6 lg:col-span-7">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-lg font-bold text-brand-navy">Learning Interests</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Choose subjects you are studying so the “Recommended for You” section highlights the
              most relevant verified materials.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {SUBJECTS.map((subj) => {
                const active = interests.includes(subj.slug);
                return (
                  <button
                    key={subj.slug}
                    type="button"
                    onClick={() => toggleInterest(subj.slug)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? 'bg-brand-royal text-white'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-royal/40'
                    }`}
                  >
                    {active && <Check className="h-3.5 w-3.5" />}
                    <span>{subj.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-royal" />
              <h2 className="text-lg font-bold text-brand-navy">
                Privacy & Personalization Controls
              </h2>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              StudySphere does not run third-party behavioral ad trackers. You have direct control
              over local history and recommendations:
            </p>

            <div className="mt-5 space-y-4">
              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-brand-soft/40 p-4">
                <div>
                  <span className="block text-sm font-bold text-brand-navy">
                    Enable Local Personalization & Recent Search Suggestions
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-600">
                    When disabled, StudySphere stops saving recently viewed resources and recent
                    search queries.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={personalizationEnabled}
                  onChange={(e) => setPersonalizationEnabled(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-brand-royal focus:ring-brand-royal"
                />
              </label>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    clearRecentSearches();
                    clearRecentViews();
                    setSuccessMsg('Cleared recent searches and viewed resource history.');
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear Recent Searches & Views
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        'Clear all local bookmarks, collections, and progress stored in this browser?'
                      )
                    ) {
                      clearAllLocalData();
                      setSuccessMsg('Cleared all local browser study data.');
                    }
                  }}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                >
                  Wipe All Browser Data
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
