import React, { useMemo, useState, memo } from "react";
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
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Snackbar } from "react-native-paper";
import { triggerFeedback } from "../../../utils/feedback";
import { useTheme } from "../../../context/ThemeContext";
import { useLogs } from "../../../context/LogsContext";

type MealType = "breakfast" | "lunch" | "snacks" | "dinner";

interface MealSectionProps {
  title: string;
  mealType: MealType;
  data: any[];
  onAdd: () => void;
}

// Enable animation for Android
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default memo(function MealSection({
  title,
  mealType,
  data,
  onAdd,
}: MealSectionProps) {
  const { colors } = useTheme();
  const { removeFoodFromMeal, addFoodToMeal } = useLogs();

  const [lastDeleted, setLastDeleted] = useState<any>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const totalCalories = useMemo(() => {
    return data.reduce((sum, item) => sum + item.calories, 0);
  }, [data]);

  /* ================= DELETE HANDLER ================= */

  const handleDelete = (item: any) => {
    LayoutAnimation.easeInEaseOut();

    setLastDeleted(item);
    removeFoodFromMeal(mealType, item.id);

    triggerFeedback({
      message: `${item.name} removed`,
      haptic: "medium",
    });

    setSnackbarVisible(true);
  };

  /* ================= SWIPE ACTION ================= */

  const renderLeftActions = (item: any) => {
    return (
      <TouchableOpacity
        style={[styles.deleteContainer, { backgroundColor: colors.danger }]}
        onPress={() => handleDelete(item)}
      >
        <Ionicons name="trash" size={18} color="#fff" />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.mealCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.card,
        },
      ]}
    >
      {/* HEADER */}
      <View style={styles.mealHeader}>
        <Text style={[styles.mealTitle, { color: colors.textSecondary }]}>
          {title}
        </Text>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={onAdd}
        >
          <Text style={[styles.addButtonText, { color: colors.textPrimary }]}>
            + Add
          </Text>
        </TouchableOpacity>
      </View>

      {/* DIVIDER */}
      <View style={[styles.divider, { backgroundColor: colors.textPrimary }]} />

      {/* CONTENT */}
      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          {/* <Image
            source={require("../../../../assets/Newt.png")}
            style={styles.emptyImage}
          /> */}
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No items yet
          </Text>
        </View>
      ) : (
        <>
          {data.map((item) => (
            <Swipeable
              key={item.id}
              renderLeftActions={() => renderLeftActions(item)}
              friction={2}
              rightThreshold={40}
            >
              <View style={styles.foodRow}>
                {/* LEFT */}
                <View style={styles.leftRow}>
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
                <Text
                  style={[styles.foodCalories, { color: colors.textPrimary }]}
                >
                  {item.calories} kcal
                </Text>
              </View>
            </Swipeable>
          ))}

          {/* DIVIDER */}
          {/* <View
            style={[styles.divider, { backgroundColor: colors.textPrimary }]}
          /> */}

          {/* TOTAL */}
          {/* <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
              Total Intake
            </Text>
            <Text style={[styles.totalCalories, { color: colors.textPrimary }]}>
              {totalCalories} kcal
            </Text>
          </View> */}
        </>
      )}

      {/* SNACKBAR (UNDO) */}
      {/* <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "Undo",
          onPress: () => {
            if (lastDeleted) {
              addFoodToMeal(mealType, lastDeleted);
            }
          },
        }}
      >
        Item removed
      </Snackbar> */}
    </View>
  );
});

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  mealCard: {
    borderWidth: 2,
    borderRadius: 22,
    paddingVertical: 10,
    marginBottom: 14,
    paddingBottom: 16,
  },

  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
  },

  mealTitle: {
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "200",
  },

  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
  },

  addButtonText: {
    fontWeight: "800",
    fontSize: 14,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },

  emptyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
  },

  emptyImage: {
    width: 60,
    height: 60,
  },

  emptyText: {
    fontSize: 14,
  },

  foodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  leftRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  foodName: {
    fontSize: 16,
    fontWeight: "600",
  },

  foodMeta: {
    fontSize: 13,
  },

  foodCalories: {
    fontSize: 16,
    fontWeight: "500",
  },

  deleteContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginVertical: 4,
    borderRadius: 12,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "500",
  },

  totalCalories: {
    fontSize: 18,
    fontWeight: "500",
  },
});
