import React from "react";
import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import { DailyFoodEntry } from "../../../../../types/models";
import { useTheme } from "../../../../../context/ThemeContext";

interface StickyMealBarProps {
  mealType: string | null;
  items: DailyFoodEntry[];
  animatedStyle: any;
  onExpand: () => void;
}

export default function StickyMealBar({
  mealType,
  items,
  animatedStyle,
  onExpand,
}: StickyMealBarProps) {
  const { colors } = useTheme();

  const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onExpand}
        style={[
          styles.inner,
          {
            backgroundColor: colors.primary,
          },
        ]}
      >
        <Text
          style={{
            color: colors.card,
            fontWeight: "700",
          }}
        >
          {mealType} • {items.length} items
        </Text>

        <Text
          style={{
            color: colors.card,
            fontWeight: "700",
          }}
        >
          {totalCalories} kcal
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 130,
    left: 20,
    right: 20,
    zIndex: 999,
  },

  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 16,
    paddingVertical: 14,

    borderRadius: 18,

    elevation: 6,
  },
});
