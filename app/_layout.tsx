import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";

import {
  isProfileComplete,
  useOnboardingStore,
} from "../store/onboardingStore";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const hasHydrated = useOnboardingStore((state) => state.hasHydrated);
  const onboardingCompleted = useOnboardingStore(
    (state) => state.onboardingCompleted
  );
  const setOnboardingCompleted = useOnboardingStore(
    (state) => state.setOnboardingCompleted
  );
  const profileComplete = useOnboardingStore((state) =>
    isProfileComplete(state)
  );

  useEffect(() => {
    if (!hasHydrated) return;

    const inTabsGroup = segments[0] === "(tabs)";

    if (onboardingCompleted && !profileComplete) {
      setOnboardingCompleted(false);
      router.replace("/onboarding");
      return;
    }

    if (onboardingCompleted && !inTabsGroup) {
      router.replace("/(tabs)/dashboard");
    }
  }, [
    hasHydrated,
    onboardingCompleted,
    profileComplete,
    segments,
    router,
    setOnboardingCompleted,
  ]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
