import { uuid4 } from "uuid4";
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
  getPageById: (id: string) => Page | undefined;
  createPage: (
    notebookId: NotebookId,
    sectionId: SectionId,
    title: string,
    parentPageId?: PageId,
    data?: any
  ) => Page;
  updatePage: (page: Page) => void;
  updatePageById: (id: string, data: Partial<Page>) => void;
  addPage: (page: Page) => void;
  removePage: (id: string) => void;
  clearPages: () => void;
}

// Create Zustand Store with Explicit Types
export const usePageStore = create<PageStore>()(
  persist(
    (set, get) => ({
      pages: {},

      getPageById: (id: string): Page | undefined =>
        (get() as PageStore).pages[id],

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

        set((state) => ({
          pages: { ...state.pages, [id]: newPage },
        }));

        return newPage;
      },

      updatePage: (page: Page) =>
        set((state: PageStore) => ({
          pages: { ...state.pages, [page.id]: page },
        })),

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
        set((state: PageStore) => ({
          pages: { ...state.pages, [page.id]: page },
        })),

      removePage: (id: string) =>
        set((state: PageStore) => {
          const updatedPages = { ...state.pages };
          delete updatedPages[id];
          return { pages: updatedPages };
        }),

      clearPages: () => set({ pages: {} }),
    }),
    {
      name: "page-storage",
    }
  )
);
