import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../../../theme/colors";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import MealSection from "./MealSection";
import HomeSummaryCard from "../../HomeScreen/comonents/HomeSummaryCard";
import { SafeAreaView } from "react-native-safe-area-context";
import BackBtn from "../../../sharedComponents/BackBtn";
import { useTheme } from "../../../context/ThemeContext";
import { useGoals } from "../../../context/GoalsContext";

export default function DayDetailsScreen({ route }: any) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { log } = route.params;

  const { goals } = useGoals(); // ✅ FIX

  if (!log) return null;

  const totals = {
    calories: log.totalCalories || 0,
    protein: log.totalProtein || 0,
    carbs: log.totalCarbs || 0,
    fats: log.totalFats || 0,
  };

  const date = new Date(log.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <BackBtn onClose={() => navigation.goBack()} />

        <Text style={[styles.title, { color: colors.primary }]}>History</Text>
        <Text style={[styles.titleDate, { color: colors.textSecondary }]}>
          {date}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <HomeSummaryCard totals={totals} goals={goals} />

        {/* MEALS */}
        <MealSection
          title="BreakFast"
          mealType="breakfast"
          data={log.meals.breakfast}
        />
        <MealSection title="Lunch" mealType="lunch" data={log.meals.lunch} />
        <MealSection title="Snacks" mealType="snacks" data={log.meals.snacks} />
        <MealSection title="Dinner" mealType="dinner" data={log.meals.dinner} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    paddingLeft: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    gap: 16,
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

});
