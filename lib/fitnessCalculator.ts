function toFinitePositiveNumber(value: unknown) {
  const numericValue =
    typeof value === "string" && value.trim() === "" ? NaN : Number(value);

  return Number.isFinite(numericValue) && numericValue > 0
    ? numericValue
    : null;
}

export function calculateBMI(weightKg: unknown, heightCm: unknown) {
  const weight = toFinitePositiveNumber(weightKg);
  const heightCmValue = toFinitePositiveNumber(heightCm);

  if (weight === null || heightCmValue === null) return null;

  const height = heightCmValue / 100;
  return Number((weight / (height * height)).toFixed(1));
}

export function calculateCalories(
  gender: string,
  age: unknown,
  weightKg: unknown,
  heightCm: unknown,
  goal: string
) {
  const ageNumber = toFinitePositiveNumber(age);
  const weight = toFinitePositiveNumber(weightKg);
  const height = toFinitePositiveNumber(heightCm);

  if (ageNumber === null || weight === null || height === null) return null;

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

export function calculateProtein(weightKg: unknown) {
  const weight = toFinitePositiveNumber(weightKg);

  if (weight === null) return null;

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
  currentWeight: unknown,
  targetWeight: unknown
) {
  const current = toFinitePositiveNumber(currentWeight);
  const target = toFinitePositiveNumber(targetWeight);

  if (current === null || target === null) return null;

  return Math.abs(current - target).toFixed(1);
}

export function estimateTimeline(
  currentWeight: unknown,
  targetWeight: unknown
) {
  const remaining = calculateWeightRemaining(
    currentWeight,
    targetWeight
  );

  if (!remaining) return null;

  const remainingValue = toFinitePositiveNumber(remaining);

  if (remainingValue === null) return null;

  const weeks = Math.ceil(remainingValue / 0.5);

  return `${weeks} weeks`;
}
