import React from "react";
import {
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../../../../context/ThemeContext";
import RecentFoodCard from "../../RecentFoodCard";
import HorizontalDivider from "../../../../../sharedComponents/HorizontalDivider";

export default function RecentsSection({
  recentItems,
  handleQuickAdd,
  handleSelectItemFromRecent,
}: any) {
  const { colors } = useTheme();

  if (recentItems.length === 0) return null;

  return (
    <>
      <HorizontalDivider style={{ marginTop: 16 }} />

      <Text
        style={[
          styles.title,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        Recents
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {recentItems.map((item: any) => (
          <RecentFoodCard
            key={item.inventoryItemId}
            item={item}
            handleQuickAdd={handleQuickAdd}
            handleAdjustQuantity={handleSelectItemFromRecent}
          />
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 20,
    marginBottom: 10,
  },
});