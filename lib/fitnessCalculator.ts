export function calculateBMI(weightKg: string, heightCm: string) {
  const weight = Number(weightKg);
  const height = Number(heightCm) / 100;

  if (!weight || !height) return null;

  return Number((weight / (height * height)).toFixed(1));
}

export function calculateCalories(
  gender: string,
  age: string,
  weightKg: string,
  heightCm: string,
  goal: string
) {
  const ageNumber = Number(age);
  const weight = Number(weightKg);
  const height = Number(heightCm);

  if (!ageNumber || !weight || !height) return null;

  let bmr = 0;

  if (gender === "Male") {
    bmr = 10 * weight + 6.25 * height - 5 * ageNumber + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * ageNumber - 161;
  }

  let calories = bmr * 1.4;

  if (goal === "Lose Fat") calories -= 400;
  if (goal === "Build Muscle") calories += 300;
  if (goal === "Body Recomposition") calories -= 150;

  return Math.round(calories);
}

export function calculateProtein(weightKg: string) {
  const weight = Number(weightKg);

  if (!weight) return null;

  return Math.round(weight * 1.8);
}

export function getFitnessProfile(bmi: number | null) {
  if (!bmi) return "Unknown";

  if (bmi < 18.5) return "Lean / Hard Gainer";
  if (bmi >= 18.5 && bmi < 25) return "Balanced";
  if (bmi >= 25 && bmi < 30) return "Fat Loss Priority";

  return "High Fat Loss Priority";
}

export function calculateWeightRemaining(
  currentWeight: string,
  targetWeight: string
) {
  const current = Number(currentWeight);
  const target = Number(targetWeight);

  if (!current || !target) return null;

  return Math.abs(current - target).toFixed(1);
}

export function estimateTimeline(
  currentWeight: string,
  targetWeight: string
) {
  const remaining = calculateWeightRemaining(
    currentWeight,
    targetWeight
  );

  if (!remaining) return null;

  const weeks = Math.ceil(Number(remaining) / 0.5);

  return `${weeks} weeks`;
}