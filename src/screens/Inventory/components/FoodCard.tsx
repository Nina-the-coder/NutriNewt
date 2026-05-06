import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../../context/ThemeContext";

const FoodCard = ({ item, handleEdit, isRecent }: any) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      key={item.id}
      style={[styles.foodCard, { backgroundColor: colors.card }]}
      onPress={isRecent ? undefined : () => handleEdit(item)}
    >
      {/* upper part */}
      <View style={styles.body}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
          {item.name}{" "}
          <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
            ( {item.baseQuantity}
            {item.unit} )
          </Text>
        </Text>
      </View>

      {/* lower part */}
      <View>
        <Text style={[styles.cardMacro, { color: colors.textSecondary }]}>
          {item.calories} kcal
        </Text>
        <Text style={[styles.cardMacro, { color: colors.textSecondary }]}>
          p - {item.protein}g
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(FoodCard);

const styles = StyleSheet.create({
  foodCard: {
    width: 120,
    padding: 12,
    borderRadius: 16,
    marginRight: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
  },

  body: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    fontWeight: "600",
    textAlign: "center",
  },

  cardSub: {
    fontSize: 11,
  },

  cardMacro: {
    fontSize: 12,
  },
});
