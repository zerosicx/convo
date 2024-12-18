import { arrayMove } from "@dnd-kit/sortable";
import uuid4 from "uuid4";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NotebookId, Page, PageId, SectionId } from "../definitions";

// Define Zustand State
interface PageStore {
  pages: Record<string, Page>;
  orderedPages: PageId[]; // Now stores only pageIds
  getPageList: () => Page[];
  getPageById: (id: string) => Page | undefined;
  createPage: (
    notebookId: NotebookId | null,
    sectionId: SectionId | null,
    title: string,
    parentPageId?: PageId,
    data?: any
  ) => Page;
  updatePageList: (newOrder: PageId[]) => void;
  updatePageById: (id: string, data: Partial<Page>) => void;
  addPage: (page: Page) => void;
  removePage: (id: string) => void;
  removeBySection: (sectionId: SectionId) => void;
  clearPages: () => void;

  // Utility Functions
  reorderPages: (activeId: string, overId: string | null) => void;
  searchMatchString: (str: string) => Page[];
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
        notebookId: string | null,
        sectionId: string | null,
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
          path:
            notebookId && sectionId
              ? `${notebookId}/${sectionId}/${id}`
              : `${id}`,
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

      updatePageList: (newOrder: PageId[]) =>
        set(() => ({ orderedPages: newOrder })),

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

          Object.keys(updatedPages).forEach((pageKey) => {
            const page = updatedPages[pageKey];
            if (page.parentPageId === id) {
              delete updatedPages[pageKey]; // Remove child page
            }
          });

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

      reorderPages: (activeId: string, overId: string | null) => {
        const { updatePageById } = get();

        console.log(`Inside reorder overId:  ${overId}`);

        const reorder = () => {
          console.log(
            `Reordering: activeId: ${activePage.title}, overId: ${overPage.title}`
          );
          // Get the pages and use ArrayMove to swap them
          const newPages = (() => {
            const oldIndex = get().orderedPages.indexOf(activeId as string);
            const newIndex = get().orderedPages.indexOf(overId as string);

            return arrayMove(get().orderedPages, oldIndex, newIndex);
          })();

          // Update the page list order
          get().updatePageList(newPages);
        };

        if (!overId) {
          // Otherwise if it's dragging over itself
          console.log(`Triggering else branch`);
          updatePageById(activeId as string, {
            parentPageId: null,
            level: 0,
          });
          return;
        }

        // Parent-Child handling logic
        const activePage = get().pages[activeId];
        const overPage = get().pages[overId];

        if (overPage.parentPageId !== activePage.id) reorder();

        /**
         * [1] If the page levels are the same AND their parent IDs are not the same,
         * change activePage's parent to overPage's parent and update the page path.
         * We know that they're definitely in the same Notebook and Section.
         */
        if (
          activePage.level === overPage.level &&
          activePage.parentPageId !== overPage.parentPageId
        ) {
          const newPath = overPage.path.replace(/[^/]+$/, activePage.id);
          updatePageById(activePage.id, {
            parentPageId: overPage.parentPageId,
            path: newPath,
          });
        } else if (activePage.level > overPage.level) {
          /**
           * If the active page is MORE nested, overPage becomes its parent.
           * Obviously they won't have the same parentId.
           */
          const newPath = overPage.path + "/" + activePage.id;
          updatePageById(activePage.id, {
            parentPageId: overPage.id,
            path: newPath,
          });
        } else if (
          /**
           * Finally, if the active page is LESS nested, nest it to the same
           * parent as the overPage if activePage is NOT its parent.
           * Make its level the same.
           */
          activePage.level < overPage.level &&
          activePage.id !== overPage.parentPageId
        ) {
          const newPath = overPage.path.replace(/[^/]+$/, activeId);
          updatePageById(activePage.id, {
            parentPageId: overPage.parentPageId,
            level: overPage.level,
            path: newPath,
          });
        }
      },

      searchMatchString: (str: string) => {
        const allPages = get().pages;

        if (!str || str === "") {
          return Object.values(allPages)
            .sort(
              (a, b) =>
                new Date(b.editedDate).getTime() -
                new Date(a.editedDate).getTime()
            )
            .slice(0, 4);
        }

        const results = Object.values(allPages).filter((page) =>
          page.title.toLocaleLowerCase().includes(str.toLocaleLowerCase())
        );

        return results;
      },
    }),
    {
      name: "page-storage",
    }
  )
);
