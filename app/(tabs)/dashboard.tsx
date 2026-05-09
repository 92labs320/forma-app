import { ReactNode, useEffect, useRef } from "react";
import { Animated, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";

import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { useOnboardingStore } from "../../store/onboardingStore";
import { useWorkoutStore } from "../../store/workoutStore";

import {
  calculateBMI,
  calculateCalories,
  calculateProtein,
  getFitnessProfile,
  calculateWeightRemaining,
  estimateTimeline,
} from "../../lib/fitnessCalculator";

import { getWorkoutPlan } from "../../data/workoutPlans";

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function Dashboard() {
  const { goal, gender, age, height, weight, targetWeight } =
    useOnboardingStore();
  const { completedWorkoutDates, getCurrentStreak } = useWorkoutStore();

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(12)).current;

  const bmi = calculateBMI(weight, height);
  const calories = calculateCalories(gender, age, weight, height, goal);
  const protein = calculateProtein(weight);
  const fitnessProfile = getFitnessProfile(bmi);
  const workoutPlan = getWorkoutPlan(goal);
  const weightRemaining = calculateWeightRemaining(weight, targetWeight);
  const estimatedTimeline = estimateTimeline(weight, targetWeight);
  const streak = getCurrentStreak();
  const trainedToday = completedWorkoutDates.includes(getDateKey(new Date()));

  useEffect(() => {
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
  }, [screenOpacity, screenTranslateY]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#0B0B0B",
      }}
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
            Dashboard
          </Text>

          <Text style={{ color: "#8E8E8E", fontSize: 16, lineHeight: 22 }}>
            Your daily plan, built around consistency.
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
          <AnimatedMetricCard
            delay={0}
            label="Calories"
            value={calories ? `${calories}` : "-"}
            detail="kcal target"
            progress={0.72}
          />
          <AnimatedMetricCard
            delay={80}
            label="Protein"
            value={protein ? `${protein}g` : "-"}
            detail="daily goal"
            progress={0.64}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 26 }}>
          <AnimatedMetricCard
            delay={160}
            label="BMI"
            value={bmi ? String(bmi) : "-"}
            detail={fitnessProfile}
            progress={bmi ? Math.min(bmi / 35, 1) : 0}
          />
          <AnimatedMetricCard
            delay={240}
            label="Streak"
            value={`${streak}`}
            detail={streak === 1 ? "day active" : "days active"}
            progress={Math.min(streak / 7, 1)}
            accent
          />
        </View>

        <PremiumCard accent>
          <SectionHeader
            title="Today's Goal"
            subtitle={
              trainedToday
                ? "Workout logged. Keep the day clean with protein and hydration."
                : "Complete one planned workout to protect your streak."
            }
          />

          <View
            style={{
              backgroundColor: "#0B0B0B",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: trainedToday ? "rgba(0, 255, 178, 0.45)" : "#242424",
              padding: 18,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  color: "white",
                  flex: 1,
                  fontSize: 23,
                  fontWeight: "800",
                  lineHeight: 29,
                }}
              >
                {trainedToday ? "Goal complete" : "Train today"}
              </Text>

              <View
                style={{
                  backgroundColor: "rgba(0, 255, 178, 0.12)",
                  borderRadius: 999,
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                }}
              >
                <Text
                  style={{
                    color: "#00FFB2",
                    fontSize: 12,
                    fontWeight: "800",
                  }}
                >
                  {streak}D
                </Text>
              </View>
            </View>

            <Text style={{ color: "#8E8E8E", fontSize: 14, lineHeight: 20 }}>
              {trainedToday
                ? `${streak} day streak. Come back tomorrow to extend it.`
                : `${streak} day streak. Finish a workout before the day ends.`}
            </Text>
          </View>

          <PrimaryButton
            onPress={() => router.push("/(tabs)/workout")}
            style={{
              shadowOpacity: 0.12,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            View Workouts
          </PrimaryButton>
        </PremiumCard>

        <PremiumCard>
          <SectionHeader
            title="Smart Plan"
            subtitle="Targets calibrated from your profile."
          />
          <InfoRow label="Fitness Profile" value={fitnessProfile} />
          <InfoRow label="Daily Calories" value={calories ? `${calories} kcal` : "-"} />
          <InfoRow label="Protein Target" value={protein ? `${protein} g/day` : "-"} />
        </PremiumCard>

        <PremiumCard>
          <SectionHeader
            title="Workout Summary"
            subtitle="Your current training structure."
          />
          <InfoRow label="Plan" value={workoutPlan.name} />
          <InfoRow label="Days / Week" value={`${workoutPlan.daysPerWeek}`} />
          <InfoRow label="Split" value={workoutPlan.split} />
          <InfoRow label="Cardio" value={workoutPlan.cardio} />
          <InfoRow label="Focus" value={workoutPlan.description} />
        </PremiumCard>

        <PremiumCard>
          <SectionHeader
            title="Transformation"
            subtitle="Your weight target at a glance."
          />

          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            <MiniTile label="Current" value={`${weight || "-"} kg`} />
            <MiniTile label="Target" value={`${targetWeight || "-"} kg`} />
          </View>

          <InfoRow
            label="Remaining Weight"
            value={weightRemaining ? `${weightRemaining} kg` : "-"}
          />
          <InfoRow label="Estimated Timeline" value={estimatedTimeline || "-"} />
        </PremiumCard>
      </Animated.View>
    </ScrollView>
  );
}

function PremiumCard({
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
        padding: 22,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: accent ? "rgba(0, 255, 178, 0.22)" : "#242424",
        marginBottom: 22,
        shadowColor: accent ? "#00FFB2" : "#000000",
        shadowOpacity: accent ? 0.08 : 0.22,
        shadowRadius: accent ? 16 : 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: accent ? 3 : 2,
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
    <View style={{ marginBottom: 18 }}>
      <Text
        style={{
          color: "#00FFB2",
          fontSize: 13,
          fontWeight: "800",
          letterSpacing: 0.7,
          textTransform: "uppercase",
          marginBottom: subtitle ? 7 : 0,
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
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

function AnimatedMetricCard({
  delay,
  label,
  value,
  detail,
  progress,
  accent = false,
}: {
  delay: number;
  label: string;
  value: string;
  detail: string;
  progress: number;
  accent?: boolean;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;
  const barProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 360,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 360,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(barProgress, {
        toValue: progress,
        duration: 650,
        delay: delay + 120,
        useNativeDriver: false,
      }),
    ]).start();
  }, [barProgress, delay, opacity, progress, translateY]);

  const width = barProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity,
        transform: [{ translateY }],
      }}
    >
      <View
        style={{
          minHeight: 154,
          backgroundColor: "#131313",
          padding: 18,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: accent ? "rgba(0, 255, 178, 0.3)" : "#242424",
          shadowColor: accent ? "#00FFB2" : "#000000",
          shadowOpacity: accent ? 0.08 : 0.18,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
          elevation: 2,
        }}
      >
        <Text
          style={{
            color: "#8E8E8E",
            fontSize: 13,
            fontWeight: "700",
            marginBottom: 12,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 29,
            fontWeight: "800",
            marginBottom: 6,
          }}
        >
          {value}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            color: accent ? "#00FFB2" : "#8E8E8E",
            fontSize: 13,
            fontWeight: accent ? "800" : "600",
            lineHeight: 18,
            minHeight: 36,
          }}
        >
          {detail}
        </Text>
        <View
          style={{
            height: 7,
            backgroundColor: "#252525",
            borderRadius: 999,
            overflow: "hidden",
            marginTop: 14,
          }}
        >
          <Animated.View
            style={{
              width,
              height: "100%",
              backgroundColor: "#00FFB2",
              borderRadius: 999,
            }}
          />
        </View>
      </View>
    </Animated.View>
  );
}

function MiniTile({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B0B0B",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#242424",
        padding: 16,
      }}
    >
      <Text
        style={{
          color: "#777777",
          fontSize: 13,
          fontWeight: "700",
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <Text style={{ color: "white", fontSize: 19, fontWeight: "800" }}>
        {value}
      </Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: "#242424",
      }}
    >
      <Text
        style={{
          color: "#777777",
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 6,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          color: "white",
          fontSize: 16,
          fontWeight: "700",
          lineHeight: 23,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
