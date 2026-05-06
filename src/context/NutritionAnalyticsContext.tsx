import React, { createContext, useContext, useMemo, useCallback } from "react";
import { generateInsights } from "../utils/generateInsghts";
import { useLogs } from "./LogsContext";
import { useProfile } from "./ProfileContext";
import { useGoals } from "./GoalsContext";
import { DailyLog } from "../types/models";

/* =========================
   TYPES
========================= */

type GoalType = "lose" | "maintain" | "gain";
type Status = "good" | "warning" | "bad";

interface EvaluationResult {
  caloriesStatus: Status;
  proteinStatus: Status;
  overall: "win" | "partial" | "lose";
  calorieRatio: number;
  proteinRatio: number;
  message: string;
}

interface NutritionAnalyticsContextType {
  evaluateDay: (params: {
    calories: number;
    protein: number;
  }) => EvaluationResult;

  getLastNDays: (n: number) => DailyLog[];

  streak: number;
  onTrackDays: number;
  averageCalories: number;
  averageProtein: number;
  todayEvaluation: EvaluationResult;
  isTodayOnTrack: boolean;
  isTodayPerfect: boolean;

  getColor: (status: Status) => string;
  getGradient: (status: Status) => [string, string];
}

/* =========================
   CONTEXT
========================= */

const NutritionAnalyticsContext =
  createContext<NutritionAnalyticsContextType | null>(null);

export const useNutritionAnalytics = (): NutritionAnalyticsContextType => {
  const context = useContext(NutritionAnalyticsContext);

  if (!context) {
    throw new Error(
      "useNutritionAnalytics must be used within NutritionAnalyticsProvider",
    );
  }

  return context;
};

/* =========================
   PROVIDER
========================= */

export const NutritionAnalyticsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { dailyLogs } = useLogs();
  const { goals } = useGoals();
  const { profile } = useProfile();

  const goalType: GoalType = profile?.goalType || "maintain";
  const safeLogs: DailyLog[] = (dailyLogs ?? []).filter(Boolean);

  /* =========================
     CORE ENGINE
  ========================= */

  const evaluateDay = useCallback(
    ({
      calories,
      protein,
    }: {
      calories: number;
      protein: number;
    }): EvaluationResult => {
      const calorieGoal = Math.max(goals?.calories || 0, 1);
      const proteinGoal = Math.max(goals?.protein || 0, 1);

      const calorieRatio = calories / calorieGoal;
      const proteinRatio = protein / proteinGoal;

      const lowerBound = calorieGoal * 0.9;
      const upperBound = calorieGoal * 1.1;
      const extremeLow = calorieGoal * 0.75;
      const extremeHigh = calorieGoal * 1.25;

      let caloriesStatus: Status;
      let caloriesGood = false;
      let caloriesExtreme = false;

      if (goalType === "lose") {
        caloriesGood = calories <= calorieGoal && calories > extremeLow;
        caloriesExtreme = calories <= extremeLow;

        if (caloriesExtreme) caloriesStatus = "bad";
        else if (caloriesGood) caloriesStatus = "good";
        else if (calories <= upperBound) caloriesStatus = "warning";
        else caloriesStatus = "bad";
      } else if (goalType === "gain") {
        caloriesGood = calories >= calorieGoal && calories < extremeHigh;
        caloriesExtreme = calories >= extremeHigh;

        if (caloriesExtreme) caloriesStatus = "bad";
        else if (caloriesGood) caloriesStatus = "good";
        else if (calories >= lowerBound) caloriesStatus = "warning";
        else caloriesStatus = "bad";
      } else {
        caloriesGood = calories >= lowerBound && calories <= upperBound;
        caloriesExtreme = calories < extremeLow || calories > extremeHigh;

        if (caloriesExtreme) caloriesStatus = "bad";
        else if (caloriesGood) caloriesStatus = "good";
        else caloriesStatus = "warning";
      }

      let proteinStatus: Status;

      if (proteinRatio >= 0.9) proteinStatus = "good";
      else if (proteinRatio >= 0.7) proteinStatus = "warning";
      else proteinStatus = "bad";

      const proteinGood = proteinStatus === "good";

      let overall: "win" | "partial" | "lose";

      if (caloriesExtreme) {
        overall = proteinGood ? "partial" : "lose";
      } else if (caloriesGood && proteinGood) {
        overall = "win";
      } else if (caloriesGood || proteinGood) {
        overall = "partial";
      } else {
        overall = "lose";
      }

      const message = generateInsights({
        calories,
        protein,
        carbs: 0,
        fats: 0,
        goalCalories: calorieGoal,
        goalProtein: proteinGoal,
        goalCarbs: 0,
        goalFats: 0,
        goalType,
      }).join(" ");

      return {
        caloriesStatus,
        proteinStatus,
        overall,
        calorieRatio,
        proteinRatio,
        message,
      };
    },
    [goals, goalType],
  );

  /* =========================
     HELPERS
  ========================= */

  const getLastNDays = useCallback(
    (n: number): DailyLog[] => {
      return [...safeLogs]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, n);
    },
    [safeLogs],
  );

  const last7Days = useMemo(() => getLastNDays(7), [getLastNDays]);

  const today = new Date().toISOString().split("T")[0];

  const todayLog = useMemo(() => {
    return safeLogs.find((log) => log.date === today);
  }, [safeLogs, today]);

  const todayEvaluation = useMemo(() => {
    return evaluateDay({
      calories: todayLog?.totalCalories || 0,
      protein: todayLog?.totalProtein || 0,
    });
  }, [todayLog, evaluateDay]);

  const isTodayOnTrack = todayEvaluation.overall === "win";
  const isTodayPerfect = todayEvaluation.overall === "win";

  const streak = useMemo(() => {
    const sorted = getLastNDays(365);

    let currentStreak = 0;

    for (let log of sorted) {
      const result = evaluateDay({
        calories: log.totalCalories || 0,
        protein: log.totalProtein || 0,
      });

      if (result.overall === "win") currentStreak++;
      else break;
    }

    return currentStreak;
  }, [getLastNDays, evaluateDay]);

  const onTrackDays = useMemo(() => {
    return last7Days.filter((log) => {
      const result = evaluateDay({
        calories: log.totalCalories || 0,
        protein: log.totalProtein || 0,
      });
      return result.overall === "win";
    }).length;
  }, [last7Days, evaluateDay]);

  const averageCalories = useMemo(() => {
    return Math.round(
      last7Days.reduce((sum, log) => sum + (log.totalCalories || 0), 0) /
        (last7Days.length || 1),
    );
  }, [last7Days]);

  const averageProtein = useMemo(() => {
    return Math.round(
      last7Days.reduce((sum, log) => sum + (log.totalProtein || 0), 0) /
        (last7Days.length || 1),
    );
  }, [last7Days]);

  const getColor = (status: Status) => {
    if (status === "good") return "#22c55e";
    if (status === "warning") return "#f59e0b";
    return "#ef4444";
  };

  const getGradient = (status: Status): [string, string] => {
    if (status === "good") return ["#22c55e", "#4ade80"];
    if (status === "warning") return ["#f59e0b", "#fbbf24"];
    return ["#ef4444", "#f87171"];
  };

  const value = useMemo(
    () => ({
      evaluateDay,
      getLastNDays,
      streak,
      onTrackDays,
      averageCalories,
      averageProtein,
      getColor,
      getGradient,
      todayEvaluation,
      isTodayOnTrack,
      isTodayPerfect,
    }),
    [
      evaluateDay,
      getLastNDays,
      streak,
      onTrackDays,
      averageCalories,
      averageProtein,
    ],
  );

  return (
    <NutritionAnalyticsContext.Provider value={value}>
      {children}
    </NutritionAnalyticsContext.Provider>
  );
};

// import React, { createContext, useCallback, useContext, useMemo } from "react";
// import { useNutrition } from "./NutritionContext";
// import { generateInsights } from "../utils/generateInsghts";
// import { useLogs } from "./LogsContext";
// import { useProfile } from "./ProfileContext";
// import { useGoals } from "./GoalsContext";

// /* =========================
//    TYPES
// ========================= */

// type GoalType = "lose" | "maintain" | "gain";
// type Status = "good" | "warning" | "bad";

// interface EvaluationResult {
//   caloriesStatus: Status;
//   proteinStatus: Status;
//   overall: "win" | "partial" | "lose";
//   calorieRatio: number;
//   proteinRatio: number;
//   message: string;
// }

// interface DailyLog {
//   date: string;
//   totalCalories?: number;
//   totalProtein?: number;
// }

// interface NutritionAnalyticsContextType {
//   evaluateDay: (params: {
//     calories: number;
//     protein: number;
//   }) => EvaluationResult;

//   getLastNDays: (n: number) => DailyLog[];

//   streak: number;
//   onTrackDays: number;
//   averageCalories: number;
//   averageProtein: number;

//   getColor: (status: Status) => string;
//   getGradient: (status: Status) => [string, string];
// }

// /* =========================
//    CONTEXT
// ========================= */

// const NutritionAnalyticsContext =
//   createContext<NutritionAnalyticsContextType | null>(null);

// export const useNutritionAnalytics = (): NutritionAnalyticsContextType => {
//   const context = useContext(NutritionAnalyticsContext);

//   if (!context) {
//     throw new Error(
//       "useNutritionAnalytics must be used within NutritionAnalyticsProvider",
//     );
//   }

//   return context;
// };

// /* =========================
//    PROVIDER
// ========================= */

// export const NutritionAnalyticsProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const { dailyLogs } = useLogs();
//   const { goals } = useGoals();
//   const { profile } = useProfile();

//   const goalType: GoalType = profile?.goalType || "maintain";
//   const safeLogs: DailyLog[] = (dailyLogs ?? []).filter(Boolean);

//   /* =========================
//      🧠 CORE ENGINE
//   ========================= */

//   const evaluateDay = React.useCallback(
//     ({
//       calories,
//       protein,
//     }: {
//       calories: number;
//       protein: number;
//     }): EvaluationResult => {
//       const calorieGoal = Math.max(goals.calories || 0, 1);
//       const proteinGoal = Math.max(goals.protein || 0, 1);

//       const calorieRatio = calories / calorieGoal;
//       const proteinRatio = protein / proteinGoal;

//       const lowerBound = calorieGoal * 0.9;
//       const upperBound = calorieGoal * 1.1;
//       const extremeLow = calorieGoal * 0.75;
//       const extremeHigh = calorieGoal * 1.25;

//       let caloriesStatus: Status;
//       let caloriesGood = false;
//       let caloriesExtreme = false;

//       /* =========================
//        CALORIE LOGIC
//     ========================= */

//       if (goalType === "lose") {
//         caloriesGood = calories <= calorieGoal && calories > extremeLow;
//         caloriesExtreme = calories <= extremeLow;

//         if (caloriesExtreme) caloriesStatus = "bad";
//         else if (caloriesGood) caloriesStatus = "good";
//         else if (calories <= upperBound) caloriesStatus = "warning";
//         else caloriesStatus = "bad";
//       } else if (goalType === "gain") {
//         caloriesGood = calories >= calorieGoal && calories < extremeHigh;
//         caloriesExtreme = calories >= extremeHigh;

//         if (caloriesExtreme) caloriesStatus = "bad";
//         else if (caloriesGood) caloriesStatus = "good";
//         else if (calories >= lowerBound) caloriesStatus = "warning";
//         else caloriesStatus = "bad";
//       } else {
//         caloriesGood = calories >= lowerBound && calories <= upperBound;
//         caloriesExtreme = calories < extremeLow || calories > extremeHigh;

//         if (caloriesExtreme) caloriesStatus = "bad";
//         else if (caloriesGood) caloriesStatus = "good";
//         else caloriesStatus = "warning";
//       }

//       /* =========================
//        PROTEIN LOGIC
//     ========================= */

//       let proteinStatus: Status;

//       if (proteinRatio >= 0.9) proteinStatus = "good";
//       else if (proteinRatio >= 0.7) proteinStatus = "warning";
//       else proteinStatus = "bad";

//       const proteinGood = proteinStatus === "good";
//       const proteinDeficit = Math.max(proteinGoal - protein, 0);

//       /* =========================
//        OVERALL LOGIC (IMPROVED)
//     ========================= */

//       let overall: "win" | "partial" | "lose";

//       if (caloriesExtreme) {
//         overall = proteinGood ? "partial" : "lose";
//       } else if (caloriesGood && proteinGood) {
//         overall = "win";
//       } else if (caloriesGood || proteinGood) {
//         overall = "partial";
//       } else {
//         overall = "lose";
//       }

//       /* =========================
//        🧠 SMART INSIGHTS (FINAL)
//     ========================= */

//       const message = generateInsights({
//         calories,
//         protein,
//         carbs: 0,
//         fats: 0,
//         goalCalories: calorieGoal,
//         goalProtein: proteinGoal,
//         goalCarbs: 0,
//         goalFats: 0,
//         goalType,
//       }).join(" ");

//       return {
//         caloriesStatus,
//         proteinStatus,
//         overall,
//         calorieRatio,
//         proteinRatio,
//         message,
//       };
//     },
//   );

//   const last7Days = useMemo(() => {
//     return [...safeLogs]
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//       .slice(0, 7);
//   }, [safeLogs]);

//   const streak = useMemo(() => {
//     const today = new Date().toISOString().split("T")[0];
//     const sorted = [...safeLogs]
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//       .slice(0, 365);

//     let currentStreak = 0;

//     for (let log of sorted) {
//       const result = evaluateDay({
//         calories: log.totalCalories || 0,
//         protein: log.totalProtein || 0,
//       });

//       if (log.date === today) {
//         if (result.overall === "win") currentStreak++;
//         continue;
//       }

//       if (result.overall === "win") currentStreak++;
//       else break;
//     }

//     return currentStreak;
//   }, [safeLogs]);

//   const onTrackDays = useMemo(() => {
//     return last7Days.filter((log) => {
//       const result = evaluateDay({
//         calories: log.totalCalories || 0,
//         protein: log.totalProtein || 0,
//       });
//       return result.overall === "win";
//     }).length;
//   }, [last7Days]);

//   const averageCalories = useMemo(() => {
//     return Math.round(
//       last7Days.reduce((sum, log) => sum + (log.totalCalories || 0), 0) /
//         (last7Days.length || 1),
//     );
//   }, [last7Days]);

//   const averageProtein = useMemo(() => {
//     return Math.round(
//       last7Days.reduce((sum, log) => sum + (log.totalProtein || 0), 0) /
//         (last7Days.length || 1),
//     );
//   }, [last7Days]);

//   const getColor = (status: Status) => {
//     if (status === "good") return "#22c55e";
//     if (status === "warning") return "#f59e0b";
//     return "#ef4444";
//   };

//   const getGradient = (status: Status): [string, string] => {
//     if (status === "good") return ["#22c55e", "#4ade80"];
//     if (status === "warning") return ["#f59e0b", "#fbbf24"];
//     return ["#ef4444", "#f87171"];
//   };

//   const value = React.useMemo(
//     () => ({
//       evaluateDay,
//       last7Days,
//       streak,
//       onTrackDays,
//       averageCalories,
//       averageProtein,
//       getColor,
//       getGradient,
//     }),
//     [
//       evaluateDay,
//       last7Days,
//       streak,
//       onTrackDays,
//       averageCalories,
//       averageProtein,
//     ],
//   );
//   return (
//     <NutritionAnalyticsContext.Provider value={value}>
//       {children}
//     </NutritionAnalyticsContext.Provider>
//   );
// };
