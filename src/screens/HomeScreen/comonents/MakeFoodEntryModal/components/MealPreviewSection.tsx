import React from "react";
import { View, Animated } from "react-native";
import PreviewCard from "./PreviewCard";
import { DailyFoodEntry } from "../../../../../types/models";

interface MealPreviewSectionProps {
  previewRef: any;
  animatedStyle: any;
  mealType: string | null;
  currentMealItems: DailyFoodEntry[];
  handleDeletePreviewItem: (item: DailyFoodEntry) => void;
  handleEditPreviewItem: (item: DailyFoodEntry) => void;
}

export default function MealPreviewSection({
  previewRef,
  animatedStyle,
  mealType,
  currentMealItems,
  handleDeletePreviewItem,
  handleEditPreviewItem,
}: MealPreviewSectionProps) {
  return (
    <Animated.View style={animatedStyle}>
      <PreviewCard
        ref={previewRef}
        mealType={mealType}
        currentMealItems={currentMealItems}
        handleDeletePreviewItem={handleDeletePreviewItem}
        handleEditPreviewItem={handleEditPreviewItem}
      />
    </Animated.View>
  );
}