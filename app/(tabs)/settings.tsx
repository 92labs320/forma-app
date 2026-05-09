import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { useOnboardingStore } from "../../store/onboardingStore";
import { useProgressStore } from "../../store/progressStore";
import { useWorkoutStore } from "../../store/workoutStore";

export default function Settings() {
  const resetProfile = useOnboardingStore((state) => state.reset);
  const progressEntries = useProgressStore((state) => state.entries);
  const removeEntry = useProgressStore((state) => state.removeEntry);
  const completedWorkouts = useWorkoutStore((state) => state.completedWorkouts);
  const toggleWorkout = useWorkoutStore((state) => state.toggleWorkout);

  const handleResetProgress = () => {
    progressEntries.forEach((entry) => removeEntry(entry.id));
  };

  const handleResetWorkouts = () => {
    completedWorkouts.forEach((workoutDay) => toggleWorkout(workoutDay));
  };

  const confirmResetProfile = () => {
    Alert.alert(
      "Reset Profile",
      "This will clear your onboarding profile.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: resetProfile },
      ]
    );
  };

  const confirmResetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "This will clear your progress history and completed workouts.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            handleResetProgress();
            handleResetWorkouts();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B0B0B" }}
      contentContainerStyle={{
        padding: 24,
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <Text style={{ color: "white", fontSize: 32, fontWeight: "bold", marginBottom: 12 }}>
        Settings
      </Text>

      <Text style={{ color: "#9A9A9A", fontSize: 16, marginBottom: 32 }}>
        Manage your profile, progress, and app preferences.
      </Text>

      <Card title="Profile">
        <Button label="Reset Profile" danger onPress={confirmResetProfile} />
      </Card>

      <Card title="Progress">
        <Button label="Reset Progress" danger onPress={confirmResetProgress} />
      </Card>

      <Card title="Premium">
        <Text style={{ color: "white", fontSize: 17, fontWeight: "600", marginBottom: 8 }}>
          Pro Plan
        </Text>
        <Text style={{ color: "#9A9A9A", fontSize: 15, lineHeight: 22 }}>
          Future premium features: advanced programs, meal templates, weekly reports, and transformation plans.
        </Text>
      </Card>

      <Card title="App">
        <Item label="Version" value="0.1.0 MVP" />
        <Item label="Build" value="Expo Prototype" />
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
      <Text style={{ color: "#00FFB2", fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
        {title}
      </Text>

      {children}
    </View>
  );
}

function Button({
  label,
  danger,
  onPress,
}: {
  label: string;
  danger?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: danger ? "#2A1111" : "#00FFB2",
        borderWidth: 1,
        borderColor: danger ? "#FF5C5C" : "#00FFB2",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: danger ? "#FF5C5C" : "#0B0B0B",
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Item({ label, value }: { label: string; value: string }) {
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