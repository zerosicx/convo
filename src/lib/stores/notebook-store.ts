import uuid4 from "uuid4";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Notebook } from "../definitions";

// Zustand Store Type Definition
interface NotebookStore {
  notebooks: Record<string, Notebook>; // Dictionary of notebooks

  // CRUD Functions
  getNotebookById: (id: string) => Notebook | undefined;
  createNotebook: (
    name: string,
    user: string,
    description?: string,
    colour?: string
  ) => Notebook;
  updateNotebook: (notebook: Notebook) => void;
  updateNotebookById: (id: string, data: Partial<Notebook>) => void;
  deleteNotebook: (id: string) => void;

  // Utility Functions
  addNotebook: (notebook: Notebook) => void;
  clearNotebooks: () => void;
}

export const useNotebookStore = create<NotebookStore>()(
  persist(
    (set, get) => ({
      notebooks: {},

      // Get a notebook by its ID
      getNotebookById: (id: string): Notebook | undefined =>
        get().notebooks[id],

      createNotebook: (
        name: string,
        user: string,
        description = "",
        colour = "#1e40af"
      ) => {
        const id = "notebook-" + uuid4();
        const newNotebook: Notebook = {
          id,
          name,
          user,
          description,
          colour,
          sections: [],
        };

        set((state) => ({
          notebooks: { ...state.notebooks, [id]: newNotebook },
        }));

        return newNotebook;
      },

      // Update an entire notebook
      updateNotebook: (notebook: Notebook) =>
        set((state: NotebookStore) => ({
          notebooks: { ...state.notebooks, [notebook.id]: notebook },
        })),

      // Update a notebook by ID with partial data
      updateNotebookById: (id: string, data: Partial<Notebook>) =>
        set((state: NotebookStore) => {
          const currentNotebook = state.notebooks[id];
          if (!currentNotebook) return state;

          const updatedNotebook = {
            ...currentNotebook,
            ...data,
          };

          return {
            notebooks: { ...state.notebooks, [id]: updatedNotebook },
          };
        }),

      // Delete a notebook by ID
      deleteNotebook: (id: string) =>
        set((state: NotebookStore) => {
          const updatedNotebooks = { ...state.notebooks };
          delete updatedNotebooks[id];
          return { notebooks: updatedNotebooks };
        }),

      // Add a new notebook
      addNotebook: (notebook: Notebook) =>
        set((state: NotebookStore) => ({
          notebooks: { ...state.notebooks, [notebook.id]: notebook },
        })),

      // Clear all notebooks
      clearNotebooks: () => set({ notebooks: {} }),
    }),
    {
      name: "notebook-storage", // LocalStorage Key
    }
  )
);
