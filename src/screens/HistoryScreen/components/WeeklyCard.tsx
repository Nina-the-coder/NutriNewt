import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useNutritionAnalytics } from "../../../context/NutritionAnalyticsContext";
import { useTheme } from "../../../context/ThemeContext";

export default function WeeklyCard({ avgCalories, avgProtein }: any) {
  const { onTrackDays } = useNutritionAnalytics();
  const { colors } = useTheme();

  const activeDaysLast7 = onTrackDays || 0;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.background,
          borderColor: colors.card,
        },
      ]}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {/* left data */}
        <View style={styles.data}>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            Avg Calories:{" "}
            <Text style={{ color: colors.textPrimary }}>
              {Math.round(avgCalories)} kcal
            </Text>
          </Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            Avg Protein:{" "}
            <Text style={{ color: colors.textPrimary }}>
              {Math.round(avgProtein)} g
            </Text>
          </Text>
        </View>

        {/* right badge */}
        <View style={[styles.weekBadge, { backgroundColor: colors.card }]}>
          <Text style={[styles.weekBadgeText, { color: colors.textSecondary }]}>
            This Week
          </Text>
        </View>
      </View>

      {/* bottom track counter */}
      <Text style={[styles.onTrack, { color: colors.primary }]}>
        {activeDaysLast7} / 7 days on Track
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
    paddingBottom: 20,
  },

  text: {
    fontSize: 16,
    fontWeight: "bold",
  },

  data: {
    padding: 16,
    gap: 16,
  },

  weekBadge: {
    borderRadius: 12,
    height: 18,
    paddingHorizontal: 12,
    justifyContent: "center",
  },

  weekBadgeText: {
    fontSize: 11,
  },

  onTrack: {
    marginRight: 20,
    fontWeight: "900",
    fontSize: 18,
    textAlign: "right",
  },
});
