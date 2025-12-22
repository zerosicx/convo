/**
 * Sync Hook
 *
 * React hook to manage synchronization between local stores and Convex.
 * Call this at the app root to initialize sync on load.
 * 
 * Features:
 * - Initial fetch from Convex on mount (merges with local data)
 * - Live sync: debounced sync on every store change
 * - Periodic sync as fallback (every 30 seconds)
 * - Sync on visibility change and coming back online
 * 
 * Note: User authentication is handled server-side via ctx.auth.getUserIdentity()
 */

import { useConvex, useConvexAuth } from "convex/react";
import { useCallback, useEffect, useRef } from "react";
import { useNotebookStore } from "../stores/notebook-store";
import { usePageStore } from "../stores/page-store";
import { useSectionStore } from "../stores/section-store";
import {
  debouncedSync,
  fetchNotebooksFromConvex,
  fetchPagesFromConvex,
  fetchSectionsFromConvex,
  isOnline,
  shouldSync,
  syncNotebooksToConvex,
  syncPagesToConvex,
  syncSectionsToConvex,
} from "./convex-sync";

export const useSync = () => {
  const convex = useConvex();
  // Use Convex auth hook (waits for JWT validation with backend)
  const { isAuthenticated, isLoading } = useConvexAuth();
  const hasFetched = useRef(false);

  // Get stores - we need updatePageById for merging pages
  const { pages, addPage, updatePageById } = usePageStore();
  const { notebooks, addNotebook } = useNotebookStore();
  const { sections, addSection } = useSectionStore();

  // Sync function - memoized to avoid recreating on every render
  const performSync = useCallback(() => {
    if (!isAuthenticated || !isOnline()) return;
    
    syncPagesToConvex(convex, usePageStore.getState().pages);
    syncNotebooksToConvex(convex, useNotebookStore.getState().notebooks);
    syncSectionsToConvex(convex, useSectionStore.getState().sections);
  }, [convex, isAuthenticated]);

  // Initial fetch from Convex on mount (only when authenticated)
  useEffect(() => {
    if (hasFetched.current) return;
    if (isLoading || !isAuthenticated) return;

    const fetchInitialData = async () => {
      if (!isOnline()) return;

      // Fetch notebooks (server determines user from auth context)
      const remoteNotebooks = await fetchNotebooksFromConvex(convex);
      if (remoteNotebooks && remoteNotebooks.length > 0) {
        for (const notebook of remoteNotebooks) {
          const localNotebook = notebooks[notebook._id];
          if (!localNotebook) {
            addNotebook(notebook);
          }
        }
      }

      // Fetch sections
      const remoteSections = await fetchSectionsFromConvex(convex);
      if (remoteSections && remoteSections.length > 0) {
        for (const section of remoteSections) {
          const localSection = sections[section._id];
          if (!localSection) {
            addSection(section);
          }
        }
      }

      // Fetch pages - with proper merge based on editedDate
      const remotePages = await fetchPagesFromConvex(convex);
      if (remotePages && remotePages.length > 0) {
        for (const page of remotePages) {
          const localPage = pages[page._id];
          if (!localPage) {
            addPage(page);
          } else {
            // Page exists locally - check if remote is newer
            const localEditTime = new Date(localPage.editedDate).getTime();
            const remoteEditTime = new Date(page.editedDate).getTime();
            if (remoteEditTime > localEditTime) {
              updatePageById(page._id, {
                title: page.title,
                data: page.data,
                path: page.path,
                level: page.level,
                parentPageId: page.parentPageId,
                archived: page.archived,
                editedDate: page.editedDate,
              });
            }
          }
        }
      }

      hasFetched.current = true;
    };

    fetchInitialData();
  }, [convex, isLoading, isAuthenticated]);

  // Subscribe to store changes and trigger debounced sync (LIVE SYNC)
  useEffect(() => {
    if (!isAuthenticated) return;

    // Subscribe to page store changes
    const unsubPages = usePageStore.subscribe(() => {
      if (isOnline()) {
        debouncedSync(performSync);
      }
    });

    // Subscribe to notebook store changes
    const unsubNotebooks = useNotebookStore.subscribe(() => {
      if (isOnline()) {
        debouncedSync(performSync);
      }
    });

    // Subscribe to section store changes
    const unsubSections = useSectionStore.subscribe(() => {
      if (isOnline()) {
        debouncedSync(performSync);
      }
    });

    return () => {
      unsubPages();
      unsubNotebooks();
      unsubSections();
    };
  }, [isAuthenticated, performSync]);

  // Periodic sync to Convex (fallback - every 30 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    const syncInterval = setInterval(() => {
      if (shouldSync() && isOnline()) {
        performSync();
      }
    }, 30000);

    return () => clearInterval(syncInterval);
  }, [isAuthenticated, performSync]);

  // Sync on visibility change (user returns to tab)
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isOnline()) {
        performSync();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isAuthenticated, performSync]);

  // Sync when coming back online
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleOnline = () => {
      performSync();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [isAuthenticated, performSync]);

  // Manual sync function - for explicit sync requests
  const syncNow = useCallback(async () => {
    if (!isAuthenticated || !isOnline()) return;

    await Promise.all([
      syncPagesToConvex(convex, usePageStore.getState().pages),
      syncNotebooksToConvex(convex, useNotebookStore.getState().notebooks),
      syncSectionsToConvex(convex, useSectionStore.getState().sections),
    ]);
  }, [convex, isAuthenticated]);

  return {
    isOnline: isOnline(),
    isAuthenticated,
    syncNow,
  };
};
