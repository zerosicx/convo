/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Local type aliases for IDs.
 * Using string for offline-first approach - these get synced with Convex when available.
 */
export type UserId = string;
export type NotebookId = string;
export type SectionId = string;
export type PageId = string;

/**
 * Interface for Notebook
 * Represents a collection of sections.
 */
export interface Notebook {
  _id: NotebookId;
  name: string;
  user: UserId;
  description: string;
  colour: string;
  sections: SectionId[];
}

/**
 * Interface for Section
 * Belongs to a specific notebook.
 */
export interface Section {
  _id: SectionId;
  name: string;
  user: UserId;
  notebookId: NotebookId;
  color: string;
}

/**
 * Interface for Page
 * Supports hierarchical nesting through parentPageId.
 */
export interface Page {
  _id: PageId;
  user: UserId;
  sectionId: SectionId | null;
  parentPageId?: PageId | null;
  title: string;
  data: any;
  path: string;
  level: number;
  creationDate: Date;
  editedDate: Date;
  archived: boolean;
}
