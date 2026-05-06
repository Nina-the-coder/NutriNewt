import React, { forwardRef, useMemo } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useTheme } from "../../../../../context/ThemeContext";
import { DailyFoodEntry } from "../../../../../types/models";
import HorizontalDivider from "../../../../../sharedComponents/HorizontalDivider";

const PreviewCard = forwardRef<
  View,
  {
    handleDeletePreviewItem: (item: DailyFoodEntry) => void;
    handleEditPreviewItem: (item: DailyFoodEntry) => void;
    mealType: string | null;
    currentMealItems: DailyFoodEntry[];
  }
>(
  (
    {
      handleDeletePreviewItem,
      handleEditPreviewItem,
      mealType,
      currentMealItems,
    },
    ref,
  ) => {
    const { colors } = useTheme();

    // =========================================================
    // 🔥 TOTALS
    // =========================================================

    const totalCalories = useMemo(() => {
      return currentMealItems.reduce((sum, item) => sum + item.calories, 0);
    }, [currentMealItems]);

    // =========================================================
    // 🔥 DELETE ACTION
    // =========================================================

    const renderLeftActions = (item: DailyFoodEntry) => {
      return (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => handleDeletePreviewItem(item)}
          style={styles.deleteAction}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      );
    };

    // =========================================================
    // 🔥 UI
    // =========================================================

    return (
      <View
        ref={ref}
        collapsable={false}
        style={[
          styles.previewContainer,
          {
            backgroundColor: colors.card,
            // shadowColor: colors.primary,
            elevation: 4,
          },
        ]}
      >
        {/* ========================================================= */}
        {/* 🔥 HEADER */}
        {/* ========================================================= */}

        <View style={styles.header}>
          <Text style={{ color: colors.textSecondary }}>In {mealType}</Text>
          <Text style={{ color: colors.textSecondary }}>
            {currentMealItems.length} items
          </Text>
          {/* <Text style={{ color: colors.textSecondary }}>
            {totalCalories} kcal
          </Text> */}
        </View>

        {/* ========================================================= */}
        {/* 🔥 EMPTY STATE */}
        {/* ========================================================= */}

        {currentMealItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No food added yet
            </Text>
            {/* 
            <Text
              style={[styles.emptySubtext, { color: colors.textSecondary }]}
            >
              Quick add foods to build your meal
            </Text> */}
          </View>
        ) : (
          <>
            {/* ========================================================= */}
            {/* 🔥 SCROLLABLE FOOD LIST */}
            {/* ========================================================= */}

            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              style={styles.itemsScroll}
              contentContainerStyle={{
                paddingBottom: 8,
              }}
            >
              {currentMealItems.map((item: DailyFoodEntry) => (
                <Swipeable
                  key={item.id}
                  friction={2}
                  rightThreshold={40}
                  overshootRight={false}
                  renderLeftActions={() => renderLeftActions(item)}
                >
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleEditPreviewItem(item)}
                    style={[
                      styles.previewRow,
                      {
                        backgroundColor: colors.background,
                      },
                    ]}
                  >
                    {/* ========================================= */}
                    {/* FOOD INFO */}
                    {/* ========================================= */}

                    <View style={styles.foodInfo}>
                      <Text
                        style={[
                          styles.previewFoodName,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>

                      <Text
                        style={{
                          color: colors.textSecondary,
                          fontSize: 12,
                          marginTop: 2,
                        }}
                      >
                        {item.quantity}
                        {item.unit}
                      </Text>
                    </View>

                    {/* ========================================= */}
                    {/* CALORIES */}
                    {/* ========================================= */}

                    <View style={styles.calorieContainer}>
                      <Text
                        style={[
                          styles.previewCalories,
                          {
                            color: colors.textPrimary,
                          },
                        ]}
                      >
                        {item.calories} kcal
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              ))}
            </ScrollView>

            {/* ========================================================= */}
            {/* 🔥 BOTTOM FADE INDICATOR */}
            {/* ========================================================= */}
{/* 
            {currentMealItems.length > 4 && (
              <View
                pointerEvents="none"
                style={[
                  styles.bottomFade,
                  {
                    backgroundColor: colors.card,
                  },
                ]}
              />
            )} */}
          </>
        )}
      </View>
    );
  },
);

export default PreviewCard;

const styles = StyleSheet.create({
  previewContainer: {
    padding: 12,
    borderRadius: 24,
    // marginTop: 18,
    // marginBottom: 10,
    // overflow: "hidden",
  },

  // =========================================================
  // 🔥 HEADER
  // =========================================================

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 18,
  },

  previewTitle: {
    fontSize: 18,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  previewSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "500",
  },

  // =========================================================
  // 🔥 LIVE BADGE
  // =========================================================

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
    gap: 6,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },

  liveText: {
    fontWeight: "700",
    fontSize: 12,
  },

  // =========================================================
  // 🔥 EMPTY STATE
  // =========================================================

  emptyContainer: {
    paddingVertical: 12,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 14,
    fontWeight: "600",
  },

  emptySubtext: {
    marginTop: 4,
    fontSize: 12,
  },

  // =========================================================
  // 🔥 FOOD LIST
  // =========================================================

  itemsScroll: {
    maxHeight: 200,
  },

  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 10,
    paddingVertical: 14,

    borderRadius: 12,
    marginBottom: 6,
  },

  foodInfo: {
    flex: 1,
    paddingRight: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  previewFoodName: {
    fontSize: 14,
    fontWeight: "700",
  },

  calorieContainer: {
    alignItems: "flex-end",
  },

  previewCalories: {
    fontSize: 12,
    fontWeight: "600",
  },

  // =========================================================
  // 🔥 DELETE ACTION
  // =========================================================

  deleteAction: {
    justifyContent: "center",
    alignItems: "center",

    width: 110,

    marginBottom: 10,
    borderRadius: 18,

    backgroundColor: "#d11a2a",
  },

  deleteText: {
    color: "white",
    fontWeight: "700",
    fontSize: 13,
  },

  // =========================================================
  // 🔥 BOTTOM FADE
  // =========================================================

  bottomFade: {
    position: "absolute",
    bottom: 18,
    left: 18,
    right: 18,
    height: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,


  },
});
