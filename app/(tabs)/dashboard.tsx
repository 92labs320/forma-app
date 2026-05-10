import { ReactNode, useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { useOnboardingStore } from "../../store/onboardingStore";
import { useWorkoutStore } from "../../store/workoutStore";

import {
  calculateBMI,
  calculateCalories,
  calculateProtein,
  getFitnessProfile,
  calculateWeightRemaining,
} from "../../lib/fitnessCalculator";

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
  const weightRemaining = calculateWeightRemaining(weight, targetWeight);
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
        <View style={{ marginBottom: 22 }}>
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
            Focus on today. Build the streak.
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
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

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
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

        <PremiumCard compact>
          <Text
            style={{
              color: "#00E6A4",
              fontSize: 11,
              fontWeight: "800",
              letterSpacing: 1.1,
              marginBottom: 16,
              opacity: 0.82,
            }}
          >
            DAILY ACTIVITY
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <ProgressRing
              delay={120}
              label="Calories"
              progress={0.72}
            />
            <ProgressRing
              delay={220}
              label="Protein"
              progress={0.64}
            />
            <ProgressRing
              delay={320}
              label="Consistency"
              progress={Math.min(streak / 7, 1)}
            />
          </View>
        </PremiumCard>

        <PremiumCard accent>
          <SectionHeader
            title="Today's Goal"
            subtitle={
              trainedToday
                ? "Workout logged. Keep the day clean."
                : "Complete one planned workout to protect your streak."
            }
          />

          <View
            style={{
              backgroundColor: "#0B0B0B",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: trainedToday ? "rgba(0, 255, 178, 0.45)" : "#242424",
              paddingHorizontal: 18,
              paddingVertical: 24,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                marginBottom: 6,
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

          <DashboardActionButton
            onPress={() => router.push("/(tabs)/workout")}
          >
            Start Workout
          </DashboardActionButton>
        </PremiumCard>

        <PremiumCard>
          <SectionHeader title="Transformation" />

          <View style={{ flexDirection: "row", gap: 10 }}>
            <MiniTile label="Current" value={`${weight || "-"} kg`} accent />
            <MiniTile label="Target" value={`${targetWeight || "-"} kg`} />
            <MiniTile
              label="Remaining"
              value={weightRemaining ? `${weightRemaining} kg` : "-"}
            />
          </View>
        </PremiumCard>
      </Animated.View>
    </ScrollView>
  );
}

function PremiumCard({
  children,
  accent = false,
  compact = false,
}: {
  children: ReactNode;
  accent?: boolean;
  compact?: boolean;
}) {
  return (
    <View
      style={{
        backgroundColor: "#131313",
        padding: compact ? 16 : 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: accent ? "rgba(0, 255, 178, 0.22)" : "#242424",
        marginBottom: 18,
        shadowColor: accent ? "#00FFB2" : "#000000",
        shadowOpacity: accent ? 0.06 : 0.22,
        shadowRadius: accent ? 12 : 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: accent ? 2 : 2,
      }}
    >
      {children}
    </View>
  );
}

function DashboardActionButton({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateScale = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 28,
      bounciness: 6,
    }).start();
  };

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        shadowColor: "#19E6A1",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={() => animateScale(0.97)}
        onPressOut={() => animateScale(1)}
        style={{
          backgroundColor: "#19E6A1",
          minHeight: 57,
          paddingVertical: 15,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.14)",
        }}
      >
        <Text
          style={{
            color: "#0B0B0B",
            fontSize: 15,
            fontWeight: "800",
          }}
        >
          {children}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function ProgressRing({
  delay,
  label,
  progress,
}: {
  delay: number;
  label: string;
  progress: number;
}) {
  const ringProgress = useRef(new Animated.Value(0)).current;
  const size = 68;
  const stroke = 6;
  const ringColor = "#00E6A4";
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const percent = Math.round(clampedProgress * 100);

  useEffect(() => {
    Animated.timing(ringProgress, {
      toValue: clampedProgress,
      duration: 760,
      delay,
      useNativeDriver: true,
    }).start();
  }, [clampedProgress, delay, ringProgress]);

  const firstHalfRotation = ringProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["-90deg", "90deg", "90deg"],
  });
  const secondHalfRotation = ringProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["-90deg", "-90deg", "90deg"],
  });

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderColor: "#252525",
          }}
        />

        <Animated.View
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderColor: "transparent",
            borderRightColor: ringColor,
            borderTopColor: ringColor,
            opacity: 0.74,
            transform: [{ rotate: firstHalfRotation }],
          }}
        />

        {clampedProgress > 0.5 ? (
          <Animated.View
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: stroke,
              borderColor: "transparent",
              borderRightColor: ringColor,
              borderTopColor: ringColor,
              opacity: 0.74,
              transform: [{ rotate: secondHalfRotation }],
            }}
          />
        ) : null}

        <View
          style={{
            width: size - stroke * 2 - 8,
            height: size - stroke * 2 - 8,
            borderRadius: (size - stroke * 2 - 8) / 2,
            backgroundColor: "#0B0B0B",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "800",
            }}
          >
            {percent}%
          </Text>
        </View>
      </View>

      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{
          color: "#8E8E8E",
          fontSize: 12,
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        {label}
      </Text>
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
          minHeight: 124,
          backgroundColor: "#131313",
          padding: 14,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: accent ? "rgba(0, 255, 178, 0.3)" : "#242424",
          shadowColor: accent ? "#00FFB2" : "#000000",
          shadowOpacity: accent ? 0.04 : 0.18,
          shadowRadius: accent ? 7 : 14,
          shadowOffset: { width: 0, height: 8 },
          elevation: 2,
        }}
      >
        <Text
          style={{
            color: "#8E8E8E",
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
            fontSize: 26,
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
            fontSize: 12,
            fontWeight: accent ? "800" : "600",
            lineHeight: 17,
            minHeight: 30,
          }}
        >
          {detail}
        </Text>
        <View
          style={{
            height: 6,
            backgroundColor: "#252525",
            borderRadius: 999,
            overflow: "hidden",
            marginTop: 12,
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

function MiniTile({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B0B0B",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: accent ? "rgba(0, 255, 178, 0.35)" : "#242424",
        padding: 14,
      }}
    >
      <Text
        style={{
          color: "#777777",
          fontSize: 12,
          fontWeight: "700",
          marginBottom: 7,
        }}
      >
        {label}
      </Text>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{
          color: accent ? "#00FFB2" : "white",
          fontSize: 17,
          fontWeight: "800",
        }}
      >
        {value}
      </Text>
    </View>
  );
}
