import { create } from 'zustand';

interface SidebarStore {
  isHovered: boolean;
  isOpen: boolean;
  setHovered: (hovered: boolean) => void;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isHovered: false,
  isOpen: false,
  setHovered: (hovered) => set({ isHovered: hovered }),
  setOpen: (open) => set({ isOpen: open }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
