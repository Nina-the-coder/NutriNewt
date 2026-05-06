import React from "react";
import {
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../../../../context/ThemeContext";
import FavoritesFoodCard from "../../FavoritesFoodCard";
import HorizontalDivider from "../../../../../sharedComponents/HorizontalDivider";

export default function FavoritesSection({
  favoriteCardItems,
  handleQuickAdd,
  handleSelectItem,
}: any) {
  const { colors } = useTheme();

  if (favoriteCardItems.length === 0) return null;

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
        Favorites
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {favoriteCardItems.map((item: any) => (
          <FavoritesFoodCard
            key={item.id}
            item={item.originalItem}
            handleQuickAdd={handleQuickAdd}
            handleAdjustQuantity={handleSelectItem}
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