export type WorkoutPlan = {
  name: string;
  goal: string;
  daysPerWeek: number;
  split: string;
  cardio: string;
  description: string;
};

export function getWorkoutPlan(goal: string): WorkoutPlan {
  if (goal === "Lose Fat") {
    return {
      name: "Beginner Fat Loss Plan",
      goal,
      daysPerWeek: 3,
      split: "Full Body",
      cardio: "20–30 min walking after workouts",
      description: "Simple full-body workouts focused on consistency, calorie burn, and strength basics.",
    };
  }

  if (goal === "Build Muscle") {
    return {
      name: "Lean Muscle Builder",
      goal,
      daysPerWeek: 5,
      split: "Push / Pull / Legs",
      cardio: "1–2 light cardio sessions per week",
      description: "Progressive strength training focused on muscle growth and compound lifts.",
    };
  }

  if (goal === "Body Recomposition") {
    return {
      name: "Recomposition Plan",
      goal,
      daysPerWeek: 4,
      split: "Upper / Lower",
      cardio: "2 moderate cardio sessions per week",
      description: "Balanced training to build muscle while slowly reducing body fat.",
    };
  }

  return {
    name: "General Fitness Plan",
    goal,
    daysPerWeek: 4,
    split: "Full Body + Conditioning",
    cardio: "2–3 cardio sessions per week",
    description: "A balanced plan to improve strength, endurance, and overall fitness.",
  };
}