import { create } from "zustand";

interface ScrollState {
  /** Position in node-index space: 0 = first node centered, n-1 = last.
   *  Below 0 before the experience section, above n-1 past it. */
  system: number;
  setSystem: (system: number) => void;
  /** True once the scene has rendered its first frames (or will never render) */
  ready: boolean;
  setReady: () => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  system: -2,
  setSystem: (system) => set({ system }),
  ready: false,
  setReady: () => set({ ready: true }),
}));
