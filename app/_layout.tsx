import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";

import { useOnboardingStore } from "../store/onboardingStore";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const hasHydrated = useOnboardingStore((state) => state.hasHydrated);
  const onboardingCompleted = useOnboardingStore(
    (state) => state.onboardingCompleted
  );

  useEffect(() => {
    if (!hasHydrated) return;

    const inTabsGroup = segments[0] === "(tabs)";

    if (onboardingCompleted && !inTabsGroup) {
      router.replace("/(tabs)/dashboard");
    }
  }, [hasHydrated, onboardingCompleted, segments, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
