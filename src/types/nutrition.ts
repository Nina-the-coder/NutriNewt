export type Gender = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "very"
  | "athlete";

export type GoalType = "lose" | "maintain" | "gain";

export interface ProfileData {
  age: number;
  gender: Gender;
  height: number; // cm
  weight: number; // kg
  activityLevel: ActivityLevel;
  goalType: GoalType;
}

export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}