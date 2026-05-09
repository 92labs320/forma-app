export type NutritionPlan = {
  waterGoal: string;
  mealStructure: string[];
  recommendedFoods: string[];
  avoid: string[];
};

export function getNutritionPlan(goal: string): NutritionPlan {
  if (goal === "Lose Fat") {
    return {
      waterGoal: "2.5–3L per day",
      mealStructure: [
        "High-protein breakfast",
        "Lean protein + vegetables for lunch",
        "Light dinner with protein and fiber",
        "1 controlled snack if needed",
      ],
      recommendedFoods: [
        "Chicken breast",
        "Eggs",
        "Greek yogurt",
        "Fish",
        "Vegetables",
        "Berries",
        "Oats",
      ],
      avoid: [
        "Sugary drinks",
        "Ultra-processed snacks",
        "Large late-night meals",
        "Liquid calories",
      ],
    };
  }

  if (goal === "Build Muscle") {
    return {
      waterGoal: "3–3.5L per day",
      mealStructure: [
        "Protein + carbs breakfast",
        "Balanced lunch with rice/pasta/potatoes",
        "Pre-workout carbs",
        "High-protein dinner",
      ],
      recommendedFoods: [
        "Rice",
        "Pasta",
        "Potatoes",
        "Chicken",
        "Beef",
        "Eggs",
        "Greek yogurt",
        "Bananas",
      ],
      avoid: [
        "Skipping meals",
        "Very low calorie diets",
        "Low protein intake",
        "Inconsistent eating",
      ],
    };
  }

  return {
    waterGoal: "2.5–3L per day",
    mealStructure: [
      "Protein at every meal",
      "Carbs around workouts",
      "Vegetables twice per day",
      "Simple evening meal",
    ],
    recommendedFoods: [
      "Eggs",
      "Chicken",
      "Fish",
      "Rice",
      "Oats",
      "Vegetables",
      "Greek yogurt",
    ],
    avoid: [
      "Random snacking",
      "High sugar drinks",
      "Skipping protein",
      "Overeating on weekends",
    ],
  };
}