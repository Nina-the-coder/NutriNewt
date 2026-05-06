import { useEffect, useState } from "react";
import { DailyFoodEntry } from "../../../../../types/models";

export default function useMealPersistence({
  visible,
  mealType,
  currentMealItems,
}: {
  visible: boolean;
  mealType: string | null;
  currentMealItems: DailyFoodEntry[];
}) {
  const [persistedMealType, setPersistedMealType] =
    useState(mealType);

  const [persistedMealItems, setPersistedMealItems] =
    useState<DailyFoodEntry[]>([]);

  useEffect(() => {
    if (visible && mealType) {
      setPersistedMealType(mealType);
    }
  }, [visible, mealType]);

  useEffect(() => {
    if (visible) {
      setPersistedMealItems(currentMealItems);
    }
  }, [visible, currentMealItems]);

  return {
    persistedMealType,
    persistedMealItems,
  };
}