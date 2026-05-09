import { ScrollView, Text, View } from "react-native";

import { useOnboardingStore } from "../../store/onboardingStore";
import {
  calculateCalories,
  calculateProtein,
} from "../../lib/fitnessCalculator";
import { getNutritionPlan } from "../../data/nutritionPlans";

export default function Nutrition() {
  const { goal, gender, age, height, weight } = useOnboardingStore();

  const calories = calculateCalories(gender, age, weight, height, goal);
  const protein = calculateProtein(weight);
  const plan = getNutritionPlan(goal);

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
        Nutrition
      </Text>

      <Text style={{ color: "#9A9A9A", fontSize: 16, marginBottom: 32 }}>
        Simple nutrition targets based on your profile.
      </Text>

      <Card title="Daily Targets">
        <Item label="Calories" value={calories ? `${calories} kcal` : "-"} />
        <Item label="Protein" value={protein ? `${protein} g/day` : "-"} />
        <Item label="Water" value={plan.waterGoal} />
      </Card>

      <Card title="Meal Structure">
        {plan.mealStructure.map((item, index) => (
          <Bullet key={index} text={item} />
        ))}
      </Card>

      <Card title="Recommended Foods">
        {plan.recommendedFoods.map((item) => (
          <Bullet key={item} text={item} />
        ))}
      </Card>

      <Card title="Avoid">
        {plan.avoid.map((item) => (
          <Bullet key={item} text={item} />
        ))}
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

function Bullet({ text }: { text: string }) {
  return (
    <Text style={{ color: "white", fontSize: 16, marginBottom: 12 }}>
      • {text}
    </Text>
  );
}