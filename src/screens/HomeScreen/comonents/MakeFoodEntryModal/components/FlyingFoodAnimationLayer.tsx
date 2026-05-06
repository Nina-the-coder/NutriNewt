import React from "react";

import {
  Animated,
  Text,
  View,
  StyleSheet,
} from "react-native";

import { InventoryItem } from "../../../../../types/models";

import { useTheme } from "../../../../../context/ThemeContext";

interface Props {
  flyingFood: InventoryItem | null;

  flyingOpacity: Animated.Value;

  flyingX: Animated.Value;

  flyingY: Animated.Value;

  flyingScale: Animated.Value;
}

export default function FlyingFoodAnimationLayer({
  flyingFood,
  flyingOpacity,
  flyingScale,
  flyingX,
  flyingY,
}: Props) {
  const { colors } = useTheme();

  if (!flyingFood) return null;

  return (
    <View
      pointerEvents="none"
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.flyingWrapper,
          {
            opacity: flyingOpacity,

            transform: [
              {
                translateX: flyingX,
              },

              {
                translateY: flyingY,
              },

              {
                scale: flyingScale,
              },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,

              shadowColor:
                colors.textPrimary,
            },
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.foodName,
              {
                color:
                  colors.textPrimary,
              },
            ]}
          >
            {flyingFood.name}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    zIndex: 99999,

    elevation: 99999,
  },

  flyingWrapper: {
    position: "absolute",
  },

  card: {
    minWidth: 110,

    maxWidth: 180,

    paddingHorizontal: 18,

    paddingVertical: 12,

    borderRadius: 18,

    justifyContent: "center",

    alignItems: "center",

    elevation: 12,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.18,

    shadowRadius: 18,
  },

  foodName: {
    fontSize: 14,

    fontWeight: "700",
  },
});