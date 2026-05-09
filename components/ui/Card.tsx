import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, style }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: "#151515",
          padding: 22,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: "#262626",
          shadowColor: "#000000",
          shadowOpacity: 0.28,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 12 },
          elevation: 5,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
