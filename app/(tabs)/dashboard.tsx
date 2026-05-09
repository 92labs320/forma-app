import { router } from "expo-router";
import { View, Text, ScrollView, Pressable } from "react-native";

import { useOnboardingStore } from "../../store/onboardingStore";

import {
  calculateBMI,
  calculateCalories,
  calculateProtein,
  getFitnessProfile,
  calculateWeightRemaining,
  estimateTimeline,
} from "../../lib/fitnessCalculator";

import { getWorkoutPlan } from "../../data/workoutPlans";

export default function Dashboard() {
  const {
    goal,
    gender,
    age,
    height,
    weight,
    targetWeight,
  } = useOnboardingStore();

  const bmi = calculateBMI(weight, height);

  const calories = calculateCalories(
    gender,
    age,
    weight,
    height,
    goal
  );

  const protein = calculateProtein(weight);

  const fitnessProfile = getFitnessProfile(bmi);

  const workoutPlan = getWorkoutPlan(goal);

  const weightRemaining = calculateWeightRemaining(
    weight,
    targetWeight
  );

  const estimatedTimeline = estimateTimeline(
    weight,
    targetWeight
  );

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#0B0B0B",
      }}
      contentContainerStyle={{
        padding: 24,
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 32,
        }}
      >
        Dashboard
      </Text>

      {/* SMART PLAN */}
      <Card title="Smart Plan">
        <ProfileItem
          label="Fitness Profile"
          value={fitnessProfile}
        />

        <ProfileItem
          label="BMI"
          value={bmi ? String(bmi) : "-"}
        />

        <ProfileItem
          label="Daily Calories"
          value={calories ? `${calories} kcal` : "-"}
        />

        <ProfileItem
          label="Protein Target"
          value={protein ? `${protein} g/day` : "-"}
        />
      </Card>

      {/* WORKOUT PLAN */}
      <Card title="Workout Plan">
        <ProfileItem
          label="Plan"
          value={workoutPlan.name}
        />

        <ProfileItem
          label="Days / Week"
          value={`${workoutPlan.daysPerWeek}`}
        />

        <ProfileItem
          label="Split"
          value={workoutPlan.split}
        />

        <ProfileItem
          label="Cardio"
          value={workoutPlan.cardio}
        />

        <ProfileItem
          label="Focus"
          value={workoutPlan.description}
        />

        <Pressable
          onPress={() => router.push("/(tabs)/workout")}
style={{
            backgroundColor: "#00FFB2",
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <Text
            style={{
              color: "#0B0B0B",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            View Workouts
          </Text>
        </Pressable>
      </Card>

      {/* PROGRESS */}
      <Card title="Progress Tracking">
        <ProfileItem
          label="Current Weight"
          value={`${weight} kg`}
        />

        <ProfileItem
          label="Target Weight"
          value={`${targetWeight} kg`}
        />

        <ProfileItem
          label="Remaining Weight"
          value={
            weightRemaining
              ? `${weightRemaining} kg`
              : "-"
          }
        />

        <ProfileItem
          label="Estimated Timeline"
          value={estimatedTimeline || "-"}
        />
      </Card>
    </ScrollView>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: "#151515",
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#262626",
        marginBottom: 20,
      }}
    >
      <Text
        style={{
          color: "#00FFB2",
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        {title}
      </Text>

      {children}
    </View>
  );
}

function ProfileItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        marginBottom: 18,
      }}
    >
      <Text
        style={{
          color: "#777777",
          fontSize: 14,
          marginBottom: 4,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: "600",
        }}
      >
        {value}
      </Text>
    </View>
  );
}