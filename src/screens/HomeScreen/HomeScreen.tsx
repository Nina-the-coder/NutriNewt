import React, { useState, useMemo, memo, useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MakeFoodEntryModal from "./comonents/MakeFoodEntryModal/MakeFoodEntryModal";
import MealSection from "./comonents/MealSection";
import HomeSummaryCard from "./comonents/HomeSummaryCard";
import StreakBadge from "../../sharedComponents/StreakBadge";
import SmartTip from "../../sharedComponents/SmartTip";
import { useTheme } from "../../context/ThemeContext";
import { useGoals } from "../../context/GoalsContext";
import { useLogs } from "../../context/LogsContext";
import StreakCelebrationModal from "../../sharedComponents/StreakCelebrationModal";
import { useNutritionAnalytics } from "../../context/NutritionAnalyticsContext";

type MealType = "breakfast" | "lunch" | "snacks" | "dinner";

const HomeScreen = () => {
  console.log("Home screen rendered"); // Removed for performance

  const { colors } = useTheme();
  const { isTodayOnTrack, todayEvaluation, streak } = useNutritionAnalytics();

  const { dailyLogs } = useLogs();
  const { goals } = useGoals();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const todaysDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const [showStreakModal, setShowStreakModal] = useState(false);
  const wasOnTrackBeforeOpening = useRef(false);
  const [hasCelebratedToday, setHasCelebratedToday] = useState(false);

  const checkStreakCelebration = () => {
    console.log("checking streak celebration");
    setTimeout(() => {
      const wasOnTrack = wasOnTrackBeforeOpening.current;
      const nowOnTrack = isTodayOnTrack;

      console.log("Streak Check - Was On Track Before:", wasOnTrack);
      console.log("Streak Check - Is Now On Track:", nowOnTrack);

      // trigger ONLY when user newly reaches goal
      if (!hasCelebratedToday && !wasOnTrack && nowOnTrack) {
        setShowStreakModal(true);
        setHasCelebratedToday(true);
      }
    }, 350);
  };

  const confirmDay = () => {
    setTimeout(() => {
      const wasOnTrack = isTodayOnTrack;
      console.log("Confirm Day - Was On Track:", wasOnTrack);

      if (wasOnTrack) {
        setShowStreakModal(true);
      } else {
        alert("Confirming day! Let's aim for on track tomorrow!");
      }
    }, 350);
    // alert("Day locked! Great job today!");
  };

  /* =========================
     Get Today's Log
  ========================= */

  const today = new Date().toISOString().split("T")[0];

  const meals = useMemo(() => {
    const todayLog = dailyLogs.find((log: any) => log.date === today);
    return (
      todayLog?.meals || {
        breakfast: [],
        lunch: [],
        snacks: [],
        dinner: [],
      }
    );
  }, [dailyLogs, today]);

  /* =========================
     Nutrition Summary
  ========================= */

  const totals = useMemo(() => {
    const allMeals = [
      ...meals.breakfast,
      ...meals.lunch,
      ...meals.snacks,
      ...meals.dinner,
    ].filter(Boolean); // ✅ remove undefined

    return allMeals.reduce(
      (acc, item) => {
        acc.calories += item?.calories ?? 0;
        acc.protein += item?.protein ?? 0;
        acc.carbs += item?.carbs ?? 0;
        acc.fats += item?.fats ?? 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 },
    );
  }, [meals]);

  /* =========================
     Render
  ========================= */

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* ===== HEADER ===== */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={styles.logoRow}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 14,
              alignItems: "center",
            }}
          >
            <Text style={[styles.title, { color: colors.primary }]}>Today</Text>
            <Text style={[styles.titleDate, { color: colors.textSecondary }]}>
              {todaysDate}
            </Text>
          </View>
          <StreakBadge />
        </View>
      </View>
      {/* ===== MEAL SECTIONS ===== */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 16 }}>
          {/* ===== SUMMARY CARD ===== */}
          <View>
            <HomeSummaryCard totals={totals} goals={goals} />
          </View>

          <SmartTip id="quick_add_tip" text="Tap + to quickly add food" />

          <MealSection
            title="Breakfast"
            mealType="breakfast"
            data={meals.breakfast}
            onAdd={() => {
              wasOnTrackBeforeOpening.current = isTodayOnTrack;

              setSelectedMeal("breakfast");
              setModalVisible(true);
            }}
          />

          <MealSection
            title="Lunch"
            mealType="lunch"
            data={meals.lunch}
            onAdd={() => {
              wasOnTrackBeforeOpening.current = isTodayOnTrack;

              setSelectedMeal("lunch");
              setModalVisible(true);
            }}
          />

          <MealSection
            title="Snacks"
            mealType="snacks"
            data={meals.snacks}
            onAdd={() => {
              wasOnTrackBeforeOpening.current = isTodayOnTrack;

              setSelectedMeal("snacks");
              setModalVisible(true);
            }}
          />

          <MealSection
            title="Dinner"
            mealType="dinner"
            data={meals.dinner}
            onAdd={() => {
              wasOnTrackBeforeOpening.current = isTodayOnTrack;

              setSelectedMeal("dinner");
              setModalVisible(true);
            }}
          />
        </View>

        {/* finalise day button */}
        <TouchableOpacity
          onPress={confirmDay}
          style={[styles.createBtn, { borderColor: colors.primary }]}
        >
          <Text style={[styles.createText, { color: colors.primary }]}>
            Lock in Today
          </Text>
        </TouchableOpacity>
        <View style={{ height: 200 }} />
      </ScrollView>
      {/* ===== MODAL ===== */}
      
      <MakeFoodEntryModal
        visible={modalVisible}
        mealType={selectedMeal} // 🔥 IMPORTANT
        onClose={() => {
          setModalVisible(false);
          setSelectedMeal(null);
          checkStreakCelebration();
        }}
      />
      <StreakCelebrationModal
        visible={showStreakModal}
        streak={streak}
        onClose={() => setShowStreakModal(false)}
      />
      {/* ===== FLOATING BUTTON ===== */}
      {/* <FloatingButton
        onPress={() => {
          setSelectedMeal("breakfast"); // default fallback
          setModalVisible(true);
        }}
      /> */}
    </SafeAreaView>
  );
};

export default React.memo(HomeScreen);

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  /* HEADER */

  logoRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 26,
    paddingTop: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
  },

  titleDate: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "300",
  },
  createBtn: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    marginTop: 20,
  },
  createText: {
    textAlign: "center",
  },
});
