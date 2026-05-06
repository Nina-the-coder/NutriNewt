import { ProfileData, MacroGoals } from "../types/nutrition";

const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  athlete: 1.9,
};

export const calculateMacros = (profile: ProfileData): MacroGoals => {
  const { age, gender, height, weight, activityLevel, goalType } = profile;

  // BMR
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  // TDEE
  const tdee = bmr * activityMultipliers[activityLevel];

  // Goal Adjustment
  let targetCalories = tdee;

  if (goalType === "lose") targetCalories -= 400;
  if (goalType === "gain") targetCalories += 400;

  targetCalories = Math.round(targetCalories);

  // Protein: 2g per kg
  const protein = Math.round(weight * 2);

  // Fats: 25% of calories
  const fats = Math.round((targetCalories * 0.25) / 9);

  // Remaining calories to carbs
  const remainingCalories =
    targetCalories - protein * 4 - fats * 9;

  const carbs = Math.round(remainingCalories / 4);

  return {
    calories: targetCalories,
    protein,
    carbs,
    fats,
  };
};