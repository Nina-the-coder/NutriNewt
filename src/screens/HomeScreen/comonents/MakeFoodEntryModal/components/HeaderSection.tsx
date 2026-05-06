import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BackBtn from "../../../../../sharedComponents/BackBtn";
import { useTheme } from "../../../../../context/ThemeContext";

interface HeaderSectionProps {
  mealType: string | null;
  step: "select" | "edit";
  onClose: () => void;
  onBackToSelect: () => void;
}

export default function HeaderSection({
  mealType,
  // step,
  onClose,
  // onBackToSelect,
}: HeaderSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <BackBtn onClose={onClose} />

      <Text style={[styles.title, { color: colors.primary }]}>
        Add to {mealType || "meal"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
  },
});
