import { create } from "zustand";

export interface SearchModal {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose: () => void;
}

export const useSearch = create<SearchModal>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  onClose: () => set({ open: false }),
}));
