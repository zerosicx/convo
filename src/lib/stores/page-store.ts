import uuid4 from "uuid4";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NotebookId, PageId, SectionId } from "../definitions";

// Define Page Type
export interface Page {
  id: string;
  sectionId: string;
  parentPageId?: string | null;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  path: string;
  level: number;
  creationDate: Date;
  editedDate: Date;
  archived: boolean;
}

// Define Zustand State
interface PageStore {
  pages: Record<string, Page>;
  orderedPages: PageId[]; // Now stores only pageIds
  getPageList: () => Page[];
  getPageById: (id: string) => Page | undefined;
  createPage: (
    notebookId: NotebookId,
    sectionId: SectionId,
    title: string,
    parentPageId?: PageId,
    data?: any
  ) => Page;
  updatePageById: (id: string, data: Partial<Page>) => void;
  addPage: (page: Page) => void;
  removePage: (id: string) => void;
  removeBySection: (sectionId: SectionId) => void;
  clearPages: () => void;
  repositionPage: (pageId: PageId, index: number) => void; // New function to reposition page
}

// Create Zustand Store with Explicit Types
export const usePageStore = create<PageStore>()(
  persist(
    (set, get) => ({
      pages: {},
      orderedPages: [],

      // Returns the list of pages based on the order of their pageIds
      getPageList: () => {
        const { orderedPages, pages } = get();
        return orderedPages.map((pageId) => pages[pageId]);
      },

      getPageById: (id: string): Page | undefined => get().pages[id],

      createPage: (
        notebookId: string,
        sectionId: string,
        title: string,
        parentPageId?: PageId,
        data: any = ""
      ) => {
        const id = "page-" + uuid4();

        let newPage: Page = {
          id,
          sectionId,
          title,
          data,
          parentPageId: null,
          path: `${notebookId}/${sectionId}/${id}`,
          level: 0,
          creationDate: new Date(),
          editedDate: new Date(),
          archived: false,
        };

        // If there is a parent page, get the parent as well.
        if (parentPageId) {
          const parent = get().getPageById(parentPageId);
          newPage = {
            ...newPage,
            parentPageId: parent?.id,
            level: (parent?.level ?? 0) + 1,
            path: `${parent?.path}/${id}`,
          };
        }

        // Add new page to pages and orderedPages (by pageId)
        set((state) => {
          const newOrderedPages = [...state.orderedPages, id];
          return {
            pages: { ...state.pages, [id]: newPage },
            orderedPages: newOrderedPages,
          };
        });

        return newPage;
      },

      updatePageById: (id: string, data: Partial<Page>) =>
        set((state: PageStore) => {
          const currentPage = state.pages[id];
          if (!currentPage) return state;

          return {
            pages: {
              ...state.pages,
              [id]: {
                ...currentPage,
                ...data,
                editedDate: new Date(),
              },
            },
          };
        }),

      addPage: (page: Page) =>
        set((state: PageStore) => {
          const newOrderedPages = [...state.orderedPages, page.id];
          return {
            pages: { ...state.pages, [page.id]: page },
            orderedPages: newOrderedPages,
          };
        }),

      removePage: (id: string) =>
        set((state: PageStore) => {
          const updatedPages = { ...state.pages };
          delete updatedPages[id];
          const updatedOrderedPages = state.orderedPages.filter(
            (pageId) => pageId !== id
          );
          return { pages: updatedPages, orderedPages: updatedOrderedPages };
        }),

      removeBySection: (sectionId: SectionId) =>
        set((state: PageStore) => {
          const updatedPages = Object.fromEntries(
            Object.entries(state.pages).filter(
              ([_, page]) => page.sectionId !== sectionId
            )
          );
          const updatedOrderedPages = state.orderedPages.filter(
            (pageId) => updatedPages[pageId]
          );
          return { pages: updatedPages, orderedPages: updatedOrderedPages };
        }),

      clearPages: () => set({ pages: {}, orderedPages: [] }),

      // Reposition a page by moving it to a new index
      repositionPage: (pageId: PageId, index: number) => {
        set((state) => {
          const orderedPages = [...state.orderedPages];
          // Remove the page from its current position
          orderedPages.splice(orderedPages.indexOf(pageId), 1);
          // Insert the page at the new index
          orderedPages.splice(index, 0, pageId);

          return { orderedPages };
        });
      },
    }),
    {
      name: "page-storage",
    }
  )
);
