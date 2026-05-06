import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsModal() {
  const [visible, setVisible] = useState(false);
  const { setTheme, theme } = useTheme();
  const { colors } = useTheme();

  const themes = ["dark", "light", "black", "ocean"] as const;

  const getIcon = (t: string) => {
    if (t === "dark") return "moon";
    if (t === "light") return "sunny";
    if (t === "black") return "contrast";
    if (t === "ocean") return "water";
    return "color-palette";
  };

  return (
    <>
      {/* ⚙️ SETTINGS BUTTON */}
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Ionicons
          name="settings-outline"
          size={24}
          color={colors.textPrimary}
        />
      </TouchableOpacity>

      {/* 🔥 MODAL */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            {/* Header */}
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Appearance
            </Text>

            {/* Theme Options */}
            {themes.map((t) => {
              const isActive = theme === t;

              return (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.option,
                    {
                      backgroundColor: colors.background,
                      borderColor: isActive ? colors.primary : "transparent",
                    },
                  ]}
                  onPress={() => {
                    setTheme(t);
                    setVisible(false);
                  }}
                >
                  {/* Left Side */}
                  <View style={styles.optionLeft}>
                    <Ionicons
                      name={getIcon(t)}
                      size={18}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[styles.optionText, { color: colors.textPrimary }]}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </View>

                  {/* <View
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor:
                        t === "dark"
                          ? "#2e2d2d"
                          : t === "light"
                            ? "#F3F4F6"
                            : t === "black"
                              ? "#121212"
                              : "#1e293b",
                    }}
                  /> */}

                  {/* Right Side */}
                  {isActive && (
                    <View
                      style={[
                        styles.checkCircle,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              onPress={async () => {
                await AsyncStorage.clear();
                console.log("Cleared");
              }}
            >
              <Text>Reset App</Text>
            </TouchableOpacity>

            {/* Close */}
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={styles.closeBtn}
            >
              <Text style={[styles.closeText, { color: colors.textSecondary }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "85%",
    borderRadius: 20,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },

  option: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  optionText: {
    fontSize: 15,
    fontWeight: "500",
  },

  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  closeBtn: {
    marginTop: 10,
    alignItems: "center",
  },

  closeText: {
    fontSize: 14,
  },
});
