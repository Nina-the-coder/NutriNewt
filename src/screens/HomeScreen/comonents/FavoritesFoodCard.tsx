import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InventoryItem } from "../../../types/models";
import { useTheme } from "../../../context/ThemeContext";

interface Props {
  item: InventoryItem;
  handleQuickAdd: (
    item: InventoryItem,
    cardRef: React.RefObject<View | null>,
  ) => void;
  handleAdjustQuantity: (item: InventoryItem) => void;
}

export default function FavoritesFoodCard({
  item,
  handleQuickAdd,
  handleAdjustQuantity,
}: Props) {
  const { colors } = useTheme();
  const cardRef = useRef<View>(null);

  return (
    <TouchableOpacity
      style={[styles.foodCard, { backgroundColor: colors.card }]}
      activeOpacity={0.9}
      onPress={() => handleAdjustQuantity(item)}
    >
      {/* BODY */}
      <View style={styles.body}>
        <Text
          style={[styles.cardTitle, { color: colors.textPrimary }]}
          numberOfLines={2}
        >
          {item.name}{" "}
          <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
            ( {item.baseQuantity}
            {item.unit} )
          </Text>
        </Text>
      </View>

      {/* PLUS BUTTON */}
      <TouchableOpacity
        ref={cardRef}
        onPress={(e) => {
          e.stopPropagation();
          handleQuickAdd(item, cardRef);
        }}
        style={styles.plusBtn}
      >
        <Ionicons name="add-circle" size={32} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  foodCard: {
    width: 120,
    padding: 12,
    borderRadius: 16,
    marginRight: 10,
    marginBottom: 4,
    justifyContent: "space-between",
    alignItems: "center",
  },

  body: {
    alignItems: "center",
    gap: 4,
  },

  cardTitle: {
    fontWeight: "500",
    textAlign: "center",
    fontSize: 13,
  },

  cardSub: {
    fontSize: 11,
  },

  plusBtn: {
    marginTop: 8,
  },
});
