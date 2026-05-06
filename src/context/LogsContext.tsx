import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { DailyLog, MealType, DailyFoodEntry, Meals } from "../types/models";
import { getTodayDate } from "../utils/date";
import { saveData, getData } from "../utils/storage";
import { useProfile } from "./ProfileContext";

const STORAGE_KEY = "FUELUP_DAILY_LOGS";

const LogsContext = createContext<any>(null);

export const LogsProvider = ({ children }: any) => {
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [today, setToday] = useState(getTodayDate());
  const { goals, profile } = useProfile();
  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = getTodayDate();

      setToday((prev) => {
        if (prev !== currentDate) {
          return currentDate;
        }

        return prev;
      });
    }, 60000); // check every minute

    return () => clearInterval(interval);
  }, []);

  /* 🔹 HELPERS */
  const calculateTotals = (meals: Meals) => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    Object.values(meals).forEach((mealArray) => {
      mealArray.forEach((item: DailyFoodEntry) => {
        totalCalories += item.calories;
        totalProtein += item.protein;
        totalCarbs += item.carbs;
        totalFats += item.fats;
      });
    });

    return { totalCalories, totalProtein, totalCarbs, totalFats };
  };

  /* 🔹 LOAD */
  useEffect(() => {
    const load = async () => {
      const stored = await getData(STORAGE_KEY);
      if (stored) setDailyLogs(stored);
      setIsLoaded(true);
    };
    load();
  }, []);

  /* 🔹 SAVE */
  useEffect(() => {
    if (!isLoaded) return;
    saveData(STORAGE_KEY, dailyLogs);
  }, [dailyLogs, isLoaded]);

  /* 🔹 ENSURE TODAY LOG */
  useEffect(() => {
    if (!isLoaded) return;

    setDailyLogs((prev) => {
      const exists = prev.find((l) => l.date === today);

      if (exists) return prev;

      return [
        ...prev,
        {
          id: `${today}-${Date.now()}`,
          date: today,

          meals: {
            breakfast: [],
            lunch: [],
            snacks: [],
            dinner: [],
          },

          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFats: 0,

          goalSnapshot: {
            calories: goals?.calories ?? 0,
            protein: goals?.protein ?? 0,
            carbs: goals?.carbs ?? 0,
            fats: goals?.fats ?? 0,

            goalType: profile?.goalType ?? "maintain",
          },
        },
      ];
    });
  }, [isLoaded, today, goals, profile]);
  
  /* 🔹 ACTIONS */

  const addFoodToMeal = (mealType: MealType, entry: DailyFoodEntry) => {
    setDailyLogs((logs) =>
      logs.map((log) => {
        if (log.date !== today) return log;

        const meals = {
          ...log.meals,
          [mealType]: [...log.meals[mealType], entry],
        };

        return {
          ...log,
          meals,
          ...calculateTotals(meals),
        };
      }),
    );
  };

  const removeFoodFromMeal = (mealType: MealType, entryId: string) => {
    setDailyLogs((logs) =>
      logs.map((log) => {
        if (log.date !== today) return log;

        const meals = {
          ...log.meals,
          [mealType]: log.meals[mealType].filter((e) => e.id !== entryId),
        };

        return {
          ...log,
          meals,
          ...calculateTotals(meals),
        };
      }),
    );
  };

  const getTodayLog = useCallback(() => {
    return dailyLogs.find((log) => log.date === today);
  }, [dailyLogs, today]);

  const value = useMemo(
    () => ({
      dailyLogs,
      addFoodToMeal,
      removeFoodFromMeal,
      getTodayLog,
    }),
    [dailyLogs, today],
  );

  return <LogsContext.Provider value={value}>{children}</LogsContext.Provider>;
};

export const useLogs = () => useContext(LogsContext);
