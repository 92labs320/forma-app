import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { getDefaultUnitSystem, UnitSystem } from "../lib/unitConversions";

const initialOnboardingState = {
  goal: "Lose Fat",
  gender: "Male",
  age: "",
  height: "",
  weight: "",
  targetWeight: "",
  unitSystem: getDefaultUnitSystem(),
};

interface OnboardingState {
  goal: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  targetWeight: string;
  unitSystem: UnitSystem;

  setGoal: (goal: string) => void;
  setGender: (gender: string) => void;
  setAge: (age: string) => void;
  setHeight: (height: string) => void;
  setWeight: (weight: string) => void;
  setTargetWeight: (targetWeight: string) => void;
  setUnitSystem: (unitSystem: UnitSystem) => void;

  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialOnboardingState,

      setGoal: (goal) => set({ goal }),
      setGender: (gender) => set({ gender }),
      setAge: (age) => set({ age }),
      setHeight: (height) => set({ height }),
      setWeight: (weight) => set({ weight }),
      setTargetWeight: (targetWeight) => set({ targetWeight }),
      setUnitSystem: (unitSystem) => set({ unitSystem }),

      reset: () =>
        set({
          goal: "",
          gender: "",
          age: "",
          height: "",
          weight: "",
          targetWeight: "",
          unitSystem: getDefaultUnitSystem(),
        }),
    }),
    {
      name: "forma-onboarding",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
