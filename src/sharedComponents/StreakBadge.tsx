import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNutritionAnalytics } from "../context/NutritionAnalyticsContext";
import { useTheme } from "../context/ThemeContext";
import React from "react";

const StreakBadge = () => {
  console.log("StreakBadge rendered");
  const {colors} = useTheme();
  const { streak } = useNutritionAnalytics();

  return (
    <View style={styles.streakRow}>
      <Text style={[styles.streakText, { color: colors.textSecondary }]}>
        Streak
      </Text>

      <Ionicons
        name="flame"
        size={22}
        color={streak > 0 ? colors.danger : colors.textSecondary}
      />

      <Text style={[styles.streakValue, { color: colors.textPrimary }]}>
        {streak}
      </Text>
    </View>
  );
}

export default React.memo(StreakBadge);

const styles = StyleSheet.create({
  streakRow: {
    marginRight: 12,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  streakText: {
    fontSize: 14,
    fontWeight: "600",
  },

  streakValue: {
    fontSize: 20,
    fontWeight: "800",
  },
});
