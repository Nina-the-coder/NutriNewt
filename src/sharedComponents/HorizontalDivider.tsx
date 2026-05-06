import React from "react";
import { View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function HorizontalDivider({ style }: any) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          borderWidth: 0.2,
          borderColor: colors.card,
        },
        style,
      ]}
    ></View>
  );
}
