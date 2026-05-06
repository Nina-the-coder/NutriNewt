// utils/tipStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const TIP_PREFIX = "tip_seen_";

export const hasSeenTip = async (id: string) => {
  const value = await AsyncStorage.getItem(TIP_PREFIX + id);
  return value === "true";
};

export const markTipSeen = async (id: string) => {
  await AsyncStorage.setItem(TIP_PREFIX + id, "true");
};