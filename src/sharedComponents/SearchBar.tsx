import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function SearchBar({ search, setSearch }: any) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* ICON */}
      <Ionicons
        name="search"
        size={18}
        color={colors.textSecondary}
        style={styles.icon}
      />

      {/* INPUT */}
      <TextInput
        placeholder="Search Food"
        placeholderTextColor={colors.textSecondary}
        value={search}
        onChangeText={setSearch}
        style={[styles.input, { color: colors.textPrimary }]}
      />

      {/* CLEAR BUTTON */}
      {search.length > 0 && (
        <Ionicons
          name="close-circle"
          size={24}
          color={colors.textSecondary}
          onPress={() => setSearch("")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,

    // // 🔥 iOS shadow
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,

    // // 🔥 Android shadow
    // elevation: 4,
  },

  icon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
  },
});
