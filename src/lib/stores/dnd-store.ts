import { UniqueIdentifier } from "@dnd-kit/core";
import { create } from "zustand";

interface DndStore {
  activeId: string | UniqueIdentifier;
  setActiveId: (activeId: string | UniqueIdentifier) => void;
}

export const useDndStore = create<DndStore>()((set) => ({
  activeId: "",
  setActiveId: (activeId: string | UniqueIdentifier) => set({ activeId }),
}));
