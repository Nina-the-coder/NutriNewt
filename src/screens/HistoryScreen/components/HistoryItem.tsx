import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNutritionAnalytics } from "../../../context/NutritionAnalyticsContext";
import { useTheme } from "../../../context/ThemeContext";

export default function HistoryItem({ item, formatDate, onPress }: any) {
  const { evaluateDay, getColor } = useNutritionAnalytics();
  const { colors } = useTheme();

  const result = evaluateDay({
    calories: item.totalCalories || 0,
    protein: item.totalProtein || 0,
  });

  const calories = item.totalCalories || 0;

  const today = new Date().toISOString().split("T")[0];
  const isToday = item.date === today;

  const getLabel = (status: any) => {
    if (status === "good") return "✓";
    if (status === "warning") return "⚠️";
    return "✕";
  };

  const getOverallLabel = (status: any) => {
    if (status === "win") return "WIN";
    if (status === "partial") return "OK";
    return "MISS";
  };

  const getOverallColor = (status: any) => {
    if (status === "win") return "#22c55e";
    if (status === "partial") return "#f59e0b";
    return "#ef4444";
  };

  return (
    <TouchableOpacity
      style={[styles.historyCard, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={styles.col}>
        <View style={styles.row}>
          <Text style={[styles.date, { color: colors.textPrimary }]}>
            {!isToday && formatDate(item.date)}
          </Text>

          {isToday && (
            <View
              style={[
                styles.todayBadge,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.background,
                },
              ]}
            >
              <Text
                style={[styles.todayBadgeText, { color: colors.textPrimary }]}
              >
                Today
              </Text>
            </View>
          )}

          <View style={styles.tagRow}>
            <View
              style={[
                styles.overallTag,
                { backgroundColor: getOverallColor(result.overall) },
              ]}
            >
              <Text style={styles.tagText}>
                {getOverallLabel(result.overall)}
              </Text>
            </View>

            <View style={styles.tag}>
              <Text
                style={[
                  styles.tagText,
                  { color: getColor(result.caloriesStatus) },
                ]}
              >
                Cal {getLabel(result.caloriesStatus)}
              </Text>
            </View>

            <View style={styles.tag}>
              <Text
                style={[
                  styles.tagText,
                  { color: getColor(result.proteinStatus) },
                ]}
              >
                Protein {getLabel(result.proteinStatus)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.calories, { color: colors.textSecondary }]}>
          ( {calories} kcal )
        </Text>

        <Text style={[styles.insight, { color: colors.textSecondary }]}>
          {result.message}
        </Text>
      </View>

      <Ionicons
        name={"chevron-forward"}
        size={24}
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  );
}

/* =========================
   🎨 STYLES
========================= */

const styles = StyleSheet.create({
  historyCard: {
    width: "95%",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    marginHorizontal: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    // elevation: 4,

    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.15,
    // shadowRadius: 8,
  },

  col: {
    flexDirection: "column",
    width: "80%",
    gap: 4,
  },

  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
    alignItems: "center",
  },

  date: {
    fontSize: 16,
  },

  statusDot: {
    fontSize: 16,
  },

  todayBadge: {
    borderWidth: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    justifyContent: "center",
  },

  todayBadgeText: {
    fontSize: 12,
  },

  calories: {
    fontSize: 14,
    fontWeight: "bold",
  },

  insight: {
    fontSize: 12,
    marginTop: 4,
  },

  tagRow: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 6,
  },

  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  overallTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 24,
  },

  tagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
});
