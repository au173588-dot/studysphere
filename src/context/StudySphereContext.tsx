'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { BookmarkItem, LearningResource, UserProfile } from '@/types';

const LS_BOOKMARKS = 'studysphere_bookmarks_v1';
const LS_COLLECTIONS = 'studysphere_collections_v1';
const LS_INTERESTS = 'studysphere_interests_v1';
const LS_RECENT_SEARCHES = 'studysphere_recent_searches_v1';
const LS_RECENT_VIEWS = 'studysphere_recent_views_v1';
const LS_PERSONALIZATION = 'studysphere_personalization_v1';
const LS_COMPLETED_STEPS = 'studysphere_path_steps_v1';

const DEFAULT_COLLECTIONS = ['General', 'Exam Revision', 'Programming', 'Read Later'];

interface StudySphereContextValue {
  user: UserProfile | null;
  authLoading: boolean;
  bookmarks: BookmarkItem[];
  collections: string[];
  interests: string[];
  recentSearches: string[];
  recentViewedIds: string[];
  currentSearchDraft: string;
  personalizationEnabled: boolean;
  completedSteps: Record<string, number[]>;
  isBookmarked: (resourceId: string) => boolean;
  toggleBookmark: (resource: LearningResource, collection?: string) => boolean;
  removeBookmark: (resourceId: string) => void;
  updateBookmarkMeta: (
    resourceId: string,
    updates: { collection?: string; personalNote?: string }
  ) => void;
  addCollection: (name: string) => void;
  toggleInterest: (subjectSlug: string) => void;
  setInterests: (slugs: string[]) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setCurrentSearchDraft: (query: string) => void;
  recordResourceView: (resourceId: string) => void;
  clearRecentViews: () => void;
  setPersonalizationEnabled: (enabled: boolean) => void;
  toggleStepCompleted: (pathSlug: string, stepNumber: number) => void;
  applyAuthPayload: (payload: {
    user: UserProfile;
    bookmarks?: BookmarkItem[];
    completedSteps?: Record<string, number[]>;
  }) => void;
  logout: () => Promise<void>;
  clearAllLocalData: () => void;
}

const StudySphereContext = createContext<StudySphereContextValue | undefined>(undefined);

export function StudySphereProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [collections, setCollections] = useState<string[]>(DEFAULT_COLLECTIONS);
  const [interests, setInterestsState] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentViewedIds, setRecentViewedIds] = useState<string[]>([]);
  const [currentSearchDraft, setCurrentSearchDraft] = useState<string>('');
  const [personalizationEnabled, setPersonalizationState] = useState<boolean>(true);
  const [completedSteps, setCompletedSteps] = useState<Record<string, number[]>>({});
  const hydratedRef = useRef(false);

  // Hydrate guest data from localStorage + check authenticated session
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem(LS_BOOKMARKS);
      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

      const savedCols = localStorage.getItem(LS_COLLECTIONS);
      if (savedCols) {
        const parsed = JSON.parse(savedCols);
        if (Array.isArray(parsed) && parsed.length > 0) setCollections(parsed);
      }

      const savedInterests = localStorage.getItem(LS_INTERESTS);
      if (savedInterests) setInterestsState(JSON.parse(savedInterests));

      const savedSearches = localStorage.getItem(LS_RECENT_SEARCHES);
      if (savedSearches) setRecentSearches(JSON.parse(savedSearches));

      const savedViews = localStorage.getItem(LS_RECENT_VIEWS);
      if (savedViews) setRecentViewedIds(JSON.parse(savedViews));

      const savedPers = localStorage.getItem(LS_PERSONALIZATION);
      if (savedPers !== null) setPersonalizationState(savedPers === 'true');

      const savedSteps = localStorage.getItem(LS_COMPLETED_STEPS);
      if (savedSteps) setCompletedSteps(JSON.parse(savedSteps));
    } catch {
      // Ignore storage access errors in strict private modes
    }
    hydratedRef.current = true;

    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          if (Array.isArray(data.bookmarks)) {
            setBookmarks((prev) => {
              // Merge guest + server bookmarks by resourceId
              const map = new Map<string, BookmarkItem>();
              for (const b of prev) map.set(b.resourceId, b);
              for (const b of data.bookmarks) map.set(b.resourceId, b);
              return Array.from(map.values());
            });
          }
          if (Array.isArray(data.user.interests) && data.user.interests.length > 0) {
            setInterestsState(data.user.interests);
          }
          if (typeof data.user.personalizationEnabled === 'boolean') {
            setPersonalizationState(data.user.personalizationEnabled);
          }
          if (data.completedSteps && typeof data.completedSteps === 'object') {
            setCompletedSteps((prev) => ({ ...prev, ...data.completedSteps }));
          }
        }
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  // Persist to localStorage whenever state updates
  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      localStorage.setItem(LS_BOOKMARKS, JSON.stringify(bookmarks));
    } catch {}
  }, [bookmarks]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      localStorage.setItem(LS_COLLECTIONS, JSON.stringify(collections));
    } catch {}
  }, [collections]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      localStorage.setItem(LS_INTERESTS, JSON.stringify(interests));
    } catch {}
  }, [interests]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      localStorage.setItem(LS_RECENT_SEARCHES, JSON.stringify(recentSearches));
    } catch {}
  }, [recentSearches]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      localStorage.setItem(LS_RECENT_VIEWS, JSON.stringify(recentViewedIds));
    } catch {}
  }, [recentViewedIds]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      localStorage.setItem(LS_PERSONALIZATION, String(personalizationEnabled));
    } catch {}
  }, [personalizationEnabled]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      localStorage.setItem(LS_COMPLETED_STEPS, JSON.stringify(completedSteps));
    } catch {}
  }, [completedSteps]);

  // Debounced sync to server when signed in
  useEffect(() => {
    if (!user || !hydratedRef.current) return;
    const timer = setTimeout(() => {
      fetch('/api/user/sync', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookmarks,
          interests,
          personalizationEnabled,
          completedSteps,
        }),
      }).catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, [user, bookmarks, interests, personalizationEnabled, completedSteps]);

  const isBookmarked = useCallback(
    (resourceId: string) => bookmarks.some((b) => b.resourceId === resourceId),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (resource: LearningResource, collection = 'General'): boolean => {
      const exists = bookmarks.some((b) => b.resourceId === resource.id);
      if (exists) {
        setBookmarks((prev) => prev.filter((b) => b.resourceId !== resource.id));
        return false;
      }
      const newItem: BookmarkItem = {
        resourceId: resource.id,
        savedAt: new Date().toISOString(),
        collection,
        snapshot: resource,
      };
      setBookmarks((prev) => [newItem, ...prev]);
      return true;
    },
    [bookmarks]
  );

  const removeBookmark = useCallback((resourceId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.resourceId !== resourceId));
  }, []);

  const updateBookmarkMeta = useCallback(
    (resourceId: string, updates: { collection?: string; personalNote?: string }) => {
      setBookmarks((prev) =>
        prev.map((item) =>
          item.resourceId === resourceId ? { ...item, ...updates } : item
        )
      );
    },
    []
  );

  const addCollection = useCallback((name: string) => {
    const clean = name.trim().slice(0, 40);
    if (!clean) return;
    setCollections((prev) => (prev.includes(clean) ? prev : [...prev, clean]));
  }, []);

  const toggleInterest = useCallback((subjectSlug: string) => {
    setInterestsState((prev) =>
      prev.includes(subjectSlug)
        ? prev.filter((s) => s !== subjectSlug)
        : [...prev, subjectSlug]
    );
  }, []);

  const setInterests = useCallback((slugs: string[]) => {
    setInterestsState(slugs);
  }, []);

  const addRecentSearch = useCallback(
    (query: string) => {
      if (!personalizationEnabled) return;
      const clean = query.trim();
      if (clean.length < 2) return;
      setRecentSearches((prev) => {
        const filtered = prev.filter((q) => q.toLowerCase() !== clean.toLowerCase());
        return [clean, ...filtered].slice(0, 6);
      });
    },
    [personalizationEnabled]
  );

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const recordResourceView = useCallback(
    (resourceId: string) => {
      if (!personalizationEnabled) return;
      setRecentViewedIds((prev) => {
        const filtered = prev.filter((id) => id !== resourceId);
        return [resourceId, ...filtered].slice(0, 12);
      });
    },
    [personalizationEnabled]
  );

  const clearRecentViews = useCallback(() => {
    setRecentViewedIds([]);
  }, []);

  const setPersonalizationEnabled = useCallback((enabled: boolean) => {
    setPersonalizationState(enabled);
    if (!enabled) {
      setRecentViewedIds([]);
      setRecentSearches([]);
    }
  }, []);

  const toggleStepCompleted = useCallback((pathSlug: string, stepNumber: number) => {
    setCompletedSteps((prev) => {
      const current = prev[pathSlug] || [];
      const next = current.includes(stepNumber)
        ? current.filter((n) => n !== stepNumber)
        : [...current, stepNumber];
      return { ...prev, [pathSlug]: next };
    });
  }, []);

  const applyAuthPayload = useCallback(
    (payload: {
      user: UserProfile;
      bookmarks?: BookmarkItem[];
      completedSteps?: Record<string, number[]>;
    }) => {
      setUser(payload.user);
      if (Array.isArray(payload.bookmarks)) {
        setBookmarks((prev) => {
          const map = new Map<string, BookmarkItem>();
          for (const b of prev) map.set(b.resourceId, b);
          for (const b of payload.bookmarks!) map.set(b.resourceId, b);
          return Array.from(map.values());
        });
      }
      if (Array.isArray(payload.user.interests) && payload.user.interests.length > 0) {
        setInterestsState(payload.user.interests);
      }
      if (payload.completedSteps) {
        setCompletedSteps((prev) => ({ ...prev, ...payload.completedSteps }));
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  const clearAllLocalData = useCallback(() => {
    setBookmarks([]);
    setInterestsState([]);
    setRecentSearches([]);
    setRecentViewedIds([]);
    setCompletedSteps({});
    try {
      localStorage.removeItem(LS_BOOKMARKS);
      localStorage.removeItem(LS_INTERESTS);
      localStorage.removeItem(LS_RECENT_SEARCHES);
      localStorage.removeItem(LS_RECENT_VIEWS);
      localStorage.removeItem(LS_COMPLETED_STEPS);
    } catch {}
  }, []);

  return (
    <StudySphereContext.Provider
      value={{
        user,
        authLoading,
        bookmarks,
        collections,
        interests,
        recentSearches,
        recentViewedIds,
        currentSearchDraft,
        personalizationEnabled,
        completedSteps,
        isBookmarked,
        toggleBookmark,
        removeBookmark,
        updateBookmarkMeta,
        addCollection,
        toggleInterest,
        setInterests,
        addRecentSearch,
        clearRecentSearches,
        setCurrentSearchDraft,
        recordResourceView,
        clearRecentViews,
        setPersonalizationEnabled,
        toggleStepCompleted,
        applyAuthPayload,
        logout,
        clearAllLocalData,
      }}
    >
      {children}
    </StudySphereContext.Provider>
  );
}

export function useStudySphere() {
  const ctx = useContext(StudySphereContext);
  if (!ctx) {
    throw new Error('useStudySphere must be used within StudySphereProvider');
  }
  return ctx;
}
