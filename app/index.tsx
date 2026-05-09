import { router } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B0B0B",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 12,
        }}
      >
        Fitness Transform
      </Text>

      <Text
        style={{
          color: "#9A9A9A",
          fontSize: 16,
          textAlign: "center",
          marginBottom: 32,
        }}
      >
        A simple transformation plan to lose fat, build muscle, and track your progress.
      </Text>

      <Pressable
        onPress={() => router.push("/onboarding")}
        style={{
          backgroundColor: "#00FFB2",
          paddingVertical: 16,
          paddingHorizontal: 40,
          borderRadius: 16,
        }}
      >
        <Text
          style={{
            color: "#0B0B0B",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Start
        </Text>
      </Pressable>
    </View>
  );
}