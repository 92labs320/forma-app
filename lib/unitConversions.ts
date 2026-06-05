export type UnitSystem = "metric" | "imperial";

function toFinitePositiveNumber(value: unknown) {
  const numericValue =
    typeof value === "string" && value.trim() === "" ? NaN : Number(value);

  return Number.isFinite(numericValue) && numericValue > 0
    ? numericValue
    : null;
}

export function getDefaultUnitSystem(): UnitSystem {
  const locale =
    Intl.DateTimeFormat().resolvedOptions().locale ||
    Intl.NumberFormat().resolvedOptions().locale;

  return locale.toUpperCase().includes("-US") ? "imperial" : "metric";
}

export function kgToLbs(kg: unknown) {
  const value = toFinitePositiveNumber(kg);
  if (value === null) return "";

  return (value * 2.20462).toFixed(0);
}

export function lbsToKg(lbs: unknown) {
  const value = toFinitePositiveNumber(lbs);
  if (value === null) return "";

  return (value / 2.20462).toFixed(1);
}

export function cmToFeetInches(cm: unknown) {
  const value = toFinitePositiveNumber(cm);
  if (value === null) return { feet: "", inches: "" };

  const totalInches = Math.round(value / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;

  return { feet: String(feet), inches: String(inches) };
}

export function feetInchesToCm(feet: string | number, inches: string | number) {
  const feetValue = toFinitePositiveNumber(feet) ?? 0;
  const inchesValue = toFinitePositiveNumber(inches) ?? 0;

  if (!feetValue && !inchesValue) return "";

  return ((feetValue * 12 + inchesValue) * 2.54).toFixed(1);
}

export function formatWeight(
  weightKg: unknown,
  unitSystem: UnitSystem,
  includeSecondary = false
) {
  const value = toFinitePositiveNumber(weightKg);
  if (value === null) return "-";

  if (unitSystem === "imperial") {
    return `${kgToLbs(value)} lbs`;
  }

  const kg = value.toFixed(1).replace(/\.0$/, "");
  return includeSecondary ? `${kg} kg (${kgToLbs(value)} lbs)` : `${kg} kg`;
}

export function formatWeightInput(weightKg: unknown, unitSystem: UnitSystem) {
  const value = toFinitePositiveNumber(weightKg);
  if (value === null) return "";

  return unitSystem === "imperial"
    ? kgToLbs(value)
    : value.toFixed(1).replace(/\.0$/, "");
}

export function normalizeWeightInput(
  weight: string,
  unitSystem: UnitSystem
) {
  if (!weight.trim()) return "";

  return unitSystem === "imperial" ? lbsToKg(weight) : weight;
}
