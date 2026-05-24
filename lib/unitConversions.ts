export type UnitSystem = "metric" | "imperial";

export function getDefaultUnitSystem(): UnitSystem {
  const locale =
    Intl.DateTimeFormat().resolvedOptions().locale ||
    Intl.NumberFormat().resolvedOptions().locale;

  return locale.toUpperCase().includes("-US") ? "imperial" : "metric";
}

export function kgToLbs(kg: string | number) {
  const value = Number(kg);
  if (!value) return "";

  return (value * 2.20462).toFixed(0);
}

export function lbsToKg(lbs: string | number) {
  const value = Number(lbs);
  if (!value) return "";

  return (value / 2.20462).toFixed(1);
}

export function cmToFeetInches(cm: string | number) {
  const value = Number(cm);
  if (!value) return { feet: "", inches: "" };

  const totalInches = Math.round(value / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;

  return { feet: String(feet), inches: String(inches) };
}

export function feetInchesToCm(feet: string | number, inches: string | number) {
  const feetValue = Number(feet);
  const inchesValue = Number(inches);

  if (!feetValue && !inchesValue) return "";

  return ((feetValue * 12 + inchesValue) * 2.54).toFixed(1);
}

export function formatWeight(
  weightKg: string,
  unitSystem: UnitSystem,
  includeSecondary = false
) {
  if (!weightKg) return "-";

  if (unitSystem === "imperial") {
    return `${kgToLbs(weightKg)} lbs`;
  }

  const kg = Number(weightKg).toFixed(1).replace(/\.0$/, "");
  return includeSecondary ? `${kg} kg (${kgToLbs(weightKg)} lbs)` : `${kg} kg`;
}

export function formatWeightInput(weightKg: string, unitSystem: UnitSystem) {
  if (!weightKg) return "";

  return unitSystem === "imperial"
    ? kgToLbs(weightKg)
    : Number(weightKg).toFixed(1).replace(/\.0$/, "");
}

export function normalizeWeightInput(
  weight: string,
  unitSystem: UnitSystem
) {
  if (!weight.trim()) return "";

  return unitSystem === "imperial" ? lbsToKg(weight) : weight;
}
