/**
 * Convex Sync Service
 *
 * Handles offline-first data synchronization between local zustand stores and Convex.
 * Strategy:
 * 1. Always read/write locally first (zustand + localStorage via persist)
 * 2. When online, sync changes to Convex in background
 * 3. On app load, fetch from Convex if online and merge with local
 *
 * Note: User authentication is handled server-side via ctx.auth.getUserIdentity()
 * The Convex mutations/queries no longer require a userId parameter.
 */

import { api } from "../../../convex/_generated/api";
import { ConvexReactClient } from "convex/react";
import { Notebook, Page, Section } from "../definitions";

// Track sync state
let lastSyncTime = 0;
const SYNC_INTERVAL = 30000; // 30 seconds
const DEBOUNCE_DELAY = 2000; // 2 seconds debounce for live sync

// Debounce timer reference
let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Check if we should sync (has enough time passed since last sync)
 */
export const shouldSync = (): boolean => {
  return Date.now() - lastSyncTime > SYNC_INTERVAL;
};

/**
 * Update last sync timestamp
 */
export const markSynced = (): void => {
  lastSyncTime = Date.now();
};

/**
 * Debounced sync - call this frequently, it will only execute after DEBOUNCE_DELAY
 */
export const debouncedSync = (callback: () => void): void => {
  if (syncDebounceTimer) {
    clearTimeout(syncDebounceTimer);
  }
  syncDebounceTimer = setTimeout(() => {
    callback();
    syncDebounceTimer = null;
  }, DEBOUNCE_DELAY);
};

/**
 * Check if online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Convert local Page to Convex format (without userId - server handles that)
 */
export const pageToConvex = (page: Page) => ({
  clientId: page._id,
  sectionId: page.sectionId ?? undefined,
  parentPageId: page.parentPageId ?? undefined,
  title: page.title,
  data: page.data,
  path: page.path,
  level: page.level,
  tags: [],
  archived: page.archived,
  creationDate: new Date(page.creationDate).getTime(),
  editedDate: new Date(page.editedDate).getTime(),
});

/**
 * Convert Convex Page to local format
 */
export const convexToPage = (doc: any): Page => ({
  _id: doc.clientId,
  user: doc.user,
  sectionId: doc.sectionId ?? null,
  parentPageId: doc.parentPageId ?? null,
  title: doc.title,
  data: doc.data,
  path: doc.path,
  level: doc.level,
  creationDate: new Date(doc.creationDate),
  editedDate: new Date(doc.editedDate),
  archived: doc.archived,
});

/**
 * Convert local Notebook to Convex format (without userId - server handles that)
 */
export const notebookToConvex = (notebook: Notebook) => ({
  clientId: notebook._id,
  name: notebook.name,
  description: notebook.description,
  colour: notebook.colour,
  sections: notebook.sections,
});

/**
 * Convert Convex Notebook to local format
 */
export const convexToNotebook = (doc: any): Notebook => ({
  _id: doc.clientId,
  name: doc.name,
  user: doc.user,
  description: doc.description,
  colour: doc.colour,
  sections: doc.sections,
});

/**
 * Convert local Section to Convex format (without userId - server handles that)
 */
export const sectionToConvex = (section: Section) => ({
  clientId: section._id,
  name: section.name,
  notebookId: section.notebookId,
  color: section.color,
});

/**
 * Convert Convex Section to local format
 */
export const convexToSection = (doc: any): Section => ({
  _id: doc.clientId,
  name: doc.name,
  user: doc.user,
  notebookId: doc.notebookId,
  color: doc.color,
});

/**
 * Sync pages to Convex
 */
export const syncPagesToConvex = async (
  convex: ConvexReactClient,
  pages: Record<string, Page>
): Promise<void> => {
  if (!isOnline()) return;

  try {
    const pagesArray = Object.values(pages).map((p) => pageToConvex(p));
    await convex.mutation(api.pages.upsertPages, { pages: pagesArray });
    markSynced();
  } catch (error) {
    // Silently fail - will retry on next sync
  }
};

/**
 * Sync notebooks to Convex
 */
export const syncNotebooksToConvex = async (
  convex: ConvexReactClient,
  notebooks: Record<string, Notebook>
): Promise<void> => {
  if (!isOnline()) return;

  try {
    const notebooksArray = Object.values(notebooks).map((n) =>
      notebookToConvex(n)
    );
    await convex.mutation(api.notebooks.upsertNotebooks, {
      notebooks: notebooksArray,
    });
  } catch (error) {
    // Silently fail - will retry on next sync
  }
};

/**
 * Sync sections to Convex
 */
export const syncSectionsToConvex = async (
  convex: ConvexReactClient,
  sections: Record<string, Section>
): Promise<void> => {
  if (!isOnline()) return;

  try {
    const sectionsArray = Object.values(sections).map((s) =>
      sectionToConvex(s)
    );
    await convex.mutation(api.sections.upsertSections, {
      sections: sectionsArray,
    });
  } catch (error) {
    // Silently fail - will retry on next sync
  }
};

/**
 * Fetch pages from Convex (server uses auth context to determine user)
 */
export const fetchPagesFromConvex = async (
  convex: ConvexReactClient
): Promise<Page[] | null> => {
  if (!isOnline()) return null;

  try {
    const remoteDocs = await convex.query(api.pages.getAllPages, {});
    return remoteDocs.map(convexToPage);
  } catch (error) {
    return null;
  }
};

/**
 * Fetch notebooks from Convex (server uses auth context to determine user)
 */
export const fetchNotebooksFromConvex = async (
  convex: ConvexReactClient
): Promise<Notebook[] | null> => {
  if (!isOnline()) return null;

  try {
    const remoteDocs = await convex.query(api.notebooks.getAllNotebooks, {});
    return remoteDocs.map(convexToNotebook);
  } catch (error) {
    return null;
  }
};

/**
 * Fetch sections from Convex (server uses auth context to determine user)
 */
export const fetchSectionsFromConvex = async (
  convex: ConvexReactClient
): Promise<Section[] | null> => {
  if (!isOnline()) return null;

  try {
    const remoteDocs = await convex.query(api.sections.getAllSections, {});
    return remoteDocs.map(convexToSection);
  } catch (error) {
    return null;
  }
};
