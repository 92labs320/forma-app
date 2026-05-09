import { create } from "zustand";

interface OnboardingState {
  goal: string;
  gender: string;
  age: string;
  height: string;
  weight: string;

  setGoal: (goal: string) => void;
  setGender: (gender: string) => void;
  setAge: (age: string) => void;
  setHeight: (height: string) => void;
  setWeight: (weight: string) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  goal: "",
  gender: "",
  age: "",
  height: "",
  weight: "",

  setGoal: (goal) => set({ goal }),
  setGender: (gender) => set({ gender }),
  setAge: (age) => set({ age }),
  setHeight: (height) => set({ height }),
  setWeight: (weight) => set({ weight }),
}));