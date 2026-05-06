import * as Haptics from "expo-haptics";
import { ToastAndroid, Platform, Alert } from "react-native";

type FeedbackOptions = {
  message: string;
  haptic?: "light" | "medium" | "heavy";
};

export const triggerFeedback = ({
  message,
  haptic = "heavy",
}: FeedbackOptions) => {
  /* ================= HAPTICS ================= */

  const hapticMap = {
    light: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
  };

  Haptics.impactAsync(hapticMap[haptic]);

  /* ================= TOAST ================= */

  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert("", message);
  }
};