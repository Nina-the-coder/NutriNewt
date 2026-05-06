export function generateInsights({
  calories,
  protein,
  carbs,
  fats,
  goalCalories,
  goalProtein,
  goalCarbs,
  goalFats,
  goalType,
}: {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  goalCalories: number;
  goalProtein: number;
  goalCarbs: number;
  goalFats: number;
  goalType: "gain" | "lose" | "maintain";
}) {
  const insights: string[] = [];

  const hour = new Date().getHours();

  // 🔥 Stable seed based on data (NO randomness)
  const seed = Math.floor(
    calories +
    protein * 2 +
    carbs +
    fats +
    hour
  );

  // 1. Time
  insights.push(getTimeInsight(hour, seed));

  // 2. Goal
  insights.push(getGoalInsight(goalType, seed));

  // 3. Progress
  insights.push(getProgressInsight(calories, goalCalories, seed));

  // 4. Protein
  insights.push(getProteinInsight(protein, goalProtein, seed));

  // 5. Energy (optional)
  const energy = getEnergyInsight(carbs, goalCarbs, seed);
  if (energy) insights.push(energy);

  // remove duplicates & return only 1 stable insight
  return [...new Set(insights)].slice(0, 1);
}


// 🔥 Stable picker (NO Math.random)
function pickStable(arr: string[], seed: number) {
  return arr[Math.abs(seed) % arr.length];
}


function getTimeInsight(hour: number, seed: number) {
  if (hour < 12) {
    return pickStable([
      "🌅 A fresh start — what you eat now sets the tone for your day.",
      "🌅 Morning fuel matters — let’s build momentum.",
      "🌅 You’ve got the whole day ahead — start strong.",
    ], seed);
  }

  if (hour < 18) {
    return pickStable([
      "☀️ You’re halfway there — keep the energy steady.",
      "☀️ Good time to check in — how’s your fueling going?",
      "☀️ A small boost now can keep you going strong.",
    ], seed);
  }

  return pickStable([
    "🌙 You’ve made good progress — now finish smart.",
    "🌙 A balanced finish can make today even better.",
    "🌙 Wind down strong — small choices still matter.",
  ], seed);
}


function getGoalInsight(goal: "gain" | "lose" | "maintain", seed: number) {
  if (goal === "gain") {
    return pickStable([
      "💪 You’re in build mode — every calorie supports growth.",
      "💪 Consistent fueling = consistent muscle gain.",
      "💪 Don’t miss chances to eat — they add up.",
    ], seed);
  }

  if (goal === "lose") {
    return pickStable([
      "🔥 You’re focusing on control — consistency wins.",
      "🔥 Small deficits daily lead to big results.",
      "🔥 Stay steady — no need to rush the process.",
    ], seed);
  }

  return pickStable([
    "⚖️ You’re maintaining — balance is key.",
    "⚖️ Steady habits keep everything in check.",
    "⚖️ You’re doing well — just stay consistent.",
  ], seed);
}


function getProgressInsight(
  calories: number,
  goalCalories: number,
  seed: number
) {
  const ratio = calories / goalCalories;

  if (ratio < 0.5) {
    return pickStable([
      "You’re just getting started — plenty of room to fuel up.",
      "A light day so far — adding more will help.",
    ], seed);
  }

  if (ratio < 0.9) {
    return pickStable([
      "You’re on your way — a little more will get you there.",
      "Nice progress — keep building on it.",
    ], seed);
  }

  if (ratio <= 1.1) {
    return pickStable([
      "You’re right on track — great job.",
      "This is a well-balanced day so far.",
    ], seed);
  }

  return pickStable([
    "A bit above target — no stress, it happens.",
    "Slightly heavy day — tomorrow is a fresh start.",
  ], seed);
}


function getProteinInsight(
  protein: number,
  goalProtein: number,
  seed: number
) {
  const ratio = protein / goalProtein;

  if (ratio < 0.5) {
    return pickStable([
      "Adding protein now would really boost your progress.",
      "Your body could use more protein today.",
    ], seed);
  }

  if (ratio < 0.9) {
    return pickStable([
      "You’re getting there — a bit more protein will help.",
      "Almost there on protein — keep going.",
    ], seed);
  }

  return pickStable([
    "Great protein intake — your muscles will thank you.",
    "You’re hitting your protein well today.",
  ], seed);
}


function getEnergyInsight(
  carbs: number,
  goalCarbs: number,
  seed: number
) {
  const ratio = carbs / goalCarbs;

  if (ratio < 0.6) {
    return pickStable([
      "You might feel low on energy — carbs could help.",
      "A quick carb boost can improve your energy.",
    ], seed);
  }

  return null;
}