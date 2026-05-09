import { useEffect, useRef } from "react";
import { router } from "expo-router";

import {
  Animated,
  View,
  Text,
  Image,
} from "react-native";

import { PrimaryButton } from "../components/ui/PrimaryButton";

export default function Index() {
  const entranceOpacity = useRef(new Animated.Value(0)).current;
  const entranceTranslateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entranceOpacity, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(entranceTranslateY, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
    ]).start();
  }, [entranceOpacity, entranceTranslateY]);

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
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "#0B0B0B",
        }}
      >
        <View
          style={{
            flex: 0.38,
            backgroundColor: "#111111",
            opacity: 0.9,
          }}
        />
        <View
          style={{
            flex: 0.34,
            backgroundColor: "#0B0B0B",
          }}
        />
        <View
          style={{
            flex: 0.28,
            backgroundColor: "#070707",
          }}
        />
      </View>

      <Animated.View
        style={{
          width: "100%",
          alignItems: "center",
          opacity: entranceOpacity,
          transform: [
            { translateY: -34 },
            { translateY: entranceTranslateY },
          ],
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
            color: "#EDEDED",
            fontSize: 17,
            fontWeight: "600",
            textAlign: "center",
            marginBottom: 8,
            lineHeight: 24,
          }}
        >
          Fitness without overwhelm.
        </Text>

        <Text
          style={{
            color: "#9A9A9A",
            fontSize: 15,
            textAlign: "center",
            marginBottom: 40,
            lineHeight: 22,
          }}
        >
          Build consistency. Transform your body.
        </Text>

        <PrimaryButton
          onPress={() => router.push("/onboarding")}
          style={{
            minWidth: 164,
            shadowOpacity: 0.14,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          Start
        </PrimaryButton>
      </Animated.View>
    </View>
  );
}
