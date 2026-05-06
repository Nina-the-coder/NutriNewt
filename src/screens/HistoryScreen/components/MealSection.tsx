import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { useLogs } from "../../../context/LogsContext";

type MealType = "breakfast" | "lunch" | "snacks" | "dinner";

interface MealSectionProps {
  title: string;
  mealType: MealType;
  data: any[];
}

// Enable animation for Android
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function MealSection({
  title,
  mealType,
  data,
}: MealSectionProps) {
  const { removeFoodFromMeal } = useLogs();
  const { colors } = useTheme();

  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const totalCalories = useMemo(() => {
    return data.reduce((sum, item) => sum + item.calories, 0);
  }, [data]);

  return (
    <View style={[styles.mealCard, { backgroundColor: colors.card }]}>
      {/* HEADER */}
      <View style={styles.mealHeader}>
        <Text style={[styles.mealTitle, { color: colors.textSecondary }]}>
          {title}
        </Text>
      </View>

      {/* DIVIDER */}
      <View style={[styles.divider, { backgroundColor: colors.textPrimary }]} />

      {/* CONTENT */}
      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../../../assets/Newt.png")}
            style={styles.emptyImage}
          />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No items added
          </Text>
        </View>
      ) : (
        <>
          {data.map((item) => {
            const isActive = activeItemId === item.id;

            return (
              <View
                key={item.id}
                style={[styles.foodRow, isActive && styles.activeRow]}
              >
                {/* LEFT */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[styles.foodName, { color: colors.textPrimary }]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[styles.foodMeta, { color: colors.textSecondary }]}
                  >
                    ({item.quantity}
                    {item.unit})
                  </Text>
                </View>

                {/* RIGHT */}
                <View style={styles.rightRow}>
                  <Text
                    style={[
                      styles.foodCalories,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.calories} kcal
                  </Text>

                  {isActive && (
                    <TouchableOpacity
                      onPress={() => {
                        LayoutAnimation.easeInEaseOut();
                        removeFoodFromMeal(mealType, item.id);
                        setActiveItemId(null);
                      }}
                    >
                      <Text style={styles.deleteText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}

          {/* DIVIDER */}
          <View
            style={[styles.divider, { backgroundColor: colors.textPrimary }]}
          />

          {/* TOTAL */}
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
              Total Intake
            </Text>
            <Text style={[styles.totalCalories, { color: colors.textPrimary }]}>
              {totalCalories} kcal
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  mealCard: {
    borderRadius: 22,
    paddingVertical: 20,
    marginBottom: 14,

    // shadowColor: "#000",
    // shadowOpacity: 0.4,
    // shadowRadius: 12,
    // elevation: 8,
  },

  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  mealTitle: {
    fontSize: 20,
    fontWeight: "500",
  },

  addButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  divider: {
    height: 1,
    marginVertical: 12,
  },

  emptyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 16,
  },

  emptyImage: {
    width: 60,
    height: 60,
  },

  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },

  foodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  activeRow: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
  },

  foodName: {
    fontSize: 18,
    fontWeight: "600",
  },

  foodMeta: {
    fontSize: 13,
    marginTop: 2,
  },

  rightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  foodCalories: {
    fontSize: 16,
    fontWeight: "500",
  },

  deleteText: {
    fontSize: 16,
    fontWeight: "700",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 16,
    marginLeft: 124,
    fontWeight: "500",
  },

  totalCalories: {
    fontSize: 18,
    fontWeight: "500",
  },
});
