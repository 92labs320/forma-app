import { View, Text } from "react-native";

export default function Screen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0B", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "white", fontSize: 24 }}>Nutrition</Text>
    </View>
  );
}