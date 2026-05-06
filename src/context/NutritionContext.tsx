// import React, {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useEffect,
//   useCallback,
//   useMemo,
// } from "react";
// import {
//   InventoryItem,
//   DailyFoodEntry,
//   NutritionGoals,
//   DailyLog,
//   ProfileData,
//   Unit,
//   MealType,
//   Meals,
//   RecentMap,
// } from "../types/models";
// import { saveData, getData, getMultipleData } from "../utils/storage";
// import { getTodayDate } from "../utils/date";
// import { defaultInventory } from "../data/defaultInventory";

// /* ================= CONTEXT TYPE ================= */

// interface NutritionContextType {
//   inventory: InventoryItem[];
//   addInventoryItem: (item: InventoryItem) => void;
//   removeInventoryItem: (id: string) => void;
//   updateInventoryItem: (item: InventoryItem) => void;
//   toggleFavorite: (id: string) => void;

//   dailyLogs: DailyLog[];
//   createNewLog: () => void;

//   addFoodToMeal: (mealType: MealType, entry: DailyFoodEntry) => void;
//   removeFoodFromMeal: (mealType: MealType, entryId: string) => void;

//   goals: NutritionGoals;
//   setGoals: (goals: NutritionGoals) => void;

//   profile: ProfileData | null;
//   saveProfileAndGoals: (profile: ProfileData, macros: NutritionGoals) => void;

//   recents: RecentMap;
//   getTodayLog: () => DailyLog | undefined;
// }

// /* ================= CONSTANTS ================= */

// const STORAGE_KEYS = {
//   INVENTORY: "FUELUP_INVENTORY",
//   DAILY_LOGS: "FUELUP_DAILY_LOGS",
//   GOALS: "FUELUP_GOALS",
//   PROFILE: "FUELUP_PROFILE",
//   RECENTS: "FUELUP_RECENTS",
// };

// const defaultGoals: NutritionGoals = {
//   calories: 2400,
//   protein: 98,
//   carbs: 320,
//   fats: 70,
// };

// /* ================= CONTEXT ================= */

// const NutritionContext = createContext<NutritionContextType | undefined>(
//   undefined,
// );

// /* ================= PROVIDER ================= */

// export const NutritionProvider = ({ children }: { children: ReactNode }) => {
//   const [inventory, setInventory] = useState<InventoryItem[]>([]);
//   const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
//   const [goals, setGoals] = useState<NutritionGoals>(defaultGoals);
//   const [profile, setProfile] = useState<ProfileData | null>(null);
//   const [recents, setRecents] = useState<RecentMap>({});

//   const [isLoaded, setIsLoaded] = useState(false);

//   const today = getTodayDate();

//   /* ================= HELPERS ================= */

//   const calculateTotals = (meals: Meals) => {
//     let totalCalories = 0;
//     let totalProtein = 0;
//     let totalCarbs = 0;
//     let totalFats = 0;

//     Object.values(meals).forEach((mealArray) => {
//       mealArray.forEach((item: DailyFoodEntry) => {
//         totalCalories += item.calories;
//         totalProtein += item.protein;
//         totalCarbs += item.carbs;
//         totalFats += item.fats;
//       });
//     });

//     return { totalCalories, totalProtein, totalCarbs, totalFats };
//   };

//   const getTodayLog = useCallback(() => {
//     return dailyLogs.find((log) => log.date === today);
//   }, [dailyLogs, today]);

//   /* ================= LOAD ================= */

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const keys = [
//           STORAGE_KEYS.INVENTORY,
//           STORAGE_KEYS.DAILY_LOGS,
//           STORAGE_KEYS.GOALS,
//           STORAGE_KEYS.PROFILE,
//           STORAGE_KEYS.RECENTS,
//         ];

//         const data = await getMultipleData(keys);

//         if (data[STORAGE_KEYS.INVENTORY])
//           setInventory(data[STORAGE_KEYS.INVENTORY]);
//         if (data[STORAGE_KEYS.DAILY_LOGS])
//           setDailyLogs(data[STORAGE_KEYS.DAILY_LOGS]);
//         if (data[STORAGE_KEYS.GOALS]) setGoals(data[STORAGE_KEYS.GOALS]);
//         if (data[STORAGE_KEYS.PROFILE]) setProfile(data[STORAGE_KEYS.PROFILE]);
//         if (data[STORAGE_KEYS.RECENTS]) {
//           const cleanedRecents: RecentMap = {};

//           Object.entries(data[STORAGE_KEYS.RECENTS]).forEach(([key, value]) => {
//             if (
//               typeof value === "object" &&
//               value !== null &&
//               "quantity" in value
//             ) {
//               cleanedRecents[key] = value as DailyFoodEntry;
//             }
//           });

//           setRecents(cleanedRecents);
//         }
//       } catch (e) {
//         console.error("Failed to load nutrition data", e);
//       } finally {
//         setIsLoaded(true);
//       }
//     };

//     loadData();
//   }, []);

//   /* ================= PERSISTENCE ================= */

//   // Debounce saves to reduce AsyncStorage calls
//   const [pendingSaves, setPendingSaves] = useState<Set<string>>(new Set());

//   useEffect(() => {
//     if (isLoaded && pendingSaves.has("inventory")) {
//       const timeoutId = setTimeout(() => {
//         saveData(STORAGE_KEYS.INVENTORY, inventory);
//         setPendingSaves((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete("inventory");
//           return newSet;
//         });
//       }, 500);
//       return () => clearTimeout(timeoutId);
//     }
//   }, [inventory, isLoaded, pendingSaves]);

//   useEffect(() => {
//     if (isLoaded && pendingSaves.has("dailyLogs")) {
//       const timeoutId = setTimeout(() => {
//         saveData(STORAGE_KEYS.DAILY_LOGS, dailyLogs);
//         setPendingSaves((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete("dailyLogs");
//           return newSet;
//         });
//       }, 500);
//       return () => clearTimeout(timeoutId);
//     }
//   }, [dailyLogs, isLoaded, pendingSaves]);

//   useEffect(() => {
//     if (isLoaded && pendingSaves.has("goals")) {
//       const timeoutId = setTimeout(() => {
//         saveData(STORAGE_KEYS.GOALS, goals);
//         setPendingSaves((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete("goals");
//           return newSet;
//         });
//       }, 500);
//       return () => clearTimeout(timeoutId);
//     }
//   }, [goals, isLoaded, pendingSaves]);

//   useEffect(() => {
//     if (isLoaded && pendingSaves.has("profile")) {
//       const timeoutId = setTimeout(() => {
//         saveData(STORAGE_KEYS.PROFILE, profile);
//         setPendingSaves((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete("profile");
//           return newSet;
//         });
//       }, 500);
//       return () => clearTimeout(timeoutId);
//     }
//   }, [profile, isLoaded, pendingSaves]);

//   useEffect(() => {
//     if (isLoaded && pendingSaves.has("recents")) {
//       const timeoutId = setTimeout(() => {
//         saveData(STORAGE_KEYS.RECENTS, recents);
//         setPendingSaves((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete("recents");
//           return newSet;
//         });
//       }, 500);
//       return () => clearTimeout(timeoutId);
//     }
//   }, [recents, isLoaded, pendingSaves]);

//   /* ================= ENSURE TODAY LOG & DEFAULT INV ================= */

//   useEffect(() => {
//     if (!isLoaded) return;

//     // Check if we need to create today's log
//     const todayLog = dailyLogs.find((log) => log.date === today);
//     if (!todayLog) {
//       const newLog: DailyLog = {
//         id: `${today}-${Date.now()}`,
//         date: today,
//         meals: { breakfast: [], lunch: [], snacks: [], dinner: [] },
//         totalCalories: 0,
//         totalProtein: 0,
//         totalCarbs: 0,
//         totalFats: 0,
//       };
//       setDailyLogs((prev) => [...prev, newLog]);
//     }

//     // Check if we need to load default inventory
//     if (inventory.length === 0) {
//       const inventoryItems: InventoryItem[] = defaultInventory.map((item) => ({
//         ...item,
//         unit: item.unit as Unit,
//       }));
//       setInventory(inventoryItems);
//     }
//   }, [isLoaded, today]); // Removed inventory/dailyLogs from deps to prevent infinite loops

//   /* ================= ACTIONS ================= */

//   const addInventoryItem = (item: InventoryItem) => {
//     setInventory((prev) => [...prev, item]);
//     setPendingSaves((prev) => new Set(prev).add("inventory"));
//   };

//   const removeInventoryItem = (id: string) => {
//     setInventory((prev) => prev.filter((item) => item.id !== id));
//     setPendingSaves((prev) => new Set(prev).add("inventory"));
//   };

//   const updateInventoryItem = (updatedItem: InventoryItem) => {
//     setInventory((prev) =>
//       prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
//     );
//     setPendingSaves((prev) => new Set(prev).add("inventory"));
//   };

//   const toggleFavorite = (id: string) => {
//     setInventory((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
//       ),
//     );
//     setPendingSaves((prev) => new Set(prev).add("inventory"));
//   };

//   const createNewLog = () => {
//     const newLog: DailyLog = {
//       id: `${today}-${Date.now()}`,
//       date: today,
//       meals: { breakfast: [], lunch: [], snacks: [], dinner: [] },
//       totalCalories: 0,
//       totalProtein: 0,
//       totalCarbs: 0,
//       totalFats: 0,
//     };
//     setDailyLogs((prev) => [...prev, newLog]);
//     setPendingSaves((prev) => new Set(prev).add("dailyLogs"));
//   };

//   const addFoodToMeal = (mealType: MealType, entry: DailyFoodEntry) => {
//     // 1. Update Logs
//     setDailyLogs((prevLogs) =>
//       prevLogs.map((log) => {
//         if (log.date !== today) return log;

//         const updatedMeals = {
//           ...log.meals,
//           [mealType]: [...log.meals[mealType], entry],
//         };

//         return {
//           ...log,
//           meals: updatedMeals,
//           ...calculateTotals(updatedMeals),
//         };
//       }),
//     );
//     setPendingSaves((prev) => new Set(prev).add("dailyLogs"));

//     // 2. Update Recents (Ensure we map by inventoryItemId)
//     setRecents((prev) => ({
//       ...prev,
//       [entry.inventoryItemId]: {
//         ...entry,
//         id: entry.inventoryItemId, // 🔥 stable key for UI
//         createdAt: Date.now(), // 🔥 ALWAYS refresh timestamp
//       },
//     }));
//     setPendingSaves((prev) => new Set(prev).add("recents"));
//   };

//   const removeFoodFromMeal = (mealType: MealType, entryId: string) => {
//     setDailyLogs((prevLogs) =>
//       prevLogs.map((log) => {
//         if (log.date !== today) return log;

//         const updatedMeals = {
//           ...log.meals,
//           [mealType]: log.meals[mealType].filter((e) => e.id !== entryId),
//         };

//         return {
//           ...log,
//           meals: updatedMeals,
//           ...calculateTotals(updatedMeals),
//         };
//       }),
//     );
//     setPendingSaves((prev) => new Set(prev).add("dailyLogs"));
//   };

//   const saveProfileAndGoals = (
//     profileData: ProfileData,
//     macroGoals: NutritionGoals,
//   ) => {
//     setProfile(profileData);
//     setGoals(macroGoals);
//     setPendingSaves((prev) => {
//       const newSet = new Set(prev);
//       newSet.add("profile");
//       newSet.add("goals");
//       return newSet;
//     });
//   };

//   const value: NutritionContextType = useMemo(
//     () => ({
//       inventory,
//       addInventoryItem,
//       removeInventoryItem,
//       updateInventoryItem,
//       toggleFavorite,
//       dailyLogs,
//       createNewLog,
//       addFoodToMeal,
//       removeFoodFromMeal,
//       goals,
//       setGoals,
//       profile,
//       saveProfileAndGoals,
//       recents,
//       getTodayLog,
//     }),
//     [inventory, dailyLogs, goals, profile, recents],
//   );

//   return (
//     <NutritionContext.Provider value={value}>
//       {children}
//     </NutritionContext.Provider>
//   );
// };

// export const useNutrition = () => {
//   const context = useContext(NutritionContext);
//   if (!context) {
//     throw new Error("useNutrition must be used within NutritionProvider");
//   }
//   return context;
// };
