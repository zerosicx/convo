import uuid4 from "uuid4";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Section } from "../definitions";
import { getRandomRedPinkHex } from "../utils";

// Zustand Store Type Definition
interface SectionStore {
  sections: Record<string, Section>; // Dictionary of sections

  // CRUD Functions
  getSectionById: (id: string) => Section | undefined;
  createSection: (
    userId: string,
    notebookId: string,
    name: string,
    color?: string
  ) => Section;
  updateSection: (section: Section) => void;
  updateSectionById: (id: string, data: Partial<Section>) => void;
  getSectionsByNotebook: (notebookId: string) => Section[];

  // Utility Functions
  addSection: (section: Section) => void;
  removeSection: (id: string) => void;
  clearSections: () => void;
}

export const useSectionStore = create<SectionStore>()(
  persist(
    (set, get) => ({
      sections: {},

      // Get a section by its ID
      getSectionById: (id: string): Section | undefined =>
        (get() as SectionStore).sections[id],

      createSection: (
        userId: string,
        notebookId: string,
        name: string,
        color?: string
      ) => {
        const _id = "section-" + uuid4();
        const sectionColor = color ?? getRandomRedPinkHex();
        const newSection: Section = {
          _id,
          name,
          user: userId,
          notebookId,
          color: sectionColor,
        };

        set((state) => ({
          sections: { ...state.sections, [_id]: newSection },
        }));

        return newSection;
      },

      // Update an entire section
      updateSection: (section: Section) =>
        set((state: SectionStore) => ({
          sections: { ...state.sections, [section._id]: section },
        })),

      // Update a section by ID with partial data
      updateSectionById: (id: string, data: Partial<Section>) =>
        set((state: SectionStore) => {
          const currentSection = state.sections[id];
          if (!currentSection) return state;

          const updatedSection = {
            ...currentSection,
            ...data,
          };

          return {
            sections: { ...state.sections, [id]: updatedSection },
          };
        }),

      // Get all sections for a specific notebook
      getSectionsByNotebook: (notebookId: string) =>
        Object.values((get() as SectionStore).sections).filter(
          (section) => (section as Section).notebookId === notebookId
        ),

      // Add a new section
      addSection: (section: Section) =>
        set((state: SectionStore) => ({
          sections: { ...state.sections, [section._id]: section },
        })),

      // Remove a section by ID
      removeSection: (id: string) =>
        set((state: SectionStore) => {
          const updatedSections = { ...state.sections };
          delete updatedSections[id];
          return { sections: updatedSections };
        }),

      // Clear all sections
      clearSections: () => set({ sections: {} }),
    }),
    {
      name: "section-storage", // LocalStorage Key
    }
  )
);
