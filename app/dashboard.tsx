import { View, Text } from "react-native";

import { useOnboardingStore } from "../store/onboardingStore";
import {
  calculateBMI,
  calculateCalories,
  calculateProtein,
  getFitnessProfile,
} from "../lib/fitnessCalculator";
import { getWorkoutPlan } from "../data/workoutPlans";

export default function Dashboard() {
  const { goal, gender, age, height, weight } = useOnboardingStore();

  const bmi = calculateBMI(weight, height);
  const calories = calculateCalories(gender, age, weight, height, goal);
  const protein = calculateProtein(weight);
  const fitnessProfile = getFitnessProfile(bmi);
  const workoutPlan = getWorkoutPlan(goal);

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0B", padding: 24 }}>
      <Text
        style={{
          color: "white",
          fontSize: 32,
          fontWeight: "bold",
          marginTop: 80,
          marginBottom: 32,
        }}
      >
        Dashboard
      </Text>

      <Card title="Smart Plan">
        <ProfileItem label="Fitness Profile" value={fitnessProfile} />
        <ProfileItem label="BMI" value={bmi ? String(bmi) : "-"} />
        <ProfileItem
          label="Daily Calories"
          value={calories ? `${calories} kcal` : "-"}
        />
        <ProfileItem
          label="Protein Target"
          value={protein ? `${protein} g/day` : "-"}
        />
      </Card>

      <Card title="Workout Plan">
        <ProfileItem label="Plan" value={workoutPlan.name} />
        <ProfileItem label="Days / Week" value={`${workoutPlan.daysPerWeek}`} />
        <ProfileItem label="Split" value={workoutPlan.split} />
        <ProfileItem label="Cardio" value={workoutPlan.cardio} />
        <ProfileItem label="Focus" value={workoutPlan.description} />
      </Card>
    </View>
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

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ color: "#777777", fontSize: 14, marginBottom: 4 }}>
        {label}
      </Text>

      <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
        {value}
      </Text>
    </View>
  );
}