// hooks/useFoodAnimation.ts

import { useRef, useState } from "react";

import { Animated, Easing, View } from "react-native";

import uuid from "react-native-uuid";

import { DailyFoodEntry, InventoryItem } from "../../../../../types/models";

interface UseFoodAnimationProps {
  mealType: string | null;

  addFoodToMeal: (mealType: string, entry: any) => void;

  removeFoodFromMeal: (mealType: string, entryId: string) => void;

  setRecents: any;

  triggerFeedback: any;
}

export default function useFoodAnimation({
  mealType,
  addFoodToMeal,
  removeFoodFromMeal,
  setRecents,
  triggerFeedback,
}: UseFoodAnimationProps) {
  const [flyingFood, setFlyingFood] = useState<InventoryItem | null>(null);

  const flyingX = useRef(new Animated.Value(0)).current;

  const flyingY = useRef(new Animated.Value(0)).current;

  const flyingScale = useRef(new Animated.Value(1)).current;

  const flyingOpacity = useRef(new Animated.Value(1)).current;

  const previewRef = useRef<View>(null);

  const animateAndAddFood = ({
    inventoryItem,
    quantity,
    sourceRef,
    editingPreviewItem,
    onComplete,
  }: {
    inventoryItem: InventoryItem;

    quantity: number;

    sourceRef: React.RefObject<View>;

    editingPreviewItem?: DailyFoodEntry | null;

    onComplete?: () => void;
  }) => {
    if (!mealType) return;

    const ratio = quantity / inventoryItem.baseQuantity;

    const entry = {
      id: editingPreviewItem?.id || uuid.v4().toString(),

      inventoryItemId: inventoryItem.id,

      name: inventoryItem.name,

      quantity,

      unit: inventoryItem.unit,

      calories: Math.round(inventoryItem.calories * ratio),

      protein: Math.round(inventoryItem.protein * ratio),

      carbs: Math.round(inventoryItem.carbs * ratio),

      fats: Math.round(inventoryItem.fats * ratio),

      createdAt: Date.now(),
    };

    // fallback
    if (!previewRef.current || !sourceRef.current) {
      addFoodToMeal(mealType, entry);

      return;
    }

    sourceRef.current.measureInWindow(
      (sourceX, sourceY, sourceWidth, sourceHeight) => {
        previewRef.current?.measureInWindow(
          (destX, destY, destWidth, destHeight) => {
            setFlyingFood(inventoryItem);

            // start position
            flyingX.setValue(sourceX);

            flyingY.setValue(sourceY);

            flyingScale.setValue(1);

            flyingOpacity.setValue(1);

            Animated.sequence([
              // small lift effect
              Animated.timing(flyingScale, {
                toValue: 1.08,

                duration: 120,

                easing: Easing.out(Easing.quad),

                useNativeDriver: true,
              }),

              // fly animation
              Animated.parallel([
                Animated.timing(flyingX, {
                  toValue: destX + destWidth / 2 - sourceWidth / 2,

                  duration: 650,

                  easing: Easing.bezier(0.22, 1, 0.36, 1),

                  useNativeDriver: true,
                }),

                Animated.timing(flyingY, {
                  toValue: destY + destHeight / 2 - sourceHeight / 2,

                  duration: 650,

                  easing: Easing.bezier(0.22, 1, 0.36, 1),

                  useNativeDriver: true,
                }),

                Animated.timing(flyingScale, {
                  toValue: 0.45,

                  duration: 650,

                  easing: Easing.bezier(0.22, 1, 0.36, 1),

                  useNativeDriver: true,
                }),

                Animated.timing(flyingOpacity, {
                  toValue: 0.65,

                  duration: 650,

                  easing: Easing.out(Easing.quad),

                  useNativeDriver: true,
                }),
              ]),
            ]).start(() => {
              // add item FIRST
              addFoodToMeal(mealType, entry);

              // tiny overlap delay
              setTimeout(() => {
                setFlyingFood(null);
              }, 120);

              // remove old edited item
              if (editingPreviewItem && mealType) {
                removeFoodFromMeal(mealType, editingPreviewItem.id);
              }

              // update recents
              setRecents((prev: any) => ({
                ...prev,

                [entry.inventoryItemId]: {
                  ...entry,

                  id: entry.inventoryItemId,

                  createdAt: Date.now(),
                },
              }));

              triggerFeedback({
                message: editingPreviewItem
                  ? `${entry.name} updated`
                  : `${entry.name} added`,
              });

              onComplete?.();
            });
          },
        );
      },
    );
  };

  return {
    previewRef,

    flyingFood,

    flyingX,

    flyingY,

    flyingScale,

    flyingOpacity,

    animateAndAddFood,
  };
}
