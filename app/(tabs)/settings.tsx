import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { useOnboardingStore } from "../../store/onboardingStore";
import { useProgressStore } from "../../store/progressStore";
import { useWorkoutStore } from "../../store/workoutStore";

export default function Settings() {
  const goal = useOnboardingStore((state) => state.goal);
  const weight = useOnboardingStore((state) => state.weight);
  const targetWeight = useOnboardingStore((state) => state.targetWeight);
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

  const showFormaProInfo = () => {
    Alert.alert(
      "FORMA Pro",
      "Premium features are not available yet."
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B0B0B" }}
      contentContainerStyle={{
        padding: 24,
        paddingTop: 72,
        paddingBottom: 92,
      }}
    >
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            color: "white",
            fontSize: 34,
            fontWeight: "800",
            marginBottom: 8,
          }}
        >
          Settings
        </Text>

        <Text style={{ color: "#8E8E8E", fontSize: 16, lineHeight: 22 }}>
          Manage your profile and app preferences.
        </Text>
      </View>

      <Card title="Profile">
        <Item label="Goal" value={goal || "-"} />
        <Item label="Current Weight" value={weight ? `${weight} kg` : "-"} />
        <Item label="Target Weight" value={targetWeight ? `${targetWeight} kg` : "-"} />
      </Card>

      <Card title="Preferences">
        <Item label="Notifications" value="Off" />
        <Item label="Units" value="kg / lbs" />
      </Card>

      <Card title="Premium">
        <Pressable
          onPress={showFormaProInfo}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "800",
                marginBottom: 6,
              }}
            >
              FORMA Pro
            </Text>

            <Text style={{ color: "#8E8E8E", fontSize: 14, lineHeight: 20 }}>
              Advanced insights and personalized tools for long-term consistency.
            </Text>
          </View>

          <Text
            style={{
              color: "#666666",
              fontSize: 26,
              fontWeight: "300",
              lineHeight: 28,
            }}
          >
            ›
          </Text>
        </Pressable>
      </Card>

      <Card title="App">
        <Item label="Version" value="1.0" />
        <Item label="Privacy Policy" value="Available soon" />
        <Item label="Contact Support" value="support@forma.app" />
      </Card>

      <Card title="Danger Zone">
        <DangerButton label="Reset Profile" onPress={confirmResetProfile} />
        <DangerButton label="Reset Progress" onPress={confirmResetProgress} />
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
        backgroundColor: "#131313",
        paddingHorizontal: 18,
        paddingVertical: 18,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#242424",
        marginBottom: 18,
        shadowColor: "#000000",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 1,
      }}
    >
      <Text
        style={{
          color: "#00FFB2",
          fontSize: 13,
          fontWeight: "800",
          letterSpacing: 0.7,
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        {title}
      </Text>

      {children}
    </View>
  );
}

function DangerButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: "#111111",
        borderWidth: 1,
        borderColor: "rgba(255, 92, 92, 0.36)",
        paddingVertical: 13,
        paddingHorizontal: 16,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 10,
      }}
    >
      <Text
        style={{
          color: "#D86B6B",
          fontWeight: "800",
          fontSize: 14,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.032)",
      }}
    >
      <Text
        style={{
          color: "#777777",
          fontSize: 13,
          fontWeight: "700",
          marginBottom: 5,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          color: "white",
          fontSize: 16,
          fontWeight: "700",
          lineHeight: 22,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
