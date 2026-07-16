import { create } from 'zustand';

type ToastStore = {
  message: string | null;
  show: (message: string) => void;
  hide: () => void;
};

let timer: ReturnType<typeof setTimeout> | null = null;

/** Transient bottom toast — mirrors the prototype's `toast()` helper. */
export const useToastStore = create<ToastStore>((set) => ({
  message: null,
  show: (message) => {
    set({ message });
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => set({ message: null }), 2200);
  },
  hide: () => {
    if (timer) clearTimeout(timer);
    set({ message: null });
  },
}));
