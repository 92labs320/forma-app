import { Text, View } from "react-native";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          color: "#00FFB2",
          fontSize: 18,
          fontWeight: "800",
        }}
      >
        {title}
      </Text>

      {subtitle ? (
        <Text
          style={{
            color: "#8E8E8E",
            fontSize: 14,
            lineHeight: 20,
            marginTop: 6,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
