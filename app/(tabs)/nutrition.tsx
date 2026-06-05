import { ReactNode, useEffect, useRef } from "react";
import { Animated, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";

import {
  getSanitizedProfile,
  isProfileComplete,
  toSafeProfileNumber,
  useOnboardingStore,
} from "../../store/onboardingStore";
import { useProgressStore } from "../../store/progressStore";
import {
  calculateCalories,
  calculateProtein,
} from "../../lib/fitnessCalculator";
import { getNutritionPlan } from "../../data/nutritionPlans";

export default function Nutrition() {
  const onboardingProfile = useOnboardingStore();
  const hasHydrated = useOnboardingStore((state) => state.hasHydrated);
  const entries = useProgressStore((state) => state.entries);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(12)).current;

  const profile = getSanitizedProfile(onboardingProfile);
  const profileComplete = isProfileComplete(profile);

  useEffect(() => {
    if (hasHydrated && !profileComplete) {
      router.replace("/onboarding");
    }
  }, [hasHydrated, profileComplete]);

  useEffect(() => {
    if (!hasHydrated || !profileComplete) return;

    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      }),
      Animated.timing(screenTranslateY, {
        toValue: 0,
        duration: 520,
        useNativeDriver: true,
      }),
    ]).start();
  }, [hasHydrated, profileComplete, screenOpacity, screenTranslateY]);

  if (!hasHydrated || !profileComplete) {
    return <View style={{ flex: 1, backgroundColor: "#0B0B0B" }} />;
  }

  const currentWeight = toSafeProfileNumber(entries[0]?.weight) ?? profile.weight;
  const calories = calculateCalories(
    profile.gender,
    profile.age,
    currentWeight,
    profile.height,
    profile.goal
  );
  const protein = calculateProtein(currentWeight);
  const plan = getNutritionPlan(profile.goal);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B0B0B" }}
      contentContainerStyle={{
        padding: 24,
        paddingTop: 72,
        paddingBottom: 92,
      }}
    >
      <Animated.View
        style={{
          opacity: screenOpacity,
          transform: [{ translateY: screenTranslateY }],
        }}
      >
        <View style={{ marginBottom: 26 }}>
          <Text
            style={{
              color: "white",
              fontSize: 34,
              fontWeight: "800",
              marginBottom: 8,
            }}
          >
            Nutrition
          </Text>

          <Text
            style={{
              color: "#8E8E8E",
              fontSize: 16,
              lineHeight: 22,
              opacity: 0.9,
            }}
          >
            Simple targets that support your training plan.
          </Text>
        </View>

        <Card accent>
          <SectionHeader
            title="Daily Targets"
            subtitle="A focused baseline for consistency."
          />

          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            <TargetTile
              label="Calories"
              value={calories ? `${calories}` : "-"}
              unit="kcal"
            />
            <TargetTile
              label="Protein"
              value={protein ? `${protein}` : "-"}
              unit="g/day"
            />
          </View>

          <View
            style={{
              backgroundColor: "#0B0B0B",
              borderRadius: 18,
              borderWidth: 1,
              borderColor: "#242424",
              paddingHorizontal: 16,
              paddingVertical: 15,
            }}
          >
            <Text
              style={{
                color: "#777777",
                fontSize: 13,
                fontWeight: "700",
                marginBottom: 7,
              }}
            >
              Water
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "800",
              }}
            >
              {plan.waterGoal}
            </Text>
          </View>
        </Card>

        <Card>
          <SectionHeader
            title="Meal Structure"
            subtitle="Keep meals repeatable and easy to follow."
          />
          {plan.mealStructure.map((item, index) => (
            <NutritionRow key={item} index={index + 1} text={item} />
          ))}
        </Card>

        <Card>
          <SectionHeader title="Recommended Foods" />
          {plan.recommendedFoods.map((item, index) => (
            <NutritionRow key={item} index={index + 1} text={item} />
          ))}
        </Card>

        <Card>
          <SectionHeader title="Limit" />
          {plan.avoid.map((item, index) => (
            <NutritionRow key={item} index={index + 1} text={item} muted />
          ))}
        </Card>
      </Animated.View>
    </ScrollView>
  );
}

function Card({
  children,
  accent = false,
}: {
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <View
      style={{
        backgroundColor: "#131313",
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 17,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: accent ? "rgba(0, 255, 178, 0.22)" : "#242424",
        marginBottom: 18,
        shadowColor: accent ? "#00FFB2" : "#000000",
        shadowOpacity: accent ? 0.055 : 0.16,
        shadowRadius: accent ? 11 : 14,
        shadowOffset: { width: 0, height: 10 },
        elevation: accent ? 2 : 1,
      }}
    >
      {children}
    </View>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={{ marginBottom: subtitle ? 12 : 14 }}>
      <Text
        style={{
          color: "#00FFB2",
          fontSize: 13,
          fontWeight: "800",
          letterSpacing: 0.7,
          textTransform: "uppercase",
          marginBottom: subtitle ? 6 : 0,
        }}
      >
        {title}
      </Text>

      {subtitle ? (
        <Text
          style={{
            color: "#8E8E8E",
            fontSize: 14,
            lineHeight: 20,
            opacity: 0.88,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

function TargetTile({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B0B0B",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#263A34",
        padding: 16,
      }}
    >
      <Text
        style={{
          color: "#777777",
          fontSize: 13,
          fontWeight: "700",
          marginBottom: 10,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "800",
          marginBottom: 4,
        }}
      >
        {value}
      </Text>

      <Text
        style={{
          color: "#00FFB2",
          fontSize: 13,
          fontWeight: "800",
        }}
      >
        {unit}
      </Text>
    </View>
  );
}

function NutritionRow({
  index,
  text,
  muted = false,
}: {
  index: number;
  text: string;
  muted?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        paddingVertical: 11,
        borderTopWidth: index === 1 ? 0 : 1,
        borderTopColor: "rgba(255, 255, 255, 0.028)",
      }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          backgroundColor: muted ? "#1B1B1B" : "rgba(0, 255, 178, 0.09)",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
        }}
      >
        <Text
          style={{
            color: muted ? "#8E8E8E" : "#00FFB2",
            fontSize: 11,
            fontWeight: "800",
          }}
        >
          {index}
        </Text>
      </View>

      <Text
        style={{
          flex: 1,
          color: muted ? "#B8B8B8" : "white",
          fontSize: 15,
          fontWeight: "600",
          lineHeight: 22,
          opacity: muted ? 0.82 : 0.94,
        }}
      >
        {text}
      </Text>
    </View>
  );
}
