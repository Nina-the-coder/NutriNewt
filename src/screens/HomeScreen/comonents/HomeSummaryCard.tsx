import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing, Image } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useNutritionAnalytics } from "../../../context/NutritionAnalyticsContext";
import { useTheme } from "../../../context/ThemeContext";

const HomeSummaryCard = ({ totals, goals }: any) => {
  const { colors } = useTheme();
  const { evaluateDay, getColor, getGradient } = useNutritionAnalytics();

  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;

  const [displayCalories, setDisplayCalories] = useState(0);

  const calorieProgress = totals.calories / (goals.calories || 1);

  /* =========================
     🚀 ANIMATIONS
  ========================= */

  useEffect(() => {
    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: calorieProgress,
        duration: 1200,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();

    let start = 0;
    const end = totals.calories;
    const duration = 1000;
    const stepTime = 16;
    const increment = end / (duration / stepTime);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setDisplayCalories(Math.floor(start));
    }, stepTime);

    return () => clearInterval(counter);
  }, [totals.calories]);

  /* =========================
     🧠 ENGINE RESULT
  ========================= */

  const result = evaluateDay({
    calories: totals.calories,
    protein: totals.protein,
  });

  const progressColor = getColor(result.caloriesStatus);
  const gradient = getGradient(result.caloriesStatus);

  /* =========================
     🔔 HAPTICS
  ========================= */

  useEffect(() => {
    if (result.overall === "win") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [result.overall]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          backgroundColor: colors.card,
          borderColor: colors.card,
          // shadowColor: colors.textPrimary,
        },
      ]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>
          Calories
        </Text>
        <Text style={[styles.calories, { color: progressColor }]}>
          {displayCalories} / {goals.calories} kcal
        </Text>
      </View>

      {/* PROGRESS BAR */}
      <View
        style={[
          styles.progressBg,
          { backgroundColor: colors.textSecondary + "20" },
        ]}
      >
        <Animated.View
          style={{
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
            overflow: "hidden",
          }}
        >
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressFill}
          />

          {/* ✅ FIXED: dynamic shine color */}
          <Animated.View
            style={[
              styles.shine,
              {
                backgroundColor: colors.textPrimary + "20",
                transform: [
                  {
                    translateX: shineAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-100, 300],
                    }),
                  },
                ],
              },
            ]}
          />
        </Animated.View>
      </View>

      {/* MACROS */}
      <View style={styles.macroRow}>
        <MacroCircle
          label="Protein"
          value={totals.protein}
          goal={goals.protein}
          getColor={getColor}
          evaluateDay={evaluateDay}
        />
        <MacroCircle
          label="Carbs"
          value={totals.carbs}
          goal={goals.carbs}
          getColor={getColor}
          evaluateDay={evaluateDay}
        />
        <MacroCircle
          label="Fats"
          value={totals.fats}
          goal={goals.fats}
          getColor={getColor}
          evaluateDay={evaluateDay}
        />
      </View>

      <View
        style={[
          styles.divider,
          {
            backgroundColor: colors.textSecondary + "20",
            shadowColor: colors.textSecondary,
          },
        ]}
      />

      {/* INSIGHT */}
      <View style={styles.insight}>
        <Image
          source={require("../../../../assets/logo.png")}
          style={styles.logo}
        />
        <Text style={[styles.insightText, { color: colors.textSecondary }]}>
          {result.message}
        </Text>
      </View>
    </Animated.View>
  );
};

export default HomeSummaryCard;

/* =========================
   🔵 Macro Circle
========================= */

const MacroCircle = ({ label, value, goal, getColor, evaluateDay }: any) => {
  const { colors } = useTheme();

  const result = evaluateDay({
    calories: label === "Calories" ? value : 0,
    protein: label === "Protein" ? value : 0,
  });

  let status: "good" | "warning" | "bad";

  if (label === "Protein") {
    status = result.proteinStatus;
  } else {
    const ratio = value / (goal || 1);
    if (ratio >= 0.9) status = "good";
    else if (ratio >= 0.7) status = "warning";
    else status = "bad";
  }

  const progress = Math.min((value / (goal || 1)) * 100, 100);
  const color = getColor(status);

  return (
    <View style={styles.macroItem}>
      <AnimatedCircularProgress
        size={72}
        width={6}
        fill={progress}
        tintColor={color}
        backgroundColor={colors.textSecondary + "20"}
        lineCap="round"
        duration={1000}
      >
        {() => (
          <View style={{ alignItems: "center" }}>
            <Text style={[styles.circleValue, { color: colors.textPrimary }]}>
              {Math.round(value)}g
            </Text>
            <Text style={[styles.circleGoal, { color: colors.textSecondary }]}>
              {Math.round(goal)}g
            </Text>
          </View>
        )}
      </AnimatedCircularProgress>

      <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
};

/* =========================
   🎨 Styles
========================= */

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },

  header: {
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
  },

  calories: {
    fontSize: 16,
    fontWeight: "700",
  },

  progressBg: {
    height: 10,
    borderRadius: 10,
    marginTop: 12,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  shine: {
    position: "absolute",
    height: "100%",
    width: 60,
    borderRadius: 10,
  },

  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
    padding: 14,
  },

  macroItem: {
    alignItems: "center",
  },

  circleValue: {
    fontSize: 14,
    fontWeight: "700",
  },

  circleGoal: {
    fontSize: 10,
  },

  macroLabel: {
    marginTop: 6,
    fontSize: 13,
  },

  divider: {
    height: 0.2,
    marginVertical: 12,
    elevation: 1,
  },

  insight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 8,
  },

  insightText: {
    fontSize: 16,
  },

  logo: {
    width: 28,
    height: 28,
  },
});