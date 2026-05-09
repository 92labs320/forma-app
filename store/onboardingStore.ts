import { create } from "zustand";

interface OnboardingState {
  goal: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  targetWeight: string;

  setGoal: (goal: string) => void;
  setGender: (gender: string) => void;
  setAge: (age: string) => void;
  setHeight: (height: string) => void;
  setWeight: (weight: string) => void;
  setTargetWeight: (targetWeight: string) => void;

  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  goal: "",
  gender: "",
  age: "",
  height: "",
  weight: "",
  targetWeight: "",

  setGoal: (goal) => set({ goal }),
  setGender: (gender) => set({ gender }),
  setAge: (age) => set({ age }),
  setHeight: (height) => set({ height }),
  setWeight: (weight) => set({ weight }),
  setTargetWeight: (targetWeight) => set({ targetWeight }),

  reset: () =>
    set({
      goal: "",
      gender: "",
      age: "",
      height: "",
      weight: "",
      targetWeight: "",
    }),
}));