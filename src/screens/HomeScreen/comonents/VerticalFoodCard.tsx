import React, { memo, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../../context/ThemeContext";

export default memo(function VerticalFoodCard({
  item,
  handleSelectItem,
  handleQuickAdd,
}: any) {
  const { colors } = useTheme();

  const cardRef = useRef<View>(null);

  return (
    <View
      ref={cardRef}
      style={[
        styles.listItem,
        {
          backgroundColor: colors.card,
        },
      ]}
      key={item.id}
    >
      {/* label */}
      <TouchableOpacity
        style={styles.label}
        onPress={() =>
          handleSelectItem(item)
        }
      >
        <Text
          style={[
            styles.foodName,
            {
              color:
                colors.textPrimary,
            },
          ]}
        >
          {item.name}{" "}
          <Text
            style={{
              color:
                colors.textSecondary,

              fontSize: 11,
            }}
          >
            ( {item.baseQuantity}{" "}
            {item.unit} )
          </Text>
        </Text>
      </TouchableOpacity>

      {/* + button */}
      <TouchableOpacity
        onPress={() =>
          handleQuickAdd(
            item,
            cardRef,
          )
        }
      >
        <Ionicons
          name={"add-circle"}
          size={32}
          color={colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  listItem: {
    height: 60,

    paddingHorizontal: 14,

    borderRadius: 12,

    marginTop: 10,

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  label: {
    paddingVertical: 14,

    height: "100%",

    width: "90%",

    justifyContent: "center",
  },

  foodName: {
    fontSize: 16,
  },
});