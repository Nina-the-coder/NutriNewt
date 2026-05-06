import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity as RNTouchableOpacity,
} from "react-native";
import { Swipeable, TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";

const VerticalFoodCard = ({
  item,
  toggleFavorite,
  handleEdit,
  onDelete,
}: any) => {
  const swipeRef = useRef<Swipeable>(null);
  const { colors } = useTheme();

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    return (
      <TouchableOpacity
        style={[styles.deleteBox, { backgroundColor: colors.danger }]}
        onPress={() => {
          swipeRef.current?.close();
          onDelete(item.id);
        }}
      >
        <Ionicons name="trash" size={22} color="#fff" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.cardWrapper}>
      <Swipeable
        ref={swipeRef}
        renderLeftActions={renderLeftActions}
        overshootRight={false}
        friction={2}
        leftThreshold={80}
        dragOffsetFromLeftEdge={20}
      >
        <RNTouchableOpacity
          style={[styles.listCard, { backgroundColor: colors.card }]}
          activeOpacity={0.9}
          onPress={() => handleEdit(item)}
        >
          {/* LEFT */}
          <View style={{ width: "40%" }}>
            <Text style={[styles.foodName, { color: colors.textPrimary }]}>
              {item.name}
            </Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>
              ( {item.baseQuantity}
              {item.unit} )
            </Text>
          </View>

          {/* CENTER */}
          <View style={styles.macroRow}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={[styles.macro, { color: colors.textSecondary }]}>
                {item.calories} kcal
              </Text>
              <Text style={[styles.macro, { color: colors.textSecondary }]}>
                p {item.protein}g
              </Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={[styles.macro, { color: colors.textSecondary }]}>
                C {item.carbs}g
              </Text>
              <Text style={[styles.macro, { color: colors.textSecondary }]}>
                F {item.fats}g
              </Text>
            </View>
          </View>

          {/* RIGHT */}
          <RNTouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => toggleFavorite(item.id)}
          >
            <Ionicons
              name={"star"}
              size={16}
              color={item.isFavorite ? colors.danger : "#888"}
            />
          </RNTouchableOpacity>
        </RNTouchableOpacity>
      </Swipeable>
    </View>
  );
}

export default React.memo(VerticalFoodCard);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  cardWrapper: {
    marginTop: 10,
  },

  listCard: {
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  foodName: {
    fontSize: 14,
    fontWeight: "600",
  },

  sub: {
    fontSize: 12,
    marginLeft: 8,
  },

  macroRow: {
    width: "30%",
  },

  macro: {
    fontSize: 12,
  },

  deleteBox: {
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    borderRadius: 14,
    height: "100%",
  },

  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },

  favoriteBtn: {
    height: 30,
    width: 30,
  },
});
