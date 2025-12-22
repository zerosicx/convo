/**
 * User Session Manager
 *
 * Handles user session state and ensures data isolation between users.
 * When a different user signs in, clears local storage to prevent data leakage.
 */

import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { useNotebookStore } from "../stores/notebook-store";
import { usePageStore } from "../stores/page-store";
import { useSectionStore } from "../stores/section-store";

const LAST_USER_KEY = "convo-last-user-id";

/**
 * Hook to manage user session and data isolation
 * Call this at the app root to handle user switching
 */
export const useUserSession = () => {
  const { user, isLoaded } = useUser();
  const { clearPages } = usePageStore();
  const { clearNotebooks } = useNotebookStore();
  const { clearSections } = useSectionStore();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!isLoaded || hasChecked.current) return;

    const currentUserId = user?.id ?? null;
    const lastUserId = localStorage.getItem(LAST_USER_KEY);

    // If there's a different user than last time, clear all local data
    if (currentUserId && lastUserId && currentUserId !== lastUserId) {
      clearPages();
      clearNotebooks();
      clearSections();
    }

    // Store the current user ID for next session
    if (currentUserId) {
      localStorage.setItem(LAST_USER_KEY, currentUserId);
    }

    hasChecked.current = true;
  }, [isLoaded, user?.id, clearPages, clearNotebooks, clearSections]);

  return {
    userId: user?.id ?? null,
    isLoaded,
  };
};

/**
 * Utility to clear all user data on sign out
 */
export const clearAllUserData = () => {
  // Clear the stores
  usePageStore.getState().clearPages();
  useNotebookStore.getState().clearNotebooks();
  useSectionStore.getState().clearSections();

  // Clear localStorage
  localStorage.removeItem("page-storage");
  localStorage.removeItem("notebook-storage");
  localStorage.removeItem("section-storage");
  localStorage.removeItem(LAST_USER_KEY);
};

