import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { NutritionGoals } from "../types/models";
import { saveData, getData } from "../utils/storage";

const STORAGE_KEY = "FUELUP_GOALS";

const defaultGoals: NutritionGoals = {
  calories: 2400,
  protein: 98,
  carbs: 320,
  fats: 70,
};

const GoalsContext = createContext<any>(null);

export const GoalsProvider = ({ children }: any) => {
  const [goals, setGoals] = useState<NutritionGoals>(defaultGoals);
  const [isLoaded, setIsLoaded] = useState(false);

  // 🔹 Load once
  useEffect(() => {
    const load = async () => {
      const stored = await getData(STORAGE_KEY);
      if (stored) setGoals(stored);
      setIsLoaded(true);
    };
    load();
  }, []);

  // 🔹 Save on change
  useEffect(() => {
    if (!isLoaded) return;
    saveData(STORAGE_KEY, goals);
  }, [goals, isLoaded]);

  const value = useMemo(() => ({ goals, setGoals }), [goals]);

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
};

export const useGoals = () => useContext(GoalsContext);