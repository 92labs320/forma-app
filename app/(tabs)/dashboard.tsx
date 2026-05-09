import { useEffect, useRef } from "react";
import { Animated, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";

import { Card } from "../../components/ui/Card";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { SectionTitle } from "../../components/ui/SectionTitle";
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

  const bmi = calculateBMI(weight, height);
  const calories = calculateCalories(gender, age, weight, height, goal);
  const protein = calculateProtein(weight);
  const fitnessProfile = getFitnessProfile(bmi);
  const workoutPlan = getWorkoutPlan(goal);
  const weightRemaining = calculateWeightRemaining(weight, targetWeight);
  const estimatedTimeline = estimateTimeline(weight, targetWeight);
  const streak = getCurrentStreak();
  const trainedToday = completedWorkoutDates.includes(getDateKey(new Date()));

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#0B0B0B",
      }}
      contentContainerStyle={{
        padding: 24,
        paddingTop: 72,
        paddingBottom: 88,
        gap: 18,
      }}
    >
      <View style={{ marginBottom: 4 }}>
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

      <View style={{ flexDirection: "row", gap: 12 }}>
        <AnimatedProgressCard
          delay={0}
          label="Calories"
          value={calories ? `${calories}` : "-"}
          detail="kcal target"
          progress={0.72}
        />
        <AnimatedProgressCard
          delay={80}
          label="Protein"
          value={protein ? `${protein}g` : "-"}
          detail="daily goal"
          progress={0.64}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <AnimatedProgressCard
          delay={160}
          label="BMI"
          value={bmi ? String(bmi) : "-"}
          detail={fitnessProfile}
          progress={bmi ? Math.min(bmi / 35, 1) : 0}
        />
        <AnimatedProgressCard
          delay={240}
          label="Streak"
          value={`${streak}`}
          detail={streak === 1 ? "day active" : "days active"}
          progress={Math.min(streak / 7, 1)}
        />
      </View>

      <Card>
        <SectionTitle
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
            borderRadius: 18,
            borderWidth: 1,
            borderColor: trainedToday ? "#00FFB2" : "#262626",
            padding: 18,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 22,
              fontWeight: "800",
              marginBottom: 6,
            }}
          >
            {trainedToday ? "Goal complete" : "Train today"}
          </Text>
          <Text style={{ color: "#8E8E8E", fontSize: 14, lineHeight: 20 }}>
            {trainedToday
              ? `${streak} day streak. Come back tomorrow to extend it.`
              : `${streak} day streak. Finish a workout before the day ends.`}
          </Text>
        </View>

        <PrimaryButton onPress={() => router.push("/(tabs)/workout")}>
          View Workouts
        </PrimaryButton>
      </Card>

      <Card>
        <SectionTitle title="Smart Plan" />
        <ProfileItem label="Fitness Profile" value={fitnessProfile} />
        <ProfileItem label="Daily Calories" value={calories ? `${calories} kcal` : "-"} />
        <ProfileItem label="Protein Target" value={protein ? `${protein} g/day` : "-"} />
      </Card>

      <Card>
        <SectionTitle title="Workout Plan" />
        <ProfileItem label="Plan" value={workoutPlan.name} />
        <ProfileItem label="Days / Week" value={`${workoutPlan.daysPerWeek}`} />
        <ProfileItem label="Split" value={workoutPlan.split} />
        <ProfileItem label="Cardio" value={workoutPlan.cardio} />
        <ProfileItem label="Focus" value={workoutPlan.description} />
      </Card>

      <Card>
        <SectionTitle title="Progress Tracking" />
        <ProfileItem label="Current Weight" value={`${weight} kg`} />
        <ProfileItem label="Target Weight" value={`${targetWeight} kg`} />
        <ProfileItem
          label="Remaining Weight"
          value={weightRemaining ? `${weightRemaining} kg` : "-"}
        />
        <ProfileItem label="Estimated Timeline" value={estimatedTimeline || "-"} />
      </Card>
    </ScrollView>
  );
}

function AnimatedProgressCard({
  delay,
  label,
  value,
  detail,
  progress,
}: {
  delay: number;
  label: string;
  value: string;
  detail: string;
  progress: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
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
      <Card style={{ minHeight: 150, padding: 18 }}>
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
            fontSize: 28,
            fontWeight: "800",
            marginBottom: 6,
          }}
        >
          {value}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            color: "#8E8E8E",
            fontSize: 13,
            lineHeight: 18,
            minHeight: 36,
          }}
        >
          {detail}
        </Text>
        <View
          style={{
            height: 7,
            backgroundColor: "#262626",
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
      </Card>
    </Animated.View>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#242424",
      }}
    >
      <Text
        style={{
          color: "#777777",
          fontSize: 14,
          marginBottom: 5,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          color: "white",
          fontSize: 17,
          fontWeight: "700",
          lineHeight: 24,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
