import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { getDefaultUnitSystem, UnitSystem } from "../lib/unitConversions";

type OnboardingFields = Pick<
  OnboardingState,
  | "goal"
  | "gender"
  | "age"
  | "height"
  | "weight"
  | "targetWeight"
  | "unitSystem"
  | "onboardingCompleted"
>;

const emptyText = (value: unknown) =>
  typeof value === "string" ? value : "";

const isUnitSystem = (value: unknown): value is UnitSystem =>
  value === "metric" || value === "imperial";

const initialOnboardingState: OnboardingFields = {
  goal: "Lose Fat",
  gender: "Male",
  age: "",
  height: "",
  weight: "",
  targetWeight: "",
  unitSystem: getDefaultUnitSystem(),
  onboardingCompleted: false,
};

interface OnboardingState {
  goal: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  targetWeight: string;
  unitSystem: UnitSystem;
  onboardingCompleted: boolean;
  hasHydrated: boolean;

  setGoal: (goal: string) => void;
  setGender: (gender: string) => void;
  setAge: (age: string) => void;
  setHeight: (height: string) => void;
  setWeight: (weight: string) => void;
  setTargetWeight: (targetWeight: string) => void;
  setUnitSystem: (unitSystem: UnitSystem) => void;
  setOnboardingCompleted: (value: boolean) => void;

  reset: () => void;
}

const safeOnboardingStorage = {
  getItem: (name: string) =>
    AsyncStorage.getItem(name).catch(() => {
      return null;
    }),
  setItem: (name: string, value: string) => {
    if (typeof value !== "string") {
      return AsyncStorage.removeItem(name).catch(() => undefined);
    }

    return AsyncStorage.setItem(name, value).catch(() => undefined);
  },
  removeItem: (name: string) =>
    AsyncStorage.removeItem(name).catch(() => undefined),
};

function sanitizeOnboardingFields(
  state: Partial<OnboardingFields> | undefined
): OnboardingFields {
  return {
    goal: emptyText(state?.goal) || initialOnboardingState.goal,
    gender: emptyText(state?.gender) || initialOnboardingState.gender,
    age: emptyText(state?.age),
    height: emptyText(state?.height),
    weight: emptyText(state?.weight),
    targetWeight: emptyText(state?.targetWeight),
    unitSystem: isUnitSystem(state?.unitSystem)
      ? state.unitSystem
      : getDefaultUnitSystem(),
    onboardingCompleted:
      typeof state?.onboardingCompleted === "boolean"
        ? state.onboardingCompleted
        : false,
  };
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialOnboardingState,
      hasHydrated: false,

      setGoal: (goal) => set({ goal: emptyText(goal) }),
      setGender: (gender) => set({ gender: emptyText(gender) }),
      setAge: (age) => set({ age: emptyText(age) }),
      setHeight: (height) => set({ height: emptyText(height) }),
      setWeight: (weight) => set({ weight: emptyText(weight) }),
      setTargetWeight: (targetWeight) =>
        set({ targetWeight: emptyText(targetWeight) }),
      setUnitSystem: (unitSystem) =>
        set({
          unitSystem: isUnitSystem(unitSystem)
            ? unitSystem
            : getDefaultUnitSystem(),
        }),
      setOnboardingCompleted: (value) =>
        set({
          onboardingCompleted: typeof value === "boolean" ? value : false,
        }),

      reset: () =>
        set({
          goal: "",
          gender: "",
          age: "",
          height: "",
          weight: "",
          targetWeight: "",
          unitSystem: getDefaultUnitSystem(),
          onboardingCompleted: false,
        }),
    }),
    {
      name: "forma-onboarding",
      storage: createJSONStorage(() => safeOnboardingStorage),
      partialize: (state) => sanitizeOnboardingFields(state),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...sanitizeOnboardingFields(
          (persistedState as { state?: Partial<OnboardingFields> })?.state ??
            (persistedState as Partial<OnboardingFields>)
        ),
      }),
      onRehydrateStorage: () => () => {
        try {
          useOnboardingStore.setState({ hasHydrated: true });
        } catch {
          // Hydration must never crash app startup.
        }
      },
    }
  )
);
