import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistStorage, StorageValue, persist } from "zustand/middleware";
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

export type SanitizedProfile = {
  goal: string;
  gender: string;
  age: number | null;
  height: number | null;
  weight: number | null;
  targetWeight: number | null;
  unitSystem: UnitSystem;
  onboardingCompleted: boolean;
};

const emptyText = (value: unknown) =>
  typeof value === "string" ? value : "";

const isUnitSystem = (value: unknown): value is UnitSystem =>
  value === "metric" || value === "imperial";

export const toSafeProfileNumber = (value: unknown): number | null => {
  const numericValue =
    typeof value === "string" && value.trim() === "" ? NaN : Number(value);

  return Number.isFinite(numericValue) && numericValue > 0
    ? numericValue
    : null;
};

const safeNumberText = (value: unknown) => {
  const numericValue = toSafeProfileNumber(value);

  return numericValue === null ? "" : String(numericValue);
};

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

function sanitizeOnboardingFields(
  state: Partial<OnboardingFields> | null | undefined
): OnboardingFields {
  const sanitized = {
    goal: emptyText(state?.goal) || initialOnboardingState.goal,
    gender: emptyText(state?.gender) || initialOnboardingState.gender,
    age: safeNumberText(state?.age),
    height: safeNumberText(state?.height),
    weight: safeNumberText(state?.weight),
    targetWeight: safeNumberText(state?.targetWeight),
    unitSystem: isUnitSystem(state?.unitSystem)
      ? state.unitSystem
      : getDefaultUnitSystem(),
    onboardingCompleted:
      typeof state?.onboardingCompleted === "boolean"
        ? state.onboardingCompleted
        : false,
  };

  return {
    ...sanitized,
    onboardingCompleted:
      sanitized.onboardingCompleted && isProfileComplete(sanitized),
  };
}

export function getSanitizedProfile(
  profile: Partial<OnboardingFields> | null | undefined
): SanitizedProfile {
  const unitSystem = isUnitSystem(profile?.unitSystem)
    ? profile.unitSystem
    : getDefaultUnitSystem();

  const sanitizedProfile = {
    goal: emptyText(profile?.goal) || initialOnboardingState.goal,
    gender: emptyText(profile?.gender) || initialOnboardingState.gender,
    age: toSafeProfileNumber(profile?.age),
    height: toSafeProfileNumber(profile?.height),
    weight: toSafeProfileNumber(profile?.weight),
    targetWeight: toSafeProfileNumber(profile?.targetWeight),
    unitSystem,
    onboardingCompleted:
      typeof profile?.onboardingCompleted === "boolean"
        ? profile.onboardingCompleted
        : false,
  };

  return {
    ...sanitizedProfile,
    onboardingCompleted:
      sanitizedProfile.onboardingCompleted &&
      isProfileComplete(sanitizedProfile),
  };
}

export function isProfileComplete(
  profile: Partial<OnboardingFields> | Partial<SanitizedProfile> | null | undefined
) {
  const age = toSafeProfileNumber(profile?.age);
  const height = toSafeProfileNumber(profile?.height);
  const weight = toSafeProfileNumber(profile?.weight);
  const targetWeight = toSafeProfileNumber(profile?.targetWeight);

  return Boolean(
    age !== null &&
      height !== null &&
      weight !== null &&
      targetWeight !== null &&
      isUnitSystem(profile?.unitSystem)
  );
}

const cleanPersistedState = (): StorageValue<OnboardingFields> => ({
  state: { ...initialOnboardingState },
});

const safeOnboardingStorage: PersistStorage<OnboardingFields> = {
  getItem: async (name) => {
    try {
      const value = await AsyncStorage.getItem(name);

      if (typeof value !== "string") {
        return null;
      }

      try {
        const parsed: unknown = JSON.parse(value);

        if (
          !parsed ||
          typeof parsed !== "object" ||
          !("state" in parsed) ||
          !parsed.state ||
          typeof parsed.state !== "object"
        ) {
          return cleanPersistedState();
        }

        return {
          state: sanitizeOnboardingFields(
            parsed.state as Partial<OnboardingFields>
          ),
          version:
            "version" in parsed && typeof parsed.version === "number"
              ? parsed.version
              : undefined,
        };
      } catch {
        return cleanPersistedState();
      }
    } catch {
      return cleanPersistedState();
    }
  },
  setItem: async (name, value) => {
    try {
      const serialized = JSON.stringify({
        ...value,
        state: sanitizeOnboardingFields(value?.state),
      });
      await AsyncStorage.setItem(name, serialized);
    } catch {
      // Persistence failures must never affect app usage or launch.
    }
  },
  removeItem: async (name) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      // Persistence failures must never affect app usage or launch.
    }
  },
};

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
      name: "forma-onboarding-v2",
      storage: safeOnboardingStorage,
      partialize: (state) => sanitizeOnboardingFields(state),
      merge: (persistedState, currentState) => {
        try {
          return {
            ...currentState,
            ...sanitizeOnboardingFields(
              persistedState as Partial<OnboardingFields>
            ),
          };
        } catch {
          return {
            ...currentState,
            ...initialOnboardingState,
          };
        }
      },
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
