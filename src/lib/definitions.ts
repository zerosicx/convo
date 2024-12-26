/* eslint-disable @typescript-eslint/no-explicit-any */

import { Id } from "convex/_generated/dataModel";

// Type Aliases for ID References
export type UserId = Id<"users">;
export type NotebookId = Id<"notebooks">;
export type SectionId = Id<"sections">;
export type PageId = Id<"pages">;

/**
 * Interface for Notebook
 * Represents a collection of sections.
 */
export interface Notebook {
  _id: NotebookId; // Unique identifier for the notebook
  name: string; // Title of the notebook
  user: UserId; // Associated user ID
  description: string; // Summary or description of the notebook
  colour: string; // Notebook's assigned colour (hex code)
  sections: SectionId[]; // Array of associated section IDs
}

/**
 * Interface for Section
 * Belongs to a specific notebook.
 */
export interface Section {
  _id: SectionId; // Unique identifier for the section
  name: string; // Title of the section
  user: UserId; // Associated user ID
  notebookId: NotebookId; // Parent notebook reference
  color: string; // Section's assigned colour (hex code)
}

/**
 * Interface for Page
 * Supports hierarchical nesting through parentPageId.
 */
export interface Page {
  _id: PageId; // Unique identifier for the page
  sectionId: SectionId | null; // Parent section reference
  parentPageId?: PageId | null; // Reference to the parent page (optional)
  title: string; // Page title
  data: any; // Main page content
  path: string; // Hierarchical path (e.g., "section/page")
  level: number; // Nesting level in the tree (0 = root)
  creationDate: Date;
  editedDate: Date;
  archived: boolean;
}
