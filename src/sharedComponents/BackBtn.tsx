import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function BackBtn({ onClose }: any) {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.backCircle,
        {
          backgroundColor: colors.background,
          borderColor: colors.textSecondary,
        },
      ]}
      onPress={() => onClose()}
    >
      <Ionicons
        style={[styles.backArrow, { color: colors.textSecondary }]}
        name={"chevron-back-outline"}
        size={24}
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  /* Back Button */
  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 20,

    borderWidth: 0.1,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  backArrow: {
    // fontSize: 22,
    // fontWeight: "800",
    // marginTop: -2,
  },
});
