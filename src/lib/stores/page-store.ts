import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  createPage: (sectionId: string, title: string, data?: any) => Page;
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

      createPage: (sectionId: string, title: string, data: any = "") => {
        const id = "page-" + uuid4();
        const newPage: Page = {
          id,
          sectionId,
          title,
          data,
          parentPageId: null,
          path: `${sectionId}/${id}`,
          level: 0,
          creationDate: new Date(),
          editedDate: new Date(),
          archived: false,
        };

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
