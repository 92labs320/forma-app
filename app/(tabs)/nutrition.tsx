import { ReactNode, useEffect, useRef } from "react";
import { Animated, ScrollView, Text, View } from "react-native";

import { useOnboardingStore } from "../../store/onboardingStore";
import {
  calculateCalories,
  calculateProtein,
} from "../../lib/fitnessCalculator";
import { getNutritionPlan } from "../../data/nutritionPlans";

export default function Nutrition() {
  const { goal, gender, age, height, weight } = useOnboardingStore();

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(12)).current;

  const calories = calculateCalories(gender, age, weight, height, goal);
  const protein = calculateProtein(weight);
  const plan = getNutritionPlan(goal);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      }),
      Animated.timing(screenTranslateY, {
        toValue: 0,
        duration: 520,
        useNativeDriver: true,
      }),
    ]).start();
  }, [screenOpacity, screenTranslateY]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B0B0B" }}
      contentContainerStyle={{
        padding: 24,
        paddingTop: 72,
        paddingBottom: 92,
      }}
    >
      <Animated.View
        style={{
          opacity: screenOpacity,
          transform: [{ translateY: screenTranslateY }],
        }}
      >
        <View style={{ marginBottom: 26 }}>
          <Text
            style={{
              color: "white",
              fontSize: 34,
              fontWeight: "800",
              marginBottom: 8,
            }}
          >
            Nutrition
          </Text>

          <Text
            style={{
              color: "#8E8E8E",
              fontSize: 16,
              lineHeight: 22,
            }}
          >
            Simple targets that support your training plan.
          </Text>
        </View>

        <Card accent>
          <SectionHeader
            title="Daily Targets"
            subtitle="A focused baseline for consistency."
          />

          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            <TargetTile
              label="Calories"
              value={calories ? `${calories}` : "-"}
              unit="kcal"
            />
            <TargetTile
              label="Protein"
              value={protein ? `${protein}` : "-"}
              unit="g/day"
            />
          </View>

          <View
            style={{
              backgroundColor: "#0B0B0B",
              borderRadius: 18,
              borderWidth: 1,
              borderColor: "#242424",
              padding: 18,
            }}
          >
            <Text
              style={{
                color: "#777777",
                fontSize: 13,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              Water
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "800",
              }}
            >
              {plan.waterGoal}
            </Text>
          </View>
        </Card>

        <Card>
          <SectionHeader
            title="Meal Structure"
            subtitle="Keep meals repeatable and easy to follow."
          />
          {plan.mealStructure.map((item, index) => (
            <NutritionRow key={item} index={index + 1} text={item} />
          ))}
        </Card>

        <Card>
          <SectionHeader title="Recommended Foods" />
          {plan.recommendedFoods.map((item, index) => (
            <NutritionRow key={item} index={index + 1} text={item} />
          ))}
        </Card>

        <Card>
          <SectionHeader title="Limit" />
          {plan.avoid.map((item, index) => (
            <NutritionRow key={item} index={index + 1} text={item} muted />
          ))}
        </Card>
      </Animated.View>
    </ScrollView>
  );
}

function Card({
  children,
  accent = false,
}: {
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <View
      style={{
        backgroundColor: "#131313",
        padding: 22,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: accent ? "rgba(0, 255, 178, 0.22)" : "#242424",
        marginBottom: 22,
        shadowColor: accent ? "#00FFB2" : "#000000",
        shadowOpacity: accent ? 0.08 : 0.22,
        shadowRadius: accent ? 16 : 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: accent ? 3 : 2,
      }}
    >
      {children}
    </View>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text
        style={{
          color: "#00FFB2",
          fontSize: 13,
          fontWeight: "800",
          letterSpacing: 0.7,
          textTransform: "uppercase",
          marginBottom: subtitle ? 7 : 0,
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
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

function TargetTile({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B0B0B",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#263A34",
        padding: 18,
      }}
    >
      <Text
        style={{
          color: "#777777",
          fontSize: 13,
          fontWeight: "700",
          marginBottom: 10,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "800",
          marginBottom: 4,
        }}
      >
        {value}
      </Text>

      <Text
        style={{
          color: "#00FFB2",
          fontSize: 13,
          fontWeight: "800",
        }}
      >
        {unit}
      </Text>
    </View>
  );
}

function NutritionRow({
  index,
  text,
  muted = false,
}: {
  index: number;
  text: string;
  muted?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        paddingVertical: 14,
        borderTopWidth: index === 1 ? 0 : 1,
        borderTopColor: "#242424",
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 999,
          backgroundColor: muted ? "#1B1B1B" : "rgba(0, 255, 178, 0.12)",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
        }}
      >
        <Text
          style={{
            color: muted ? "#8E8E8E" : "#00FFB2",
            fontSize: 12,
            fontWeight: "800",
          }}
        >
          {index}
        </Text>
      </View>

      <Text
        style={{
          flex: 1,
          color: muted ? "#B8B8B8" : "white",
          fontSize: 16,
          fontWeight: "600",
          lineHeight: 23,
        }}
      >
        {text}
      </Text>
    </View>
  );
}
