import { create } from "zustand";

export type ProgressEntry = {
  id: string;
  weight: string;
  date: string;
};

interface ProgressState {
  entries: ProgressEntry[];

  addEntry: (weight: string) => void;
  removeEntry: (id: string) => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  entries: [],

  addEntry: (weight) => {
    const newEntry: ProgressEntry = {
      id: Date.now().toString(),
      weight,
      date: new Date().toISOString(),
    };

    set({
      entries: [newEntry, ...get().entries],
    });
  },

  removeEntry: (id) => {
    set({
      entries: get().entries.filter((entry) => entry.id !== id),
    });
  },
}));