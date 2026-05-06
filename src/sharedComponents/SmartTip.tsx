import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { hasSeenTip, markTipSeen } from "../utils/tipStorage";
import { useTheme } from "../context/ThemeContext";

interface SmartTipProps {
  id: string;
  text: string;
  style?: any;
}

export default function SmartTip({ id, text, style }: SmartTipProps) {
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();

  useEffect(() => {
    const check = async () => {
      const seen = await hasSeenTip(id);

      if (!seen) {
        setVisible(true);

        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start();
        }, 50);
      }
    };

    check();
  }, []);

  const handleDismiss = async () => {
    await markTipSeen(id);

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.textSecondary , opacity: fadeAnim },
        style,
      ]}
    >
      <Text style={[styles.text, { color: colors.background }]}>
        💡 {text}
      </Text>

      <TouchableOpacity onPress={handleDismiss}>
        <Text style={[styles.dismiss, { color: colors.background }]}>
          Got it
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
  },
  text: {
    fontSize: 13,
  },
  dismiss: {
    textAlign: "right",
    marginTop: 6,
    fontSize: 12,
    padding: 4,
  },
});