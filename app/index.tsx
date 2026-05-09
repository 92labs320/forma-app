import { router } from "expo-router";

import {
  View,
  Text,
  Image,
} from "react-native";

import { PrimaryButton } from "../components/ui/PrimaryButton";

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
      <Image
        source={require("./assets/images/icon.png")}
        style={{
          width: 120,
          height: 120,
          borderRadius: 28,
          marginBottom: 24,
        }}
      />

      <Text
        style={{
          color: "white",
          fontSize: 48,
          fontWeight: "bold",
          marginBottom: 12,
          letterSpacing: 1,
        }}
      >
        FORMA
      </Text>

      <Text
        style={{
          color: "#9A9A9A",
          fontSize: 16,
          textAlign: "center",
          marginBottom: 40,
          lineHeight: 24,
        }}
      >
        Minimal fitness. Maximum consistency.
      </Text>

      <PrimaryButton
        onPress={() => router.push("/onboarding")}
        style={{
          minWidth: 180,
        }}
      >
        Start
      </PrimaryButton>
    </View>
  );
}
