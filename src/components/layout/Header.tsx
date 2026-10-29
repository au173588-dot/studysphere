'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bookmark,
  Compass,
  GraduationCap,
  Home,
  LayoutGrid,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  X,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useStudySphere } from '@/context/StudySphereContext';
import { getAutocompleteSuggestions, SearchSuggestion } from '@/lib/search';
import { BrandLogo } from '@/components/ui/BrandLogo';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, bookmarks, logout, addRecentSearch } = useStudySphere();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setQuickSearchOpen(false);
    setAccountMenuOpen(false);
  }, [pathname]);

  // Global keyboard shortcut: Cmd/Ctrl + K or "/" outside inputs
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuickSearchOpen((prev) => !prev);
      } else if (
        e.key === '/' &&
        document.activeElement &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)
      ) {
        e.preventDefault();
        setQuickSearchOpen(true);
      } else if (e.key === 'Escape') {
        setQuickSearchOpen(false);
        setMobileMenuOpen(false);
        setAccountMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (quickSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 40);
    }
  }, [quickSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const suggestions: SearchSuggestion[] = getAutocompleteSuggestions(quickQuery);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickQuery.trim();
    if (trimmed) {
      addRecentSearch(trimmed);
      setQuickSearchOpen(false);
      router.push(`/explore?q=${encodeURIComponent(trimmed)}`);
    } else {
      setQuickSearchOpen(false);
      router.push('/explore');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link
            href="/"
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal"
            aria-label={`${siteConfig.brandName} Home`}
          >
            <BrandLogo />
          </Link>

          {/* Desktop Horizontal Navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex lg:items-center lg:gap-0.5 xl:gap-1"
          >
            {siteConfig.navigation.map((item) => {
              const active = isActive(item.href);
              const isSaved = item.href === '/saved';
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative inline-flex whitespace-nowrap items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors xl:px-3 xl:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal ${
                    active
                      ? 'bg-brand-soft text-brand-royal font-semibold'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-brand-navy'
                  }`}
                >
                  <span>{item.label}</span>
                  {isSaved && bookmarks.length > 0 && (
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-royal px-1.5 text-[11px] font-bold text-white">
                      {bookmarks.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Utilities: Search Shortcut + Account + Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuickSearchOpen(true)}
              aria-label="Open quick resource search"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-brand-soft/60 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-brand-royal/40 hover:bg-brand-soft hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal"
            >
              <Search className="h-3.5 w-3.5 text-brand-royal" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded border border-slate-300/80 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 md:inline">
                ⌘K
              </kbd>
            </button>

            {/* User Account Menu */}
            <div className="relative" ref={accountMenuRef}>
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setAccountMenuOpen((o) => !o)}
                    aria-expanded={accountMenuOpen}
                    aria-haspopup="menu"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1.5 pr-3 text-xs font-semibold text-brand-navy shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-royal text-[11px] font-bold text-white">
                      {user.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="hidden max-w-[96px] truncate sm:inline">{user.name}</span>
                  </button>

                  {accountMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl"
                    >
                      <div className="border-b border-slate-100 px-3 py-2">
                        <p className="truncate text-xs font-bold text-brand-navy">{user.name}</p>
                        <p className="truncate text-[11px] text-slate-500">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        role="menuitem"
                        className="mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-brand-soft hover:text-brand-royal"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Preferences & Account</span>
                      </Link>
                      <Link
                        href="/saved"
                        role="menuitem"
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-brand-soft hover:text-brand-royal"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Bookmark className="h-4 w-4" />
                          <span>Saved Resources</span>
                        </span>
                        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand-royal">
                          {bookmarks.length}
                        </span>
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          logout();
                        }}
                        className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/account"
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-royal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-royal"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Expandable Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            className="border-t border-slate-200 bg-white px-4 pb-5 pt-3 shadow-lg lg:hidden"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {siteConfig.navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium ${
                      active
                        ? 'bg-brand-soft font-semibold text-brand-royal'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.href === '/saved' && bookmarks.length > 0 && (
                      <span className="rounded-full bg-brand-royal px-2 py-0.5 text-xs font-bold text-white">
                        {bookmarks.length}
                      </span>
                    )}
                  </Link>
                );
              })}
              <Link
                href="/account"
                className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-brand-navy"
              >
                <User className="h-4 w-4 text-brand-royal" />
                <span>{user ? `Account (${user.name})` : 'Sign In / Study Preferences'}</span>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Quick Search Modal (Cmd+K / Shortcut) */}
      {quickSearchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quick search learning resources"
          className="fixed inset-0 z-50 flex items-start justify-center bg-brand-navy/50 p-4 pt-16 backdrop-blur-xs sm:pt-24"
          onClick={() => setQuickSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleQuickSubmit} className="flex items-center border-b border-slate-200 px-4">
              <Search className="h-5 w-5 shrink-0 text-brand-royal" />
              <input
                ref={searchInputRef}
                type="search"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Search study materials, topics or sources..."
                className="h-14 w-full bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {quickQuery && (
                <button
                  type="button"
                  onClick={() => setQuickQuery('')}
                  className="mr-1 rounded-md p-1 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search query"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setQuickSearchOpen(false)}
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
              >
                Esc
              </button>
            </form>

            <div className="max-h-80 overflow-y-auto p-3">
              <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {quickQuery.trim() ? 'Matching Suggestions' : 'Popular Study Searches'}
              </p>
              <ul className="space-y-1">
                {suggestions.map((item) => (
                  <li key={`${item.category}-${item.label}`}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (item.category === 'Query') addRecentSearch(item.label);
                        setQuickSearchOpen(false);
                      }}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-brand-soft hover:text-brand-royal"
                    >
                      <span className="truncate font-medium">{item.label}</span>
                      <span className="ml-3 shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                        {item.category}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
              <span>Press Enter to search full resource catalog</span>
              <Link
                href="/explore"
                onClick={() => setQuickSearchOpen(false)}
                className="font-semibold text-brand-royal hover:underline"
              >
                Advanced Filters →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar for Ergonomic Phone Access */}
      <nav
        aria-label="Mobile quick navigation"
        className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-slate-200 bg-white/95 py-1.5 backdrop-blur-md md:hidden"
      >
        {[
          { label: 'Home', href: '/', Icon: Home },
          { label: 'Explore', href: '/explore', Icon: Compass },
          { label: 'Subjects', href: '/subjects', Icon: LayoutGrid },
          { label: 'Tutorials', href: '/tutorials', Icon: GraduationCap },
          { label: 'Saved', href: '/saved', Icon: Bookmark },
        ].map(({ label, href, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`relative flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[11px] font-medium ${
                active ? 'text-brand-royal font-semibold' : 'text-slate-500 hover:text-brand-navy'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              {href === '/saved' && bookmarks.length > 0 && (
                <span className="absolute right-1.5 top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-royal px-1 text-[9px] font-bold text-white">
                  {bookmarks.length}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
