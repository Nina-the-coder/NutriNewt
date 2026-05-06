export type Unit = 'g' | 'ml' | 'pcs';
export type MealType = "breakfast" | "lunch" | "snacks" | "dinner";

export interface InventoryItem {
  id: string;
  name: string;

  baseQuantity: number; // e.g. 100
  unit: Unit;           // g/ml/pcs

  calories: number;
  protein: number;
  carbs: number;
  fats: number;

  isFavorite?: boolean;

  createdAt: number;
  updatedAt: number;
}

export interface DailyFoodEntry {
  id: string;

  inventoryItemId: string; // link to inventory

  name: string; // snapshot
  quantity: number;
  unit: Unit;

  calories: number;
  protein: number;
  carbs: number;
  fats: number;

  createdAt: number;
}

export interface Meals {
  breakfast: DailyFoodEntry[];
  lunch: DailyFoodEntry[];
  snacks: DailyFoodEntry[];
  dinner: DailyFoodEntry[];
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  meals: Meals;

  totalCalories?: number; // cache
  totalProtein?: number;
  totalCarbs?: number;
  totalFats?: number;
}

export type RecentMap = {
  [inventoryItemId: string]: DailyFoodEntry;
};

// -------------------------------------------------------

export interface ProfileData {
  age: number;
  gender: "male" | "female";
  height: number;
  weight: number;
  activityLevel: "sedentary" | "light" | "moderate" | "very" | "athlete";
  goalType: "lose" | "maintain" | "gain";
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}
