import React, { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
  Dimensions,
  Platform,
  Easing,
} from "react-native";
import { useTheme } from "../../../../../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InventoryItem } from "../../../../../types/models";

const BottomSheet = ({
  visible,
  selectedItem,
  quantity,
  setQuantity,
  todayQty,
  reset,
  handleAddFood,
  mealType,
  editingPreviewItem,
}: {
  visible: boolean;
  selectedItem: InventoryItem;
  quantity: string;
  setQuantity: (quantity: string) => void;
  todayQty: number;
  reset: () => void;
  handleAddFood: (sourceRef: React.RefObject<View | null>) => void;
  mealType: string | null;
  editingPreviewItem: any;
}) => {
  const { colors } = useTheme();

  const insets = useSafeAreaInsets();
  const addButtonRef = useRef<View | null>(null);

  const screenHeight = Dimensions.get("window").height;
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const [internalVisible, setInternalVisible] = useState(visible);
  const backdropOpacity = translateY.interpolate({
    inputRange: [0, screenHeight * 0.6, screenHeight],
    outputRange: [0.3, 0.15, 0],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (visible) {
      setInternalVisible(true); // mount first

      requestAnimationFrame(() => {
        Animated.spring(translateY, {
          toValue: 0,
          damping: 18,
          stiffness: 120,
          useNativeDriver: true,
        }).start();
      });
    } else {
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setInternalVisible(false); // unmount AFTER animation
      });
    }
  }, [visible]);

  return (
    <>
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY }],
            paddingBottom: Platform.OS === "ios" ? insets.bottom + 20 : 20,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>
          {selectedItem.name}
        </Text>

        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Quantity ({selectedItem.unit})
        </Text>

        {/* quantity row */}
        <View style={styles.quantityRow}>
          {(() => {
            const stepSize = selectedItem.unit === "pcs" ? 1 : 10;
            return (
              <>
                <TouchableOpacity
                  style={[
                    styles.quantityBtn,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() =>
                    setQuantity(String(Math.max(0, todayQty - stepSize)))
                  }
                >
                  <Text
                    style={[styles.stepText, { color: colors.textPrimary }]}
                  >
                    - {stepSize}
                  </Text>
                </TouchableOpacity>

                <TextInput
                  style={[
                    styles.qty,
                    {
                      color: colors.textPrimary,
                      backgroundColor: colors.card,
                    },
                  ]}
                  value={quantity}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const cleaned = text.replace(/[^0-9]/g, "");
                    setQuantity(cleaned);
                  }}
                />
                <TouchableOpacity
                  style={[
                    styles.quantityBtn,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setQuantity(String(todayQty + stepSize))}
                >
                  <Text
                    style={[styles.stepText, { color: colors.textPrimary }]}
                  >
                    + {stepSize}
                  </Text>
                </TouchableOpacity>
              </>
            );
          })()}
        </View>

        {/* SERVING size adjusting button */}
        <TouchableOpacity
          style={[styles.servingBtn, { borderColor: colors.card }]}
          onPress={() => setQuantity(String(selectedItem.baseQuantity))}
        >
          <Text style={{ color: colors.textSecondary }}>
            default Serving ({selectedItem.baseQuantity}
            {selectedItem.unit})
          </Text>
        </TouchableOpacity>

        {/* ACTIONS */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.cancelBtn,
              {
                borderColor: colors.textSecondary,
              },
            ]}
            onPress={() => {
              reset();
            }}
          >
            <Text
              style={{
                color: colors.textSecondary,
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <View ref={addButtonRef} style={{ flex: 1 }}>
            <TouchableOpacity
              style={[
                styles.addBtn,
                {
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => handleAddFood(addButtonRef)}
            >
              <Text
                style={{
                  color: colors.primary,
                }}
              >
                {editingPreviewItem ? "Update Food" : `Add to ${mealType}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    bottom: 0,

    alignSelf: "center",
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  label: {
    marginBottom: 5,
  },

  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // add this
    marginVertical: 10,
  },

  quantityBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 12,
  },

  stepText: {
    fontSize: 18,
    fontWeight: "800",
  },

  qty: {
    paddingHorizontal: 48,
    // paddingVertical: 12,

    fontSize: 18,
    borderRadius: 12,
    elevation: 4,
  },

  servingBtn: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    // elevation: 4,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 24,
    marginBottom: 156,
  },

  cancelBtn: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
  },

  addBtn: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
  },
});
