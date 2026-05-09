import { ReactNode, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleProp,
  Text,
  ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";

type PrimaryButtonProps = {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  children,
  onPress,
  disabled = false,
  style,
}: PrimaryButtonProps) {
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
    if (disabled) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale }],
          shadowColor: "#00FFB2",
          shadowOpacity: disabled ? 0 : 0.36,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 0 },
          elevation: disabled ? 0 : 8,
        },
        style,
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={() => animateScale(0.96)}
        onPressOut={() => animateScale(1)}
        disabled={disabled}
        style={{
          backgroundColor: disabled ? "#333333" : "#00FFB2",
          paddingVertical: 17,
          paddingHorizontal: 28,
          borderRadius: 18,
          alignItems: "center",
          borderWidth: 1,
          borderColor: disabled ? "#333333" : "rgba(255,255,255,0.18)",
        }}
      >
        <Text
          style={{
            color: disabled ? "#777777" : "#0B0B0B",
            fontSize: 16,
            fontWeight: "800",
          }}
        >
          {children}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
